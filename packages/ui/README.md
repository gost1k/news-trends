# packages/ui — UI-библиотека на Tailwind CSS

Собственная библиотека React-компонентов. Используется в `apps/web/`.

## Структура

```
src/
├── utils/
│   └── cn.ts              ← утилита для объединения Tailwind-классов (уже готова)
├── components/
│   ├── Button/            ← кнопка: variant (primary/secondary/ghost/danger), size, loading
│   ├── Card/              ← карточка новости: Card, CardHeader, CardTitle, CardFooter
│   ├── Input/             ← текстовое поле: label, error, placeholder
│   ├── Select/            ← выпадающий список: options, label, error
│   ├── Badge/             ← метка категории/sentiment: variant (success/warning/danger)
│   ├── Modal/             ← модальное окно: open, onClose, title
│   ├── Spinner/           ← индикатор загрузки: size (sm/md/lg)
│   └── Skeleton/          ← заглушка при загрузке: Skeleton, SkeletonText
└── index.ts               ← общий экспорт (раскомментировать по мере готовности)
```

## Как создать компонент

Пример — Button:

1. Создай `src/components/Button/Button.tsx`
2. Создай `src/components/Button/index.ts` → `export { Button } from './Button'`
3. Раскомментируй строку в `src/index.ts`

Каждый компонент — отдельная папка. Внутри:
- `ComponentName.tsx` — сам компонент
- `index.ts` — реэкспорт (чтобы импорт был `from './Button'`, а не `from './Button/Button'`)

## Утилита cn()

`cn()` — ключевая функция. Объединяет классы и решает конфликты Tailwind:

```tsx
import { cn } from '../../utils/cn';

cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
// → 'py-2 bg-blue-500 px-6'   (px-4 заменён на px-6)
```

Зависимости: `clsx` (условные классы) + `tailwind-merge` (разрешение конфликтов).

## Использование в apps/web

```tsx
import { Button, Card, Badge } from '@newsmap/ui';

function NewsCard({ title, category }) {
  return (
    <Card hoverable>
      <Badge variant="primary">{category}</Badge>
      <h3>{title}</h3>
      <Button variant="secondary" size="sm">Подробнее</Button>
    </Card>
  );
}
```

## Подход к стилизации

- Базовые стили через Tailwind-классы внутри компонента
- Кастомизация через `className` prop (переопределяет через `cn()`)
- Варианты через props: `variant`, `size` — маппятся на наборы Tailwind-классов
- Без CSS-файлов, всё в JSX
