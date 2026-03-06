"""
Конфигурация парсера: источники новостей, Redis, интервалы.
"""

import os

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_QUEUE = os.getenv("REDIS_QUEUE", "newsmap:raw_articles")

PARSE_INTERVAL_MINUTES = int(os.getenv("PARSE_INTERVAL", "15"))

SOURCES = [
    # Русскоязычные RSS
    {
        "name": "РИА Новости",
        "url": "https://ria.ru/export/rss2/archive/index.xml",
        "type": "rss",
        "language": "ru",
    },
    {
        "name": "ТАСС",
        "url": "https://tass.ru/rss/v2.xml",
        "type": "rss",
        "language": "ru",
    },
    {
        "name": "Lenta.ru",
        "url": "https://lenta.ru/rss/news",
        "type": "rss",
        "language": "ru",
    },
    # Англоязычные RSS
    {
        "name": "BBC World",
        "url": "https://feeds.bbci.co.uk/news/world/rss.xml",
        "type": "rss",
        "language": "en",
    },
    {
        "name": "Reuters World",
        "url": "https://www.reutersagency.com/feed/",
        "type": "rss",
        "language": "en",
    },
]
