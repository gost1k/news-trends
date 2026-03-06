"""
Базовый класс скрапера. Все скраперы наследуются от него.

Реализуй для каждого сайта свой скрапер:
  class RiaScraper(BaseScraper):
      def scrape(self) -> list[RawArticle]:
          ...
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class RawArticle:
    """Сырая статья до AI-обработки."""

    title: str
    content: str
    url: str
    published_at: str
    source_name: str
    language: str  # "ru" | "en"


class BaseScraper(ABC):
    def __init__(self, source_name: str, source_url: str, language: str):
        self.source_name = source_name
        self.source_url = source_url
        self.language = language

    @abstractmethod
    def scrape(self) -> list[RawArticle]:
        """Собрать список статей с источника."""
        ...
