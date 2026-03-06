# services/parser — Python News Parser

Сервис парсинга новостей из RSS-фидов и веб-скраперов.

## Структура src/

| Папка | Назначение |
|-------|-----------|
| `scrapers/` | Скраперы для сайтов без RSS. Один файл = один источник. Наследуйся от `BaseScraper` |
| `feeds/` | RSS/Atom парсер через feedparser — универсальный для всех RSS-источников |
| `processors/` | Очистка HTML (BeautifulSoup), нормализация текста, удаление мусора |
| `geo/` | Геокодирование через Nominatim (OpenStreetMap) — название места → координаты |
| `queue/` | Публикация в Redis-очередь (LPUSH). AI-processor читает из очереди (BRPOP) |
| `scheduler/` | APScheduler — периодический запуск парсинга (каждые N минут) |

## Поток данных

```
Источник (RSS/Web) → scraper/feed → processor (очистка) → queue (Redis) → ai-processor
```

## Как добавить новый источник

### RSS (проще):
1. Добавь запись в `src/config.py` → `SOURCES` с `"type": "rss"`
2. RSS-парсер в `feeds/rss_parser.py` обработает автоматически

### Web-скрапер:
1. Создай `src/scrapers/my_source.py`
2. Наследуйся от `BaseScraper`, реализуй метод `scrape()`
3. Добавь источник в `config.py` с `"type": "scraper"`

## Запуск

```bash
cd services/parser
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m src.main
```

## Ключевые библиотеки

- **feedparser** — парсинг RSS/Atom фидов
- **beautifulsoup4 + lxml** — парсинг HTML, извлечение текста
- **requests / httpx** — HTTP-запросы
- **redis-py** — публикация в очередь
- **apscheduler** — планировщик задач
- **geopy** — геокодирование (Nominatim)
- **pydantic** — валидация данных

## С чего начать (Фаза 2)

1. Раскомментируй код в `feeds/rss_parser.py`
2. Запусти парсинг одного RSS-фида, выведи в консоль
3. Добавь очистку через `processors/cleaner.py`
4. Подключи Redis и публикуй через `queue/publisher.py`
5. Настрой APScheduler для периодического парсинга
