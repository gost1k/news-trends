/**
 * Демо-заполнение БД (~100 записей в sources, articles, locations, tags + связи).
 * Тренды — «горячие» новостные темы с article_count 10–25.
 *
 * Перед заливкой удаляет старые демо-данные (статьи, тренды, теги, локации, источники).
 * Пользователей @newsmap.local тоже сбрасывает.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const N = 100;

/** Популярные новостные темы (не абстрактные категории) + целевой диапазон статей */
const TREND_TOPICS: { title: string; summary: string; minArticles: number; maxArticles: number }[] = [
  {
    title: 'Эскалация конфликта Израиль — Иран',
    summary: 'Удары по объектам, ответные заявления, позиция ООН и соседних стран',
    minArticles: 18,
    maxArticles: 25,
  },
  {
    title: 'Ситуация вокруг Украины',
    summary: 'Переговоры, обмены, санкции и гуманитарные коридоры',
    minArticles: 20,
    maxArticles: 25,
  },
  {
    title: 'Президентские выборы в США',
    summary: 'Праймериз, дебаты, опросы и иностранное вмешательство',
    minArticles: 15,
    maxArticles: 22,
  },
  {
    title: 'Протесты и беспорядки в Иране',
    summary: 'Демонстрации, интернет-блокировки, реакция властей',
    minArticles: 12,
    maxArticles: 20,
  },
  {
    title: 'Энергетический кризис и цены на газ в Европе',
    summary: 'Поставки СПГ, хранилища, промышленность и быт',
    minArticles: 14,
    maxArticles: 21,
  },
  {
    title: 'Регулирование искусственного интеллекта',
    summary: 'Законы ЕС, США и Китая, ответственность разработчиков',
    minArticles: 10,
    maxArticles: 18,
  },
  {
    title: 'Кибератаки на банки и инфраструктуру',
    summary: 'Ransomware, расследования, страхование и резервы',
    minArticles: 11,
    maxArticles: 19,
  },
  {
    title: 'Климат: рекордная жара и лесные пожары',
    summary: 'Саммиты, компенсации, эвакуации и прогнозы учёных',
    minArticles: 13,
    maxArticles: 20,
  },
  {
    title: 'Торговые отношения США и Китая',
    summary: 'Пошлины, редкоземельные металлы, цепочки поставок',
    minArticles: 12,
    maxArticles: 18,
  },
  {
    title: 'Космос: миссии на Луну и Марс',
    summary: 'Artemis, частные запуски, сотрудничество и гонка',
    minArticles: 10,
    maxArticles: 16,
  },
  {
    title: 'Криптовалюты и регуляторы',
    summary: 'ETF, биржи, AML и уголовные дела',
    minArticles: 11,
    maxArticles: 17,
  },
  {
    title: 'Миграционный кризис на границах ЕС',
    summary: 'Лагеря, соглашения с третьими странами, права беженцев',
    minArticles: 12,
    maxArticles: 19,
  },
];

const COUNTRY_CODES = ['RU', 'US', 'IR', 'IL', 'UA', 'GB', 'DE', 'FR', 'CN', 'BR', 'IN', 'TR', 'PL', 'ES', 'JP'];
const LOC_TYPES = ['city', 'region', 'country', 'district'] as const;

const TAG_PREFIXES = [
  'политика',
  'экономика',
  'война',
  'технологии',
  'медицина',
  'спорт',
  'экология',
  'кризис',
  'выборы',
  'санкции',
  'энергетика',
  'космос',
];

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Заголовки «под» разные темы — чтобы пул статей выглядел правдоподобно */
const TITLE_TEMPLATES = [
  (i: number) => `Министр прокомментировал последние события: заявление №${i}`,
  (i: number) => `На границе зафиксирована новая вспышка напряжённости — репортаж ${i}`,
  (i: number) => `Эксперты оценили последствия для рынков (обзор ${i})`,
  (i: number) => `ООН созывает экстренное заседание по пункту повестки ${i}`,
  (i: number) => `В столице прошла многотысячная акция — кадры с места ${i}`,
  (i: number) => `Киберполиция расследует инцидент с утечкой данных (дело ${i})`,
  (i: number) => `Цены на энергоносители: аналитики прогнозируют сценарий ${i}`,
  (i: number) => `Космическое агентство отчиталось о ходе миссии этап ${i}`,
  (i: number) => `Регулятор опубликовал новые требования к отрасли — пакет ${i}`,
  (i: number) => `Спортивная федерация объявила решение по итогам сезона ${i}`,
];

