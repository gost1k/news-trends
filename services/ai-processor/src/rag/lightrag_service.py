"""
LightRAG — Retrieval Augmented Generation.

RAG позволяет отвечать на вопросы пользователя, используя контекст
из базы новостей. Вместо того чтобы LLM отвечала "из головы",
мы сначала находим релевантные статьи (retrieval), затем передаём
их как контекст в промпт (augmented generation).

Поток:
  1. Пользователь задаёт вопрос: "Что происходит в Москве?"
  2. Поиск релевантных статей (pgvector семантический + ES полнотекстовый)
  3. Формирование промпта: вопрос + найденные статьи как контекст
  4. Отправка в Ollama → получение ответа
  5. Возврат ответа пользователю

LightRAG: https://github.com/HKUDS/LightRAG
"""

# TODO: Фаза 3 — реализовать
# from lightrag import LightRAG
#
# class NewsRAGService:
#     def __init__(self, ollama_url: str, db_url: str):
#         pass
#
#     def query(self, question: str) -> str:
#         """Ответить на вопрос, используя базу новостей как контекст."""
#         # 1. Найти релевантные статьи
#         # 2. Сформировать промпт с контекстом
#         # 3. Отправить в Ollama
#         # 4. Вернуть ответ
#         pass
#
#     def index_article(self, article: dict) -> None:
#         """Добавить статью в RAG-индекс."""
#         pass
