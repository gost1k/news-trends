# План обучения NewsMap

Порядок изучения технологий через проект. Каждая фаза даёт рабочий результат.

---

## Фаза 1 — Фундамент (2-3 недели)

**Цель:** рабочий API + React-страница, отображающая данные из БД.

### TypeScript (3-4 дня)
- [ ] Базовые типы: string, number, boolean, array, object
- [ ] Интерфейсы и типы (interface vs type)
- [ ] Generics: `Array<T>`, `Promise<T>`, свои generic-функции
- [ ] Union types, discriminated unions, type guards
- [ ] Utility types: `Pick`, `Omit`, `Partial`, `Required`
- **Практика:** типизировать `shared/types/` (уже создано, изучи и модифицируй)

### React (5-7 дней)
- [ ] JSX — HTML в JavaScript
- [ ] Компоненты: функциональные компоненты, пропсы
- [ ] useState — локальное состояние
- [ ] useEffect — побочные эффекты (загрузка данных)
- [ ] Условный рендеринг и списки (map)
- [ ] React Router — навигация между страницами
- [ ] Формы: controlled components
- **Практика:** создать Layout, страницу списка новостей → `apps/web/`

### Node.js + Express (5-7 дней)
- [ ] Express: создание сервера, middleware-паттерн
- [ ] REST API: GET, POST, PUT, DELETE
- [ ] Маршрутизация: Router, параметры, query strings
- [ ] Middleware: cors, helmet, errorHandler
- [ ] Валидация входных данных (zod)
- [ ] Структура: Controller → Service → Repository
- **Практика:** реализовать /api/v1/news CRUD → `apps/api/`

### Docker (2-3 дня)
- [ ] Что такое контейнер и образ
- [ ] docker-compose up/down — запуск сервисов
- [ ] docker ps, docker logs — отладка
- [ ] Volumes — сохранение данных
- **Практика:** запустить PostgreSQL + Redis через docker-compose

**Результат Фазы 1:** React-страница показывает список новостей из PostgreSQL через API.

---

## Фаза 2 — Данные (2-3 недели)

**Цель:** парсер собирает реальные новости, данные хранятся в БД с гео-координатами.

### PostgreSQL + Prisma (5-7 дней)
- [ ] SQL основы: SELECT, INSERT, UPDATE, DELETE, JOIN
- [ ] Prisma: schema, generate, migrate, studio
- [ ] Связи: 1:N, N:M (through table)
- [ ] Индексы — ускорение запросов
- [ ] Транзакции — атомарные операции
- **Практика:** подключить Prisma к API, реализовать CRUD через сервисы

### PostGIS (3-4 дня)
- [ ] Типы: POINT, POLYGON, geography
- [ ] Функции: ST_DWithin, ST_Distance, ST_MakePoint
- [ ] Запрос: "все статьи в радиусе 50 км от точки"
- [ ] Spatial index (GIST) — быстрые гео-запросы
- **Практика:** добавить эндпоинт /api/v1/map/articles с bbox-фильтром

### Redis (2-3 дня)
- [ ] Структуры данных: string, list, hash, set, sorted set
- [ ] Кэширование: GET/SET с TTL
- [ ] Pub/Sub для real-time уведомлений
- [ ] Использование как очередь сообщений (LPUSH/BRPOP)
- **Практика:** кэшировать ответы API, настроить очередь для парсера

### Python парсер (4-5 дней)
- [ ] Python основы: переменные, функции, классы, модули
- [ ] requests + BeautifulSoup: HTTP-запросы, парсинг HTML
- [ ] feedparser: чтение RSS-фидов
- [ ] redis-py: публикация в очередь
- [ ] Dataclass и Pydantic: валидация данных
- **Практика:** раскомментировать код в `services/parser/`, парсить RSS

**Результат Фазы 2:** парсер собирает реальные новости, API показывает их с гео-данными.

---

## Фаза 3 — AI + Поиск (2-3 недели)

**Цель:** новости обогащаются AI, работает семантический и полнотекстовый поиск.

### Ollama API (3-4 дня)
- [ ] Установка и запуск Ollama, скачивание моделей
- [ ] REST API: /api/generate, /api/embeddings, /api/chat
- [ ] Prompt engineering: structured output (JSON)
- [ ] Streaming responses
- **Практика:** реализовать `ollama_client/client.py`

### NER + Суммаризация (3-4 дня)
- [ ] NER через LLM: промпт для извлечения сущностей
- [ ] Суммаризация: промпт для краткого содержания
- [ ] Классификация: промпт для категории + sentiment
- **Практика:** `ner/extractor.py`, `summarizer/`, `classifier/`

