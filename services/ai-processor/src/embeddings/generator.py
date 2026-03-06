"""
Генерация векторных эмбеддингов для pgvector.

Использует Ollama endpoint /api/embeddings с моделью nomic-embed-text.
Вектор размерности 768 (nomic) или 1536 (другие модели) сохраняется
в PostgreSQL через расширение pgvector для семантического поиска.

Семантический поиск: "найти похожие статьи" по смыслу, а не по словам.
В отличие от Elasticsearch (полнотекстовый поиск), pgvector ищет по
близости векторов в многомерном пространстве.
"""

# TODO: Фаза 3 — реализовать
# from ..ollama_client.client import OllamaClient
#
# def generate_embedding(text: str, client: OllamaClient) -> list[float]:
#     truncated = text[:8000]  # ограничение контекста модели
#     return client.embed(truncated)
