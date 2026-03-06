"""
Планировщик задач парсинга (APScheduler).

Запускает парсинг каждые N минут для каждого источника.
Каждый job: source -> scraper/rss -> cleaner -> redis queue

Пример:
    scheduler = create_scheduler()
    scheduler.start()
"""

# TODO: Фаза 2 — реализовать
# from apscheduler.schedulers.blocking import BlockingScheduler
# from ..config import SOURCES, PARSE_INTERVAL_MINUTES
#
# def create_scheduler() -> BlockingScheduler:
#     scheduler = BlockingScheduler()
#     for source in SOURCES:
#         scheduler.add_job(
#             func=parse_source,
#             trigger="interval",
#             minutes=PARSE_INTERVAL_MINUTES,
#             args=[source],
#             id=f"parse_{source['name']}",
#         )
#     return scheduler
