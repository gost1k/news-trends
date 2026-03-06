"""
Точка входа AI-процессора.
Слушает Redis-очередь, обрабатывает статьи через Ollama,
сохраняет результат в PostgreSQL и Elasticsearch.

Пайплайн обработки одной статьи:
  1. BRPOP из Redis-очереди (блокирующее чтение)
  2. NER: извлечение сущностей (кто, где, что) через Ollama
  3. Суммаризация: краткое содержание через Ollama
  4. Классификация: категория/тема через Ollama
  5. Embedding: векторное представление для pgvector
  6. Сохранение в PostgreSQL (статья + локации + теги)
  7. Индексация в Elasticsearch (полнотекстовый поиск)
"""

from dotenv import load_dotenv

load_dotenv()


def main():
    # TODO: Фаза 3
    # 1. Подключиться к Redis (BRPOP из очереди newsmap:raw_articles)
    # 2. Для каждой статьи запустить пайплайн:
    #    result = pipeline.process(raw_article)
    # 3. Сохранить в PostgreSQL и Elasticsearch
    print("AI Processor started. Waiting for articles in Redis queue...")


if __name__ == "__main__":
    main()
