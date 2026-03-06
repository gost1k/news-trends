# Схема базы данных

## ER-диаграмма

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   sources   │────<│    articles       │>────│    tags      │
└─────────────┘     │                  │     └─────────────┘
                    │  id              │           ↕
                    │  title           │     article_tags
                    │  content         │
                    │  summary         │
                    │  source_url      │     ┌─────────────┐
                    │  embedding ←(vec)│     │  locations   │
                    │  ai_metadata(json)│>────│             │
                    │  published_at    │     │  id          │
                    │  parsed_at       │     │  name        │
                    └──────────────────┘     │  type        │
                           ↕                │  lat/lng     │
                    trend_articles          │  coords(geo) │
                           ↕                └─────────────┘
                    ┌─────────────┐              ↕
                    │   trends    │        article_locations
                    └─────────────┘

                    ┌─────────────┐
                    │    users    │  (отдельная, для JWT auth)
                    └─────────────┘
```

## Таблицы

### articles
Основная таблица — новостные статьи.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Уникальный ID |
| title | TEXT | Заголовок статьи |
| content | TEXT | Полный текст |
| summary | TEXT NULL | AI-суммаризация (2-3 предложения) |
| source_url | TEXT UNIQUE | Оригинальный URL (дедупликация) |
| source_id | UUID FK | Ссылка на источник |
| embedding | VECTOR(768) | Эмбеддинг для семантического поиска (pgvector) |
| ai_metadata | JSONB NULL | NER, sentiment, category (структурированный JSON) |
| published_at | TIMESTAMP | Дата публикации |
| parsed_at | TIMESTAMP | Когда спарсили |

**Индексы:**
- `idx_articles_published_at` — сортировка по дате
- `idx_articles_source_id` — фильтр по источнику
- `idx_articles_embedding` — HNSW индекс для pgvector

### locations
Географические точки (PostGIS).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| name | TEXT | "Москва", "Лондон" |
| type | TEXT | country / region / city / district |
| country_code | TEXT | "RU", "GB" |
| lat | FLOAT | Широта |
| lng | FLOAT | Долгота |
| coords | GEOMETRY(POINT) | PostGIS точка (для ST_DWithin запросов) |

**Индексы:**
- `idx_locations_coords` — GIST индекс для гео-запросов
- UNIQUE(name, type, country_code) — дедупликация

### sources
Источники новостей.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| name | TEXT UNIQUE | "РИА Новости", "BBC" |
| url | TEXT | URL фида или сайта |
| language | TEXT | "ru" / "en" |
| parser_type | TEXT | "rss" / "scraper" |
| is_active | BOOLEAN | Активен ли |

### tags, article_tags
Теги (N:M через промежуточную таблицу).

### trends, trend_articles
Автоматически определённые тренды (группы связанных статей).

### users
JWT-аутентификация.

## Полезные SQL-запросы

```sql
-- Статьи в радиусе 50 км от точки (PostGIS)
SELECT a.title, l.name, ST_Distance(
    l.coords::geography,
    ST_MakePoint(37.6173, 55.7558)::geography
) as distance_m
FROM articles a
JOIN article_locations al ON a.id = al.article_id
JOIN locations l ON al.location_id = l.id
WHERE ST_DWithin(
    l.coords::geography,
    ST_MakePoint(37.6173, 55.7558)::geography,
    50000
)
ORDER BY a.published_at DESC;

-- Семантически похожие статьи (pgvector)
SELECT id, title, embedding <=> '[0.1, 0.2, ...]'::vector AS distance
FROM articles
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;

-- Топ категорий за последнюю неделю
SELECT ai_metadata->>'category' AS category, COUNT(*)
FROM articles
WHERE published_at > NOW() - INTERVAL '7 days'
GROUP BY ai_metadata->>'category'
ORDER BY count DESC;
```
