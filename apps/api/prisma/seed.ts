import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SOURCES = [
  { name: 'РИА Новости', url: 'https://ria.ru/export/rss2/', language: 'ru', parserType: 'rss' },
  { name: 'ТАСС', url: 'https://tass.ru/rss/v2.xml', language: 'ru', parserType: 'rss' },
  { name: 'Lenta.ru', url: 'https://lenta.ru/rss/news', language: 'ru', parserType: 'rss' },
  { name: 'Meduza', url: 'https://meduza.io/rss/all', language: 'ru', parserType: 'rss' },
];

const NEWS = [
  { title: 'Центробанк сохранил ключевую ставку на уровне 21%', content: 'Эксперты отмечают, что политика направлена на сдерживание инфляции.' },
  { title: 'В Москве открыли новый участок БКЛ метро', content: 'Мероприятие собрало более тысячи участников.' },
  { title: 'Курс рубля укрепился на фоне роста цен на нефть', content: 'На торгах курс достиг максимальных значений за месяц.' },
  { title: 'В России запустили производство электромобилей', content: 'Мощность завода составит 50 тысяч автомобилей в год.' },
  { title: 'Волонтёры высадили 10 тысяч деревьев в Подмосковье', content: 'Акция прошла в рамках экологической программы региона.' },
  { title: 'Минздрав одобрил новую вакцину для профилактики гриппа', content: 'Клинические испытания показали высокую эффективность.' },
  { title: 'Российские аграрии собрали рекордный урожай зерновых', content: 'Объём экспорта вырос на 15% за отчётный период.' },
  { title: 'В Москве прошёл форум по искусственному интеллекту', content: 'Участие приняли представители крупнейших IT-компаний.' },
];

const LOCATIONS = [
  { name: 'Москва', type: 'city', countryCode: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Санкт-Петербург', type: 'city', countryCode: 'RU', lat: 59.9343, lng: 30.3351 },
  { name: 'Россия', type: 'country', countryCode: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Московская область', type: 'region', countryCode: 'RU', lat: 55.7558, lng: 37.6173 },
];

const TRENDS = [
  { title: 'Экономика и финансы', summary: 'Ключевая ставка, курс рубля, экспорт и поддержка IT-сектора' },
  { title: 'Инфраструктура', summary: 'Метро, транспорт, строительство и городские проекты' },
  { title: 'Экология и общество', summary: 'Озеленение, волонтёры, экологические программы' },
  { title: 'Наука и технологии', summary: 'ИИ, медицина, инновации' },
];

async function main() {
  console.log('Seeding database...');

  const sources = await Promise.all(
    SOURCES.map((s) =>
      prisma.source.upsert({
        where: { name: s.name },
        create: s,
        update: {},
      })
    )
  );

  const locations = await Promise.all(
    LOCATIONS.map((l) =>
      prisma.location.upsert({
        where: {
          name_type_countryCode: { name: l.name, type: l.type, countryCode: l.countryCode },
        },
        create: l,
        update: {},
      })
    )
  );

  const articles: { id: string }[] = [];
  const baseUrl = 'https://seed.newsmap.local/news/';

  for (let i = 0; i < NEWS.length; i++) {
    const n = NEWS[i];
    const sourceUrl = `${baseUrl}${i}`;
    const article = await prisma.article.upsert({
      where: { sourceUrl },
      create: {
        title: n.title,
        content: n.content,
        summary: n.content.slice(0, 100) + '...',
        sourceUrl,
        publishedAt: new Date(Date.now() - (i + 1) * 3600000),
        sourceId: sources[i % sources.length].id,
        aiMetadata: { category: 'news', sentiment: 'neutral' },
      },
      update: {},
    });
    articles.push(article);
  }

  for (let i = 0; i < Math.min(articles.length, locations.length * 2); i++) {
    await prisma.articleLocation.upsert({
      where: {
        articleId_locationId: { articleId: articles[i].id, locationId: locations[i % locations.length].id },
      },
      create: { articleId: articles[i].id, locationId: locations[i % locations.length].id },
      update: {},
    }).catch(() => {});
  }

  const trends = await Promise.all(
    TRENDS.map(async (t) => {
      const existing = await prisma.trend.findFirst({ where: { title: t.title } });
      return existing ?? prisma.trend.create({ data: { ...t, articleCount: 0 } });
    })
  );

  for (let i = 0; i < articles.length; i++) {
    await prisma.trendArticle.upsert({
      where: {
        trendId_articleId: { trendId: trends[i % trends.length].id, articleId: articles[i].id },
      },
      create: { trendId: trends[i % trends.length].id, articleId: articles[i].id },
      update: {},
    }).catch(() => {});
  }

  for (const trend of trends) {
    const count = await prisma.trendArticle.count({ where: { trendId: trend.id } });
    await prisma.trend.update({
      where: { id: trend.id },
      data: { articleCount: count },
    });
  }

  const passwordHash = await bcrypt.hash('demo123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@newsmap.local' },
    create: {
      email: 'demo@newsmap.local',
      passwordHash,
      name: 'Demo User',
      role: 'user',
    },
    update: {},
  });

  console.log('Seed completed.');
  console.log(`  Sources: ${sources.length}, Articles: ${articles.length}, Locations: ${locations.length}`);
  console.log(`  Trends: ${trends.length}`);
  console.log('  Demo user: demo@newsmap.local / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
