# apps/api — Node.js Backend

REST API сервер на Express + TypeScript с Prisma ORM.

## Требования

- Node.js 22+ (см. `engines` в корневом `package.json`)
- PostgreSQL/Redis/Elasticsearch доступны (обычно через `npm run docker:up` из корня)
- заполненный `.env` с `DATABASE_URL`

## Быстрый старт

```bash
cd apps/api
npm install
npm run db:push
npm run dev
```

## Структура src/

```
src/
├── index.ts              # Точка входа: Express app, подключение роутеров, middleware
├── config/               # Конфигурация приложения
├── routes/               # REST-маршруты (тонкий слой)
├── controllers/          # Обработчики HTTP-запросов
├── services/             # Бизнес-логика
├── models/               # Prisma-хелперы, raw SQL, типы
├── middleware/           # Express middleware
├── workers/              # Фоновые задачи (BullMQ)
└── ws/                   # WebSocket (Socket.io)
```

### config/

Конфигурация из переменных окружения. Не содержит логики.

| Файл | Назначение |
|------|------------|
| `env.ts` | Парсинг `.env`: `port`, `database.url`, `redis`, `elasticsearch`, `ollama`, `jwt`. Единая точка доступа к конфигу |
| `db.ts` | (опционально) Инициализация Prisma Client, экспорт `prisma` |
| `redis.ts` | (опционально) Подключение к Redis для BullMQ и rate limiting |

### routes/

Только определение маршрутов и привязка к контроллерам. Без логики.

| Файл | Маршруты | Контроллер |
|------|----------|------------|
| `newsRouter.ts` | `GET /`, `GET /:id`, `GET /search`, `GET /:id/similar` | newsController |
| `trendsRouter.ts` | `GET /`, `GET /:id` | trendsController |
| `chatRouter.ts` | `POST /` | chatController |
| `mapRouter.ts` | `GET /articles`, `GET /clusters` | mapController |
| `authRouter.ts` | `POST /register`, `POST /login` | authController |
| `index.ts` | Собирает все роутеры под префиксом `/api/v1` | — |

### controllers/

Принимают HTTP-запрос, валидируют вход (zod), вызывают сервис, формируют JSON-ответ. Не содержат бизнес-логики и прямых запросов к БД.

| Файл | Методы | Ответственность |
|------|--------|-----------------|
| `newsController.ts` | `list`, `getById`, `search`, `getSimilar` | Парсинг query/params, вызов NewsService, сериализация в DTO |
| `trendsController.ts` | `list`, `getById` | Пагинация, вызов TrendService |
| `chatController.ts` | `sendMessage` | Валидация body, вызов ChatService, форматирование ответа |
| `mapController.ts` | `getArticles`, `getClusters` | Валидация bbox/zoom, вызов MapService |
| `authController.ts` | `register`, `login` | Валидация body, вызов AuthService, возврат JWT в ответе |

### services/

Бизнес-логика. Работают с Prisma, Elasticsearch, Ollama. Не знают про HTTP, Request, Response.

| Файл | Методы | Ответственность |
|------|--------|-----------------|
| `newsService.ts` | `findMany`, `findById`, `search`, `findSimilar` | Фильтры, пагинация, вызов ES для поиска, pgvector для similar |
| `trendService.ts` | `findMany`, `findById` | Агрегация трендов с articles |
| `chatService.ts` | `ask` | Интеграция с Ollama/LightRAG, RAG по статьям |
| `mapService.ts` | `getArticlesInBbox`, `getClusters` | PostGIS-запросы, кластеризация по zoom |
| `authService.ts` | `register`, `login` | Создание пользователя, проверка пароля, генерация JWT |

### models/

Расширения над Prisma: raw SQL для PostGIS/pgvector, переиспользуемые запросы, типы.

| Файл | Назначение |
|------|------------|
| `prisma.ts` | Реэкспорт `PrismaClient` и типов (`Article`, `Trend` и т.д.) |
| `articleQueries.ts` | Raw SQL: поиск по эмбеддингу (pgvector), PostGIS-фильтры |
| `locationQueries.ts` | PostGIS: `ST_Within`, `ST_DWithin`, кластеризация точек |
| `types.ts` | DTO-типы для API: `ArticleListItem`, `MapArticle`, `MapCluster` |

### middleware/

Express middleware: порядок важен (auth — до защищённых роутов, errorHandler — последний).

