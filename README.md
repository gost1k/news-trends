# NewsMap

Fullstack-проект для изучения современных веб-технологий: парсинг новостей, AI-обработка, геовизуализация на карте.

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Leaflet, Zustand, Socket.io |
| Backend | Node.js 22, Express, TypeScript, Prisma, BullMQ, Socket.io |
| AI/Parser | Python 3.12, Ollama, LightRAG, feedparser, BeautifulSoup |
| Databases | PostgreSQL 16 (PostGIS + pgvector), Elasticsearch 8, Redis 7 |
| Infra | Docker Compose, K3s, Nginx, Prometheus, Grafana |

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

## Фазы обучения

Подробный план в [docs/02-learning-path.md](docs/02-learning-path.md).

1. **Фундамент** — React, TypeScript, Express, Docker
2. **Данные** — PostgreSQL, PostGIS, Redis, Python парсер
3. **AI + Поиск** — Ollama, pgvector, Elasticsearch, LightRAG
4. **Продвинутый фронтенд** — Карта, WebSocket, графики
5. **Инфраструктура** — K3s, Nginx, мониторинг, CI/CD
