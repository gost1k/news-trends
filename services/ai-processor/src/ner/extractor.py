"""
Named Entity Recognition (NER) через Ollama.

Извлекает из текста статьи:
  - Персоны (кто)
  - Локации (где) — передаются в геокодер
  - Организации (кто/что)
  - События (что произошло)
  - Даты (когда)

Используется structured prompt для получения JSON-ответа от LLM.

Пример промпта:
    "Извлеки сущности из текста в JSON:
     {persons: [], locations: [], organizations: [], events: [], dates: []}"
"""

# TODO: Фаза 3 — реализовать
# NER_PROMPT_TEMPLATE = '''
# Extract named entities from the following news article.
# Return ONLY valid JSON with this structure:
# {
#   "persons": ["name1", "name2"],
#   "locations": ["city1", "country1"],
#   "organizations": ["org1"],
#   "events": ["short event description"],
#   "dates": ["2024-01-01"]
# }
#
# Article:
# {text}
# '''