| Файл | Назначение |
|------|------------|
| `errorHandler.ts` | Ловит все ошибки, возвращает `{ error: string }` с нужным statusCode |
| `auth.ts` | Проверка JWT в `Authorization`, запись `req.user` |
| `rateLimiter.ts` | express-rate-limit для /auth и /chat |
| `validate.ts` | Обёртка над zod: валидирует body/query, передаёт в next или 400 |

### workers/

BullMQ worker'ы. Запускаются отдельным процессом (`npm run workers`). Обрабатывают очереди из Redis.

| Файл | Очередь | Задача |
|------|---------|--------|
| `esIndexWorker.ts` | `news:index` | Индексация новых статей в Elasticsearch |
| `trendsWorker.ts` | `trends:aggregate` | Агрегация трендов по кластерам статей |
| `cleanupWorker.ts` | `cleanup:daily` | Удаление старых данных, архивирование |

### ws/

Socket.io: real-time события. Подключение к тому же HTTP-серверу, что и Express.

| Файл | Назначение |
|------|------------|
| `index.ts` | Инициализация Socket.io, подключение обработчиков |
| `handlers/newsHandler.ts` | События: подписка на bbox, рассылка новых статей в область |
| `handlers/trendsHandler.ts` | События: уведомления о новых трендах |

## Prisma

Схема БД находится в `prisma/schema.prisma`. Ключевые модели:
- **Article** — новостная статья с AI-метаданными и эмбеддингом
- **Location** — географическая точка (PostGIS)
- **Source** — источник новостей (RSS/scraper)
- **Trend** — автоматически определённый тренд
- **User** — пользователь (JWT-аутентификация)

## API Design (RESTful)

```
GET    /api/v1/news              — список новостей (фильтры, пагинация)
GET    /api/v1/news/:id          — детали статьи
GET    /api/v1/news/search       — полнотекстовый поиск (Elasticsearch)
GET    /api/v1/map/articles      — статьи с гео-координатами (PostGIS)
GET    /api/v1/map/clusters      — кластеры для карты (bbox, zoom)
GET    /api/v1/trends            — список трендов
GET    /api/v1/trends/:id        — детали тренда со статьями
POST   /api/v1/chat              — отправка вопроса AI (Ollama/LightRAG)
POST   /api/v1/auth/register     — регистрация
POST   /api/v1/auth/login        — вход (JWT)
GET    /health                   — health check
```

Source of truth по контрактам и payload: [docs/03-api-design.md](../../docs/03-api-design.md)

## С чего начать (Фаза 1)

1. Подними инфраструктуру: из корня монорепо выполни `npm run docker:up`. PostgreSQL (с PostGIS и pgvector), Redis и Elasticsearch запустятся в Docker — отдельная установка PostgreSQL не нужна.
2. Настрой `.env` с `DATABASE_URL` (по умолчанию `postgresql://newsmap:newsmap@localhost:5432/newsmap`) и запусти `npm run db:push`
3. Создай `services/newsService.ts` — метод `findMany()` с Prisma
4. Создай `controllers/newsController.ts` — вызов сервиса, `res.json()`
5. Создай `routes/newsRouter.ts` — `router.get('/', newsController.list)`
6. В `index.ts`: `app.use('/api/v1/news', newsRouter)`

## Паттерн: Router → Controller → Service → Model

```
Request → Router → Controller → Service → Model/Prisma → Response
              |           |           |
              |           |           └── Бизнес-логика, вызовы Prisma/ES/Ollama
              |           └── Валидация (zod), вызов сервиса, формирование ответа
              └── Сопоставление URL → контроллер
```

- **Router** — только маршрутизация, без логики
- **Controller** — не содержит бизнес-логики, не знает про SQL/ES
- **Service** — не знает про HTTP, Request, Response
- **Model** — Prisma + raw SQL, типы

Правило: зависимости идут только вниз (Router → Controller → Service → Model). Тестирование: сервисы можно тестировать без HTTP.

## Команды

```bash
npm run dev          # Запуск с hot-reload (tsx watch)
npm run build        # Компиляция TypeScript
npm run db:migrate   # Создать миграцию Prisma
npm run db:push      # Синхронизировать схему с БД
npm run db:studio    # GUI для просмотра данных
```

## Smoke test

```bash
# health endpoint
curl http://localhost:3001/health

# пример чтения новостей
curl "http://localhost:3001/api/v1/news?page=1&limit=5"
```

## Troubleshooting

- ошибка Prisma connection: проверь `DATABASE_URL` и доступность PostgreSQL
- `ECONNREFUSED` к Redis/Elasticsearch: подними инфраструктуру `npm run docker:up` из корня
- TypeScript ошибки при запуске: обнови зависимости (`npm install`) и проверь Node.js версии 22+