### pgvector (2-3 дня)
- [ ] Что такое эмбеддинги и векторное пространство
- [ ] Создание vector-колонки в PostgreSQL
- [ ] Операторы: `<->` (L2), `<=>` (cosine), `<#>` (inner product)
- [ ] Индекс: IVFFlat или HNSW
- **Практика:** генерация эмбеддингов через Ollama, сохранение в pgvector

### Elasticsearch (3-4 дня)
- [ ] Индексы, маппинги, анализаторы (русский + английский)
- [ ] Полнотекстовый поиск: match, multi_match, bool query
- [ ] Агрегации: terms, date_histogram (для трендов)
- [ ] Kibana: визуализация, Dev Tools
- **Практика:** индексация статей, поисковый эндпоинт, дашборд в Kibana

### LightRAG (2-3 дня)
- [ ] Что такое RAG (Retrieval Augmented Generation)
- [ ] Retrieval: поиск релевантных документов (pgvector + ES)
- [ ] Augmentation: формирование промпта с контекстом
- [ ] Generation: ответ LLM на основе контекста
- **Практика:** `rag/lightrag_service.py`, эндпоинт /api/v1/chat

**Результат Фазы 3:** AI обогащает статьи, работают поиск и AI-чат.

---

## Фаза 4 — Продвинутый фронтенд (1-2 недели)

**Цель:** полноценный UI с картой, трендами и real-time обновлениями.

### Яндекс Карты JS API 3.0 (3-4 дня)
- [ ] Подключение API через `<script>` + `ymaps3.ready`, reactify-обёртка (`@yandex/ymaps3-reactify`)
- [ ] Компоненты: YMap, YMapDefaultSchemeLayer, YMapMarker, YMapFeature (полигоны)
- [ ] Кластеризация маркеров (`@yandex/ymaps3-clusterer`, стратегия `clusterByGrid`)
- [ ] Многослойность: YMapFeatureDataSource + YMapLayer (страны / города / точки)
- [ ] Событие: клик → показать детали статьи
- [ ] Фильтрация по bbox (видимая область карты)
- **Практика:** `components/Map/`

### Socket.io (2-3 дня)
- [ ] Сервер: Socket.io в Express (`apps/api/src/ws/`)
- [ ] Клиент: socket.io-client в React
- [ ] События: новая статья → маркер на карте
- [ ] Rooms: подписка на регион
- **Практика:** real-time обновления карты

### Zustand + Recharts (2-3 дня)
- [ ] Zustand: создание stores, подписка на изменения
- [ ] Recharts: LineChart, BarChart, PieChart
- [ ] Визуализация трендов: timeline, категории, sentiment
- **Практика:** `store/`, `components/Trends/`

**Результат Фазы 4:** красивый UI с интерактивной картой и live-обновлениями.

---

## Фаза 5 — Инфраструктура и DevOps (2-3 недели)

**Цель:** production-ready деплой, мониторинг, CI/CD.

### Nginx (2-3 дня)
- [ ] Reverse proxy: маршрутизация /api, /ws, /
- [ ] SSL/TLS с Let's Encrypt (certbot)
- [ ] Gzip, кэширование статики
- [ ] Rate limiting
- **Практика:** `infrastructure/nginx/nginx.conf`

### Kubernetes / K3s (5-7 дней)
- [ ] Концепции: Pod, Deployment, Service, Ingress, ConfigMap, Secret
- [ ] kubectl: apply, get, describe, logs, exec
- [ ] K3s установка на VM
- [ ] Перенос docker-compose → K8s манифесты
- [ ] PersistentVolume для БД
- [ ] Ingress controller (Traefik в K3s)
- **Практика:** `infrastructure/k8s/`

### Мониторинг (3-4 дня)
- [ ] Prometheus: метрики, scraping, PromQL
- [ ] Grafana: дашборды, алерты
- [ ] Exporters: postgres, redis, node
- [ ] Health checks в приложении (/health)
- **Практика:** `infrastructure/monitoring/`

### CI/CD (2-3 дня)
- [ ] GitHub Actions: lint, test, build, deploy
- [ ] Docker build + push в registry
- [ ] Автодеплой в K3s
- **Практика:** `.github/workflows/ci.yml`

**Результат Фазы 5:** проект задеплоен в K3s с мониторингом и CI/CD.

---

## Ресурсы для изучения

### React
- [react.dev](https://react.dev/) — официальные туториалы
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Node.js
- [Express Guide](https://expressjs.com/en/guide/)
- [Prisma Docs](https://www.prisma.io/docs/)

### Python
- [Python Tutorial](https://docs.python.org/3/tutorial/)
- [Real Python](https://realpython.com/)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [PostGIS Introduction](https://postgis.net/workshops/postgis-intro/)
- [pgvector README](https://github.com/pgvector/pgvector)

### Docker / Kubernetes
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [K3s Docs](https://docs.k3s.io/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

### AI / LLM
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [LightRAG](https://github.com/HKUDS/LightRAG)
