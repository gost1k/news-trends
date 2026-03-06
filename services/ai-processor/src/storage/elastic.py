"""
Индексация статей в Elasticsearch для полнотекстового поиска.

ES-индекс "newsmap-articles" маппинг:
{
    "title":        { "type": "text", "analyzer": "russian" },
    "content":      { "type": "text", "analyzer": "russian" },
    "summary":      { "type": "text" },
    "source_name":  { "type": "keyword" },
    "category":     { "type": "keyword" },
    "sentiment":    { "type": "keyword" },
    "published_at": { "type": "date" },
    "location":     { "type": "geo_point" }
}

Elasticsearch vs pgvector:
  - ES: полнотекстовый поиск ("найти статьи со словом «протест»")
  - pgvector: семантический поиск ("найти статьи про социальные волнения")
  Оба дополняют друг друга.
"""

# TODO: Фаза 3 — реализовать
# from elasticsearch import Elasticsearch
# from ..config import ELASTICSEARCH_URL, ES_INDEX
#
# es = Elasticsearch(ELASTICSEARCH_URL)
#
# def index_article(article_id: str, data: dict) -> None:
#     es.index(index=ES_INDEX, id=article_id, document=data)
#
# def create_index() -> None:
#     """Создать индекс с маппингом (запускается один раз)."""
#     ...
