# services/ai-processor — AI Processing Service

Сервис обработки новостей через Ollama (LLM) с сохранением в PostgreSQL и Elasticsearch.

## Требования

- Python 3.12+
- доступный Ollama API (`/api/tags`, `/api/generate`, `/api/embeddings`)
- PostgreSQL, Elasticsearch и Redis

## Структура src/

| Папка | Назначение |
|-------|-----------|
| `ollama_client/` | HTTP-клиент к Ollama REST API (/api/generate, /api/embeddings) |
| `ner/` | Named Entity Recognition — извлечение сущностей (кто, где, что, когда) |
| `summarizer/` | Суммаризация — краткое содержание статьи (2-3 предложения) |
| `embeddings/` | Генерация векторных эмбеддингов для pgvector (семантический поиск) |
| `classifier/` | Классификация по категориям (politics, economy...) и sentiment |
| `rag/` | LightRAG — ответы на вопросы с использованием базы новостей как контекста |
| `storage/` | Запись в PostgreSQL (PostGIS + pgvector) и Elasticsearch |

## Пайплайн обработки статьи

```
Redis Queue (BRPOP)
    │
    ├── 1. NER (ner/extractor.py)
    │       → persons, locations, organizations, events
    │
    ├── 2. Summarization (summarizer/summarizer.py)
    │       → 2-3 предложения
    │
    ├── 3. Classification (classifier/classifier.py)
    │       → category + sentiment
    │
    ├── 4. Embedding (embeddings/generator.py)
    │       → vector[768] для pgvector
    │
    ├── 5. Save to PostgreSQL (storage/postgres.py)
    │       → articles + locations (PostGIS) + tags + embedding
    │
    └── 6. Index in Elasticsearch (storage/elastic.py)
            → полнотекстовый индекс
```

## Ollama API

Ollama работает на отдельной машине с GPU. REST API:

```bash
# Генерация текста
curl http://ollama-host:11434/api/generate \
  -d '{"model": "llama3", "prompt": "...", "stream": false}'

# Эмбеддинги
curl http://ollama-host:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "..."}'
```

## С чего начать (Фаза 3)

1. Убедись, что Ollama запущен и доступен (`curl http://ollama-host:11434/api/tags`)
2. Реализуй `ollama_client/client.py` — простой HTTP-клиент
3. Начни с `summarizer/` — самый простой prompt
4. Добавь `ner/` — structured output (JSON)
5. Подключи `storage/postgres.py` и `storage/elastic.py`
6. В последнюю очередь `rag/lightrag_service.py`

## Запуск

```bash
cd services/ai-processor
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m src.main
```

## Smoke test

```bash
# Проверка Ollama
curl http://ollama-host:11434/api/tags

# Запуск процессора
python -m src.main
```

Ожидаемое поведение: процессор читает сообщения из Redis, пишет результаты в PostgreSQL и индексирует в Elasticsearch.

## Troubleshooting

- таймауты к Ollama: проверь `OLLAMA_URL`, сеть и что нужные модели скачаны
- документы не индексируются в Elasticsearch: проверь `ELASTICSEARCH_URL` и права доступа
- данные не попадают в PostgreSQL: проверь схему/миграции и параметры подключения
