# Паттерны и практики

Архитектурные паттерны, используемые в проекте, с объяснениями.

---

## 1. Controller → Service → Repository

Разделение ответственности в API-слое.

```
HTTP Request
    │
    ▼
Controller (routes/ + controllers/)
    │  - Парсит request (params, query, body)
    │  - Валидирует через zod
    │  - Вызывает service
    │  - Формирует HTTP response
    ▼
Service (services/)
    │  - Бизнес-логика
    │  - НЕ знает про HTTP (req, res)
    │  - Вызывает один или несколько repositories
    │  - Может вызывать другие services
    ▼
Repository (models/ + Prisma)
    │  - Доступ к данным (БД, ES, Redis)
    │  - Только CRUD-операции
    │  - НЕ содержит бизнес-логику
    ▼
Database
```

**Зачем:** тестируемость (мокаешь repository), переиспользуемость (service вызывается из разных контроллеров), ясность (каждый слой — одна ответственность).

---

## 2. CQRS (Command Query Responsibility Segregation)

Разделение записи и чтения.

```
WRITE (Command):
    Parser → AI Processor → PostgreSQL (source of truth)
                                ↓
                          Elasticsearch (async sync)

READ (Query):
    API → Elasticsearch (полнотекстовый поиск)
    API → PostgreSQL (CRUD, гео-запросы, pgvector)
    API → Redis (кэш)
```

**Зачем:** PostgreSQL оптимизирован для записи и ACID-транзакций, Elasticsearch — для поиска. Каждое хранилище делает то, в чём лучше.

---

## 3. Queue / Worker (Producer-Consumer)

Асинхронная обработка через очередь.

```
Producer (Parser)           Consumer (AI Processor)
    │                              │
    │  LPUSH article → Redis ← BRPOP article
    │                              │
    └── Не ждёт обработки         └── Обрабатывает по одному
```

**Зачем:**
- Decoupling: парсер и AI-процессор не знают друг о друге
- Reliability: если AI-процессор упал, статьи не теряются (в очереди)
- Scalability: можно запустить несколько AI-процессоров

В Node.js то же самое делает **BullMQ** (надстройка над Redis):
```typescript
// Добавить задачу
await queue.add('reindex', { articleId: '...' });

// Worker обрабатывает
new Worker('reindex', async (job) => {
    await elasticsearch.index(job.data);
});
```

---

## 4. Middleware Pattern (Express)

Цепочка обработчиков запроса.

```
Request → cors → helmet → auth → rateLimiter → router → controller → response
                                                    ↓ (ошибка)
                                              errorHandler → error response
```

```typescript
// Каждый middleware: (req, res, next) => void
app.use(cors());
app.use(helmet());
app.use(authMiddleware);
app.use('/api/v1/news', newsRouter);
app.use(errorHandler); // последний — ловит ошибки
```

**Зачем:** composability — добавляешь/убираешь middleware без изменения бизнес-логики.

---

## 5. Repository Pattern

Абстракция доступа к данным.

```typescript
// Интерфейс (контракт)
interface ArticleRepository {
    findById(id: string): Promise<Article | null>;
    findMany(filters: NewsFilters): Promise<PaginatedResponse<Article>>;
    create(data: CreateArticle): Promise<Article>;
}

// Реализация через Prisma
class PrismaArticleRepository implements ArticleRepository {
    constructor(private prisma: PrismaClient) {}

    async findById(id: string) {
        return this.prisma.article.findUnique({ where: { id } });
    }
}
```

**Зачем:** можно заменить Prisma на другой ORM без изменения service-слоя. Легко мокать в тестах.

---

## 6. 12-Factor App

Принципы настройки приложений (выбранные для проекта):

| Фактор | Что это | Пример |
|--------|---------|--------|
| Config | Конфигурация через env переменные | `DATABASE_URL`, `REDIS_HOST` |
| Backing services | Подключаемые ресурсы | PostgreSQL, Redis, Elasticsearch — заменяемые через env |
| Port binding | Приложение слушает порт | Express на :3001 |
| Concurrency | Масштабирование через процессы | Несколько реплик API в K8s |
| Disposability | Быстрый старт и graceful shutdown | `process.on('SIGTERM', ...)` |
| Dev/prod parity | Одинаковая среда | Docker Compose → K8s |
| Logs | Логи как поток событий | stdout → Prometheus / Grafana |

---

## 7. Graceful Shutdown

Корректное завершение работы сервера.

```typescript
process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    // 1. Перестать принимать новые запросы
    server.close();
    // 2. Дождаться завершения текущих запросов
    // 3. Закрыть подключения к БД
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
});
```

**Зачем:** в K8s при деплое старые поды получают SIGTERM. Без graceful shutdown текущие запросы обрываются.

---

## 8. Health Checks

Эндпоинты для мониторинга состояния.

```typescript
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/health/ready', async (_req, res) => {
    const dbOk = await checkDatabase();
    const redisOk = await checkRedis();
    if (dbOk && redisOk) {
        res.json({ status: 'ready', db: 'ok', redis: 'ok' });
    } else {
        res.status(503).json({ status: 'not ready', db: dbOk, redis: redisOk });
    }
});
```

- `/health` — liveness probe (приложение живо?)
- `/health/ready` — readiness probe (готово принимать запросы?)

Kubernetes использует эти эндпоинты для автоматического перезапуска и маршрутизации.

---

## 9. Error Handling

Единообразная обработка ошибок.

```typescript
// Custom ошибка с HTTP-кодом
class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

// Использование в service
throw new AppError(404, 'Article not found');

// Глобальный error handler (middleware)
app.use((err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
});
```

**Зачем:** единый формат ошибок для фронтенда, логирование в одном месте.

---

## 10. Input Validation (Zod)

Валидация данных на входе API.

```typescript
import { z } from 'zod';

const NewsFiltersSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    category: z.enum(['politics', 'economy', ...]).optional(),
    dateFrom: z.string().datetime().optional(),
});

// В controller
const filters = NewsFiltersSchema.parse(req.query);
// Если невалидно → ZodError → errorHandler → 400
```

**Зачем:** защита от невалидных данных, автоматическая типизация (TypeScript infer из zod-схемы).
