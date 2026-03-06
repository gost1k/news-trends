"""
Очистка и нормализация текста статей.

Задачи:
  - Удаление HTML-тегов (BeautifulSoup)
  - Нормализация пробелов и переносов
  - Удаление рекламных блоков и служебных фраз
  - Обрезка до максимальной длины
"""

# TODO: Фаза 2 — реализовать
# from bs4 import BeautifulSoup
#
# def clean_html(html: str) -> str:
#     soup = BeautifulSoup(html, "lxml")
#     for tag in soup(["script", "style", "nav", "footer", "header"]):
#         tag.decompose()
#     return soup.get_text(separator=" ", strip=True)
#
# def normalize_text(text: str, max_length: int = 10000) -> str:
#     text = " ".join(text.split())
#     return text[:max_length]
