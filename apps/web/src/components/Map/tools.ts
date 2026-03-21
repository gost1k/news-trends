import { CENTER } from './constants';

/** Нормализует center из события карты к кортежу [lon, lat]. */
export function normalizeCenter(center: unknown): [number, number] {
  if (Array.isArray(center) && center.length >= 2) {
    return [Number(center[0]), Number(center[1])];
  }
  if (center && typeof center === 'object' && 'lng' in center && 'lat' in center) {
    const c = center as { lng: number; lat: number };
    return [c.lng, c.lat];
  }
  return CENTER;
}
