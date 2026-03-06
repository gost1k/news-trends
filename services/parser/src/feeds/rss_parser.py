"""
Универсальный RSS-парсер. Использует feedparser для чтения RSS/Atom фидов.

Пример использования:
    articles = parse_rss_feed("https://lenta.ru/rss/news", "Lenta.ru", "ru")
"""

# TODO: Фаза 2 — реализовать
# import feedparser
# from ..scrapers.base import RawArticle
#
# def parse_rss_feed(url: str, source_name: str, language: str) -> list[RawArticle]:
#     feed = feedparser.parse(url)
#     articles = []
#     for entry in feed.entries:
#         articles.append(RawArticle(
#             title=entry.title,
#             content=entry.get("summary", ""),
#             url=entry.link,
#             published_at=entry.get("published", ""),
#             source_name=source_name,
#             language=language,
#         ))
#     return articles
