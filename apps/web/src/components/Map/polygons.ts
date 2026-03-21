/** Демо-регионы для полигонального слоя; заменить ответом API (GeoJSON / PostGIS). */
export type DemoRegionPolygon = {
  id: string;
  name: string;
  articleCount: number;
  color: string;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
};

export const DEMO_POLYGONS: DemoRegionPolygon[] = [
  {
    id: 'moscow-region',
    name: 'Москва',
    articleCount: 42,
    color: '#006efc',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [37.33, 55.57], [37.85, 55.57], [37.85, 55.92],
        [37.33, 55.92], [37.33, 55.57],
      ]],
    },
  },
  {
    id: 'spb-region',
    name: 'Санкт-Петербург',
    articleCount: 28,
    color: '#e5383b',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [30.1, 59.8], [30.55, 59.8], [30.55, 60.05],
        [30.1, 60.05], [30.1, 59.8],
      ]],
    },
  },
  {
    id: 'novosibirsk-region',
    name: 'Новосибирск',
    articleCount: 15,
    color: '#2dc653',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [82.75, 54.9], [83.15, 54.9], [83.15, 55.15],
        [82.75, 55.15], [82.75, 54.9],
      ]],
    },
  },
];
