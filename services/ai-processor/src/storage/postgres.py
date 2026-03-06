"""
Запись обработанных статей в PostgreSQL.

Сохраняет:
  - Статью (articles) с AI-метаданными (NER, sentiment, category)
  - Локации (locations) с координатами (PostGIS)
  - Связи article_locations, article_tags
  - Эмбеддинг (pgvector) для семантического поиска

PostGIS запросы (примеры для изучения):
  -- Найти статьи в радиусе 50 км от точки
  SELECT * FROM articles a
  JOIN article_locations al ON a.id = al.article_id
  JOIN locations l ON al.location_id = l.id
  WHERE ST_DWithin(
    l.coords::geography,
    ST_MakePoint(37.6173, 55.7558)::geography,
    50000
  );
"""

# TODO: Фаза 3 — реализовать
# import psycopg2
# from ..config import DATABASE_URL
