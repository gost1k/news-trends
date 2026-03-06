"""
Точка входа парсера новостей.
Запускает планировщик, который периодически собирает новости
из настроенных источников и публикует их в Redis-очередь.
"""

from dotenv import load_dotenv

load_dotenv()


def main():
    # TODO: Фаза 2
    # 1. Загрузить конфиг источников из config.py
    # 2. Инициализировать Redis-подключение
    # 3. Создать и запустить APScheduler
    # 4. Для каждого источника зарегистрировать job:
    #    - RSS: вызов feeds/rss_parser.py
    #    - Scraper: вызов scrapers/<source>.py
    # 5. Результат каждого парсинга -> processors/cleaner.py -> queue/publisher.py
    print("Parser service started. Configure sources in config.py")


if __name__ == "__main__":
    main()
