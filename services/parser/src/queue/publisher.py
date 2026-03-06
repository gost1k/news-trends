"""
Публикация сырых статей в Redis-очередь для AI-обработки.

Парсер -> Redis (LPUSH) -> AI-processor (BRPOP)

Формат сообщения — JSON:
{
    "title": "...",
    "content": "...",
    "url": "...",
    "published_at": "...",
    "source_name": "...",
    "language": "ru"
}
"""

# TODO: Фаза 2 — реализовать
# import json
# import redis
# from ..config import REDIS_HOST, REDIS_PORT, REDIS_QUEUE
#
# client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
#
# def publish_article(article: dict) -> None:
#     client.lpush(REDIS_QUEUE, json.dumps(article, ensure_ascii=False))
