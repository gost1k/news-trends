# API Design — REST API контракты

Базовый URL: `/api/v1`

## Аутентификация

```
POST /api/v1/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Response: { "token": "jwt...", "user": { "id", "email", "name" } }

POST /api/v1/auth/login
Body: { "email": "...", "password": "..." }
Response: { "token": "jwt...", "user": { "id", "email", "name" } }
```

Защищённые эндпоинты требуют заголовок: `Authorization: Bearer <token>`

## Новости

```
GET /api/v1/news
Query: ?page=1&pageSize=20&category=politics&sentiment=negative
       &language=ru&dateFrom=2024-01-01&dateTo=2024-12-31
       &sourceId=uuid&locationId=uuid
Response: {
    "data": [ArticleListItem],
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
}

GET /api/v1/news/:id
Response: Article (полная, с контентом)

GET /api/v1/news/search
Query: ?q=протесты&page=1&pageSize=20
Response: PaginatedResponse<ArticleListItem> (через Elasticsearch)

GET /api/v1/news/:id/similar
Query: ?limit=5
Response: ArticleListItem[] (через pgvector, семантическая близость)
```

## Карта

```
GET /api/v1/map/articles
Query: ?north=56.0&south=55.5&east=38.0&west=37.0
       &dateFrom=2024-01-01&category=politics
Response: MapArticle[]

GET /api/v1/map/clusters
Query: ?north=56.0&south=55.5&east=38.0&west=37.0&zoom=10
Response: MapCluster[]
```

## Тренды

```
GET /api/v1/trends
Query: ?page=1&pageSize=10&dateFrom=2024-01-01
Response: PaginatedResponse<TrendListItem>

GET /api/v1/trends/:id
Response: Trend (с articles)
```

## AI Чат

```
POST /api/v1/chat
Body: {
    "message": "Что происходит в Москве?",
    "context": {
        "region": "Москва",
        "dateFrom": "2024-01-01",
        "dateTo": "2024-12-31"
    }
}
Response: {
    "message": "В Москве за указанный период...",
    "sources": [
        { "articleId": "uuid", "title": "...", "relevance": 0.95 }
    ]
}
```

## Общие принципы

- **Пагинация**: `page` и `pageSize` (по умолчанию 20, макс. 100)
- **Сортировка**: `sort=publishedAt&order=desc`
- **Ошибки**: `{ "error": "Not found", "details": {} }` с HTTP-кодом
- **Даты**: ISO 8601 формат (`2024-01-15T12:00:00Z`)
- **ID**: UUID v4
- **Версионирование**: /api/v1/ (мажорная версия в URL)
