# apps/web — React Frontend

SPA-приложение на React + TypeScript + Vite.

## Требования

- Node.js 22+
- API доступен по ожидаемому base URL (обычно `http://localhost:3001`)

## Быстрый старт

```bash
cd apps/web
npm install
npm run dev
```

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

## Smoke test

```bash
# Проверка, что Vite-сервер поднят
curl -I http://localhost:5173
```

Открой UI и проверь базовый путь пользователя: карта загружается, список новостей отображается, фильтры изменяют выдачу.

## Troubleshooting

- пустой UI или ошибки запросов: проверь, что `apps/api` запущен и base URL настроен корректно
- порт `5173` занят: перезапусти с другим портом (`npm run dev -- --port 5174`)
- ошибки типов/сборки: обнови зависимости (`npm install`) и проверь Node.js 22+