async function main() {
  console.log('Clearing previous demo data...');
  await prisma.$transaction([
    prisma.trendArticle.deleteMany(),
    prisma.articleTag.deleteMany(),
    prisma.articleLocation.deleteMany(),
    prisma.article.deleteMany(),
    prisma.trend.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.location.deleteMany(),
    prisma.source.deleteMany(),
  ]);
  await prisma.user.deleteMany({ where: { email: { endsWith: '@newsmap.local' } } });

  console.log('Seeding sources...');
  const sourcesData = Array.from({ length: N }, (_, i) => ({
    name: `Демо-источник ${String(i + 1).padStart(3, '0')}`,
    url: `https://seed.newsmap.local/rss/${i}`,
    language: i % 5 === 0 ? 'en' : 'ru',
    parserType: 'rss',
  }));
  await prisma.source.createMany({ data: sourcesData });
  const sources = await prisma.source.findMany({ orderBy: { name: 'asc' } });

  console.log('Seeding locations...');
  const locationsData = Array.from({ length: N }, (_, i) => ({
    name: `Населённый пункт ${i + 1}`,
    type: LOC_TYPES[i % LOC_TYPES.length],
    countryCode: COUNTRY_CODES[i % COUNTRY_CODES.length],
    lat: 30 + (i % 50) + Math.random(),
    lng: -20 + (i % 60) + Math.random(),
  }));
  await prisma.location.createMany({ data: locationsData });
  const locations = await prisma.location.findMany();

  console.log('Seeding tags...');
  const tagsData = Array.from({ length: N }, (_, i) => ({
    name: `${TAG_PREFIXES[i % TAG_PREFIXES.length]}-${i + 1}`,
    category: ['politics', 'economy', 'tech', 'society'][i % 4],
  }));
  await prisma.tag.createMany({ data: tagsData });
  const tags = await prisma.tag.findMany();

  console.log('Seeding articles...');
  const baseUrl = 'https://seed.newsmap.local/a/';
  const articlesData = Array.from({ length: N }, (_, i) => {
    const tmpl = TITLE_TEMPLATES[i % TITLE_TEMPLATES.length];
    const title = tmpl(i + 1);
    const content = `${title}. Корреспонденты сообщают о развитии ситуации. Официальные лица пока не дали развёрнутых комментариев. Эксперты связывают события с более широким геополитическим контекстом. Мы продолжим следить за обновлениями.`;
    return {
      title,
      content,
      summary: content.slice(0, 140) + '…',
      sourceUrl: `${baseUrl}${i}`,
      publishedAt: new Date(Date.now() - (i + 1) * 45 * 60 * 1000),
      sourceId: sources[i % sources.length].id,
      aiMetadata: {
        category: TAG_PREFIXES[i % TAG_PREFIXES.length],
        sentiment: ['neutral', 'negative', 'positive'][i % 3],
        seedIndex: i,
      },
    };
  });
  await prisma.article.createMany({ data: articlesData });
  const articles = await prisma.article.findMany({ orderBy: { sourceUrl: 'asc' } });

  console.log('Seeding article_location & article_tag...');
  const alPairs: { articleId: string; locationId: string }[] = [];
  const atPairs: { articleId: string; tagId: string }[] = [];
  for (let i = 0; i < N; i++) {
    const a = articles[i];
    alPairs.push({ articleId: a.id, locationId: locations[i % locations.length].id });
    alPairs.push({ articleId: a.id, locationId: locations[(i + 7) % locations.length].id });
    atPairs.push({ articleId: a.id, tagId: tags[i % tags.length].id });
    atPairs.push({ articleId: a.id, tagId: tags[(i + 13) % tags.length].id });
  }
  await prisma.articleLocation.createMany({ data: alPairs, skipDuplicates: true });
  await prisma.articleTag.createMany({ data: atPairs, skipDuplicates: true });

  console.log('Seeding trends (hot topics) + trend_articles...');
  const shuffledArticles = shuffle(articles);
  let cursor = 0;

  for (const topic of TREND_TOPICS) {
    const want = randInt(topic.minArticles, topic.maxArticles);
    const trend = await prisma.trend.create({
      data: {
        title: topic.title,
        summary: topic.summary,
        articleCount: 0,
        detectedAt: new Date(Date.now() - randInt(1, 72) * 3600000),
      },
    });

    const picked: typeof articles = [];
    while (picked.length < want && cursor < shuffledArticles.length) {
      picked.push(shuffledArticles[cursor++]);
    }
    if (picked.length < want) {
      const extra = shuffle(articles).slice(0, want - picked.length);
      picked.push(...extra);
    }

    await prisma.trendArticle.createMany({
      data: picked.map((article) => ({ trendId: trend.id, articleId: article.id })),
    });

    await prisma.trend.update({
      where: { id: trend.id },
      data: { articleCount: picked.length },
    });
  }

  console.log('Seeding demo users...');
  const passwordHash = await bcrypt.hash('demo123', 10);
  const usersData = [
    { email: 'demo@newsmap.local', name: 'Demo User', role: 'user' },
    { email: 'admin@newsmap.local', name: 'Admin Demo', role: 'admin' },
    ...Array.from({ length: 8 }, (_, i) => ({
      email: `user${i + 1}@newsmap.local`,
      name: `Пользователь ${i + 1}`,
      role: 'user',
    })),
  ];
  for (const u of usersData) {
    await prisma.user.create({
      data: { ...u, passwordHash },
    });
  }

  const trendCount = await prisma.trend.count();
  const taCount = await prisma.trendArticle.count();

  console.log('Seed completed.');
  console.log(`  sources: ${sources.length}, articles: ${articles.length}, locations: ${locations.length}, tags: ${tags.length}`);
  console.log(`  article_locations: ~${alPairs.length}, article_tags: ~${atPairs.length}`);
  console.log(`  trends: ${trendCount} (hot topics), trend_articles: ${taCount}`);
  console.log('  Users: demo@newsmap.local / demo123 (+ user1..8@newsmap.local, admin@newsmap.local)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
