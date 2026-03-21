export type ViewMode = 'polygons' | 'clusters' | 'points';

/** Полигоны → кластеры → отдельные маркеры */
export function zoomToMode(zoom: number): ViewMode {
  if (zoom <= 5) return 'polygons';
  if (zoom <= 11) return 'clusters';
  return 'points';
}

export const MODE_LABELS: Record<ViewMode, string> = {
  polygons: 'Регионы (zoom ≤ 5)',
  clusters: 'Кластеры (zoom 6–11) — синие кружки с числом',
  points: 'Точки (zoom ≥ 12)',
};
