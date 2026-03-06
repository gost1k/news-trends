import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет Tailwind-классы без конфликтов.
 * cn('px-4 py-2', condition && 'bg-blue-500', 'px-6')
 * → 'py-2 bg-blue-500 px-6' (px-4 заменён на px-6, не дублируется)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
