# apps/web — React Frontend

SPA-приложение на React + TypeScript + Vite.

## Структура src/

| Папка | Назначение |
|-------|-----------|
| `components/Map/` | Leaflet-карта с маркерами событий, кластеризация, попапы с деталями |
| `components/News/` | Карточки новостей, список, детальный вид статьи |
| `components/Trends/` | Графики трендов (Recharts): timeline, топ тем, heatmap |
| `components/Chat/` | Интерфейс AI-чата: поле ввода, история сообщений, streaming ответов |
| `components/Filters/` | Фильтры: регион, дата, категория, источник, язык |
| `components/Layout/` | Общий каркас: Header, Sidebar, основной контент |
| `pages/` | Страницы приложения (React Router): MapPage, TrendsPage, ChatPage |
| `hooks/` | Custom React hooks: useNews, useMap, useChat, useWebSocket |
| `services/` | API-клиент (axios): newsApi, trendApi, chatApi, mapApi |
| `store/` | Zustand stores: useNewsStore, useFilterStore, useAuthStore |
| `types/` | Локальные TypeScript типы (специфичные для фронтенда) |
| `utils/` | Хелперы: форматирование дат, гео-утилиты, debounce |

## С чего начать (Фаза 1)

1. Изучи основы React: JSX, компоненты, пропсы, useState, useEffect
2. Создай `Layout/Header.tsx` и `Layout/Sidebar.tsx`
3. Добавь страницы в `pages/` и настрой React Router в `App.tsx`
4. Создай первый API-вызов в `services/newsApi.ts` с axios
5. Подключи Zustand для хранения состояния фильтров

## Полезные ресурсы

- [React Docs](https://react.dev/) — официальная документация
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Vite Guide](https://vite.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Recharts](https://recharts.org/)

## Команды

```bash
npm run dev      # Запуск dev-сервера (порт 5173)
npm run build    # Production-сборка
npm run preview  # Предпросмотр сборки
npm run lint     # Проверка ESLint
```
