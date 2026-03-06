# apps/api — Node.js Backend

REST API сервер на Express + TypeScript с Prisma ORM.

## Структура src/

| Папка | Назначение |
|-------|-----------|
| `routes/` | Определение REST-эндпоинтов: `newsRouter`, `trendsRouter`, `chatRouter`, `mapRouter`, `authRouter` |
| `controllers/` | Обработка HTTP-запросов, вызов сервисов, формирование ответов. Один файл = один ресурс |
| `services/` | Бизнес-логика: `NewsService`, `TrendService`, `ChatService`. Не знают про HTTP |
| `models/` | Prisma-хелперы и типы, дополнительные запросы (raw SQL для PostGIS/pgvector) |
| `middleware/` | Express middleware: auth (JWT), errorHandler, rateLimiter, validation (zod) |
| `workers/` | BullMQ worker'ы: переиндексация ES, агрегация трендов, очистка старых данных |
| `ws/` | Socket.io обработчики: real-time новости на карте, уведомления о трендах |
| `config/` | Конфигурация: env переменные, подключения к БД, Redis, Elasticsearch |

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

## С чего начать (Фаза 1)

1. Настрой `.env` с `DATABASE_URL` и запусти `npm run db:push`
2. Создай `routes/newsRouter.ts` с простым GET-эндпоинтом
3. Создай `controllers/newsController.ts` — обработка запроса
4. Создай `services/newsService.ts` — запрос к Prisma
5. Подключи роутер в `index.ts`

## Паттерн: Controller → Service → Repository

```
Request → Router → Controller → Service → Prisma/DB → Response
                        ↓
                   Validation (zod)
```

Controller не содержит бизнес-логики. Service не знает про HTTP.
Это разделение упрощает тестирование и поддержку.

## Команды

```bash
npm run dev          # Запуск с hot-reload (tsx watch)
npm run build        # Компиляция TypeScript
npm run db:migrate   # Создать миграцию Prisma
npm run db:push      # Синхронизировать схему с БД
npm run db:studio    # GUI для просмотра данных
```
