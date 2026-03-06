# NewsMap

Fullstack-проект для изучения современных веб-технологий: парсинг новостей, AI-обработка, геовизуализация на карте.

## Поток данных

```
[RSS/Web источники]
       │
       ▼
[Python Parser] ──→ Redis Queue ──→ [Python AI Processor] ──→ Ollama (GPU)
                                            │
                                    ┌───────┴───────┐
                                    ▼               ▼
                              PostgreSQL      Elasticsearch
                           (PostGIS+pgvector)  (полнотекст)
                                    │               │
                                    └───────┬───────┘
                                            ▼
                                    [Node.js Express API]
                                      │           │
                                  REST/WS      Ollama
                                      │        (AI чат)
                                      ▼
                                [React Frontend]
                              Карта · Тренды · AI-чат
```

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Leaflet, Zustand, Socket.io |
| Backend | Node.js 22, Express, TypeScript, Prisma, BullMQ, Socket.io |
| AI/Parser | Python 3.12, Ollama, LightRAG, feedparser, BeautifulSoup |
| Databases | PostgreSQL 16 (PostGIS + pgvector), Elasticsearch 8, Redis 7 |
| Infra | Docker Compose, K3s, Nginx, Prometheus, Grafana |

## Требования

- Node.js 22+ (npm workspaces)
- Python 3.12+ и `venv`
- Docker Engine + Docker Compose v2
- Доступ к Ollama API (`OLLAMA_URL`, по умолчанию `http://localhost:11434`)

## Структура

```
apps/web/           → React фронтенд
apps/api/           → Node.js API сервер
services/parser/    → Python парсер новостей
services/ai-processor/ → Python AI обработка (Ollama, LightRAG)
infrastructure/     → Docker, K8s, Nginx, мониторинг
shared/types/       → Общие TypeScript типы
docs/               → Документация и план обучения
```

## Быстрый старт

### 1. Поднять инфраструктуру

```bash
cp infrastructure/docker/.env.example infrastructure/docker/.env
npm run docker:up
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Запустить разработку

```bash
# В разных терминалах:
npm run dev:api    # Node.js API на :3001
npm run dev:web    # React на :5173
```

### 4. Python-сервисы

```bash
cd services/parser
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 5. Проверка, что всё работает

```bash
# API
curl http://localhost:3001/health

# Frontend (ожидается HTTP 200)
curl -I http://localhost:5173

# Elasticsearch (должен ответить JSON)
curl http://localhost:9200
```

## Инфраструктура (Proxmox)

```
Proxmox Host
├── vm-gateway (1GB RAM)  — Nginx: SSL, HTTP/2, роутинг по субдоменам
├── vm-dev (4GB RAM)      — код, Node.js, Python, VS Code SSH
├── vm-infra (8-16GB RAM) — Docker Compose: PG, Redis, ES, Kibana, мониторинг
├── vm-k3s (8GB RAM)      — Kubernetes (Фаза 5)
└── Отдельная машина      — Ollama (GPU, порт 11434)
```

Gateway роутит по субдоменам: `newsmap.→` vm-dev, `kibana.→` vm-infra, `grafana.→` vm-infra, и т.д.

Подробности: [infrastructure/proxmox/README.md](infrastructure/proxmox/README.md) | [Nginx Gateway](infrastructure/nginx/gateway/README.md)

## API Endpoints

```
GET    /api/v1/news              — список новостей (фильтры, пагинация)
GET    /api/v1/news/:id          — детали статьи
GET    /api/v1/news/search       — полнотекстовый поиск (Elasticsearch)
GET    /api/v1/news/:id/similar  — семантически похожие (pgvector)
GET    /api/v1/map/articles      — статьи с гео-координатами (PostGIS)
GET    /api/v1/map/clusters      — кластеры для карты
GET    /api/v1/trends            — список трендов
POST   /api/v1/chat              — AI-вопрос (Ollama/LightRAG)
POST   /api/v1/auth/register     — регистрация
POST   /api/v1/auth/login        — JWT-токен
GET    /health                   — health check
```

Source of truth по API-контрактам: [docs/03-api-design.md](docs/03-api-design.md)

## База данных

Основные таблицы: `articles`, `locations` (PostGIS), `sources`, `tags`, `trends`, `users`.

- **PostGIS** — гео-запросы: "статьи в радиусе 50 км от точки"
- **pgvector** — семантический поиск по эмбеддингам
- **Elasticsearch** — полнотекстовый поиск, агрегации для трендов

Подробности: [docs/04-database-schema.md](docs/04-database-schema.md)

## Переменные окружения

```bash
cp infrastructure/docker/.env.example infrastructure/docker/.env
```

| Переменная | По умолчанию | Описание |
|-----------|-------------|----------|
| `DATABASE_URL` | `postgresql://newsmap:newsmap@localhost:5432/newsmap` | PostgreSQL |
| `REDIS_HOST` | `localhost` | Redis |
| `ELASTICSEARCH_URL` | `http://localhost:9200` | Elasticsearch |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama (отдельная машина) |
| `JWT_SECRET` | — | Секрет для JWT-токенов |
| `PORT` | `3001` | Порт Node.js API |

## Паттерны

- **Controller → Service → Repository** — разделение ответственности в API
- **Queue/Worker** — асинхронная обработка через Redis (парсер → AI)
- **CQRS** — запись в PostgreSQL, чтение из Elasticsearch
- **Middleware** — auth, validation, error handling, rate limiting
- **12-Factor App** — конфигурация через env, логи в stdout

Подробности: [docs/06-patterns.md](docs/06-patterns.md)

## Troubleshooting

- `npm run dev:api` падает из-за БД: проверь `DATABASE_URL` и что `npm run docker:up` уже выполнен
- не поднимается `apps/web`: проверь занятость порта `5173` и зависимости (`npm install`)
- ошибки Python-сервисов: активируй `.venv` и обнови зависимости `pip install -r requirements.txt`
- пустые ответы AI: проверь доступность `OLLAMA_URL` и наличие моделей в Ollama (`/api/tags`)

## Документация

| Файл | Содержание |
|------|-----------|
| [docs/01-architecture.md](docs/01-architecture.md) | Архитектура, компоненты, хранилища |
| [docs/02-learning-path.md](docs/02-learning-path.md) | План обучения по фазам с чеклистами |
| [docs/03-api-design.md](docs/03-api-design.md) | REST API контракты |
| [docs/04-database-schema.md](docs/04-database-schema.md) | ER-диаграмма, SQL-примеры |
| [docs/05-infrastructure.md](docs/05-infrastructure.md) | Docker, K3s, мониторинг |
| [docs/06-patterns.md](docs/06-patterns.md) | Архитектурные паттерны |

## Статус реализации

| Компонент | Статус |
|----------|--------|
| `apps/web` (React UI) | in-progress |
| `apps/api` (REST + WS) | in-progress |
| `services/parser` | in-progress |
| `services/ai-processor` | planned/in-progress (по фазе) |
| K3s и production deployment | planned (Фаза 5) |

## Фазы обучения

Подробный план: [docs/02-learning-path.md](docs/02-learning-path.md)

1. **Фундамент** (2-3 нед.) — React, TypeScript, Express, Docker
2. **Данные** (2-3 нед.) — PostgreSQL, PostGIS, Redis, Python парсер
3. **AI + Поиск** (2-3 нед.) — Ollama, pgvector, Elasticsearch, LightRAG
4. **Продвинутый фронтенд** (1-2 нед.) — Карта, WebSocket, графики
5. **Инфраструктура** (2-3 нед.) — K3s, Nginx, мониторинг, CI/CD
