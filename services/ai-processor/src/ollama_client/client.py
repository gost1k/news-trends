"""
HTTP-клиент для Ollama API.

Ollama предоставляет REST API:
  POST /api/generate   — генерация текста
  POST /api/embeddings — создание эмбеддингов
  POST /api/chat       — чат с моделью

Документация: https://github.com/ollama/ollama/blob/main/docs/api.md
"""

# TODO: Фаза 3 — реализовать
# import httpx
# from ..config import OLLAMA_BASE_URL, OLLAMA_MODEL
#
# class OllamaClient:
#     def __init__(self, base_url: str = OLLAMA_BASE_URL):
#         self.base_url = base_url
#         self.client = httpx.Client(base_url=base_url, timeout=120.0)
#
#     def generate(self, prompt: str, model: str = OLLAMA_MODEL) -> str:
#         response = self.client.post("/api/generate", json={
#             "model": model,
#             "prompt": prompt,
#             "stream": False,
#         })
#         return response.json()["response"]
#
#     def embed(self, text: str, model: str = "nomic-embed-text") -> list[float]:
#         response = self.client.post("/api/embeddings", json={
#             "model": model,
#             "prompt": text,
#         })
#         return response.json()["embedding"]
