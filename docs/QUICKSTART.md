# Пошаговый старт — что делать и в каком порядке

Цель: поднять API и получить ответ от `GET /health` и `GET /api/v1/news`.  
Ты выполняешь шаги сам, здесь только инструкции.

---

## Шаг 0. Что должно быть установлено

| Что | Зачем |
|-----|-------|
| **Node.js 22+** | Запуск API (`npm run dev`) |
| **Docker + Docker Compose** | PostgreSQL, Redis, Elasticsearch в контейнерах |
| **npm** | Обычно идёт с Node.js |

Проверка:
```bash
node -v    # v22.x.x
docker -v  # Docker version ...
docker compose version
```

---

## Шаг 1. Перейти в корень проекта

Корень монорепо — там лежит `package.json` с workspaces и скриптом `docker:up`.

```bash
cd /home/taran/projects/test/news-trends
```

Дальше все команды — либо из корня, либо из `apps/api` (будет указано).

---

## Шаг 2. Переменные окружения

API читает настройки из `.env`. Файл нужно создать.

**Что сделать:**
1. Скопировать пример: `cp infrastructure/docker/.env.example infrastructure/docker/.env`
2. Для API создать `.env` в `apps/api/` — либо скопировать туда же, либо создать симлинк. Минимум для старта:
   ```
   DATABASE_URL=postgresql://newsmap:newsmap@localhost:5432/newsmap
   ```
3. В `apps/api/src/config/env.ts` уже есть fallback на этот URL, поэтому если `.env` в `apps/api` пустой или отсутствует — будет использоваться дефолт. Для Фазы 1 можно обойтись без `.env` в `apps/api`, если не меняешь порт и не трогаешь секреты.

**Где лежит `.env.example`:** `infrastructure/docker/.env.example` — там пароли для Docker-контейнеров. `dotenv` в API ищет `.env` в текущей рабочей директории (при `npm run dev` это `apps/api`), поэтому `.env` для API логично положить в `apps/api/.env`.

**Итого:** создай `apps/api/.env` с одной строкой `DATABASE_URL=postgresql://newsmap:newsmap@localhost:5432/newsmap`. Для Фазы 1 можно обойтись без `.env` — в `config/env.ts` уже есть этот URL по умолчанию, но явный `.env` полезен для понимания.

---

## Шаг 3. Поднять Docker (PostgreSQL, Redis, Elasticsearch)

**Что происходит:** `npm run docker:up` запускает контейнеры из `infrastructure/docker/docker-compose.dev.yml`. PostgreSQL слушает на `localhost:5432`, Redis на `6379`, Elasticsearch на `9200`.

**Команда (из корня):**
```bash
npm run docker:up
```

**Проверка:**
```bash
docker ps
```
Должны быть контейнеры `newsmap-postgres`, `newsmap-redis`, `newsmap-elasticsearch` и др. в статусе `Up`.

**Если порт 5432 занят** — останови свой локальный PostgreSQL или поменяй порт в `docker-compose.dev.yml`.

---

## Шаг 4. Установить зависимости Node

**Что происходит:** `npm install` в корне ставит зависимости для всех workspaces (в т.ч. `apps/api`).

**Команда (из корня):**
```bash
npm install
```

---

## Шаг 5. Синхронизировать схему БД с Prisma

**Что происходит:** `prisma db push` читает `apps/api/prisma/schema.prisma`, создаёт таблицы в PostgreSQL (если их нет) и подключает расширения PostGIS и pgvector (они уже в `init-db.sql` при первом запуске контейнера).

**Команда:**
```bash
cd apps/api
npm run db:push
```

**Проверка:** в выводе должно быть что-то вроде "Database is now in sync with the schema". Ошибка подключения — значит Docker не поднят или `DATABASE_URL` неверный.

---

## Шаг 6. Запустить API

**Команда (из `apps/api`):**
```bash
npm run dev
```

**Проверка:**
```bash
curl http://localhost:3001/health
```
Ожидаемый ответ: `{"status":"ok","timestamp":"..."}`.

---

## Шаг 7. Добавить эндпоинт новостей (по желанию)

Сейчас `GET /api/v1/news` не реализован. Чтобы он заработал, нужно создать цепочку снизу вверх:

1. **Service** (`src/services/newsService.ts`) — метод `findMany()`, который вызывает Prisma и возвращает статьи.
2. **Controller** (`src/controllers/newsController.ts`) — функция `list`, которая вызывает сервис и отдаёт `res.json(...)`.
3. **Router** (`src/routes/newsRouter.ts`) — `router.get('/', newsController.list)`.
4. **Подключение в `index.ts`** — `app.use('/api/v1/news', newsRouter)`.

Подробнее: `apps/api/README.md`, раздел «С чего начать (Фаза 1)».

---

## Краткий чеклист

- [ ] Node 22+, Docker установлены
- [ ] `npm install` (из корня)
- [ ] `cp infrastructure/docker/.env.example infrastructure/docker/.env`
- [ ] `apps/api/.env` с `DATABASE_URL=postgresql://newsmap:newsmap@localhost:5432/newsmap`
- [ ] `npm run docker:up` (из корня)
- [ ] `docker ps` — контейнеры запущены
- [ ] `cd apps/api && npm run db:push`
- [ ] `npm run dev` (из `apps/api`)
- [ ] `curl http://localhost:3001/health` — ответ `{"status":"ok",...}`

---

## Если что-то пошло не так

| Ошибка | Что проверить |
|--------|---------------|
| `ECONNREFUSED` к PostgreSQL | Docker запущен? `docker ps` показывает postgres? |
| `DATABASE_URL` не найден | Есть ли `apps/api/.env`? Или `config/env.ts` использует дефолт |
| Порт 3001 занят | Другой процесс слушает порт, либо задай `PORT=3002` в `.env` |
| Prisma "schema not found" | Команды выполняешь из `apps/api`? |
