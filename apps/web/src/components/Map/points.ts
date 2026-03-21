export type PointFeature = {
  type: 'Feature';
  id: string;
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: { title: string };
};

/** Демо-события для кластеров / точек; заменить ответом `/api/v1/map/...`. */
export const DEMO_POINTS: PointFeature[] = [
  { type: 'Feature', id: '1', geometry: { type: 'Point', coordinates: [37.62, 55.75] }, properties: { title: 'Протесты в центре Москвы' } },
  { type: 'Feature', id: '2', geometry: { type: 'Point', coordinates: [37.58, 55.73] }, properties: { title: 'Пресс-конференция в Кремле' } },
  { type: 'Feature', id: '3', geometry: { type: 'Point', coordinates: [37.65, 55.77] }, properties: { title: 'Открытие выставки в ВДНХ' } },
  { type: 'Feature', id: '4', geometry: { type: 'Point', coordinates: [37.50, 55.70] }, properties: { title: 'ДТП на МКАДе' } },
  { type: 'Feature', id: '5', geometry: { type: 'Point', coordinates: [30.32, 59.93] }, properties: { title: 'Наводнение в Петербурге' } },
  { type: 'Feature', id: '6', geometry: { type: 'Point', coordinates: [30.36, 59.95] }, properties: { title: 'Форум в Петербурге' } },
  { type: 'Feature', id: '7', geometry: { type: 'Point', coordinates: [30.28, 59.90] }, properties: { title: 'Авария на Невском' } },
  { type: 'Feature', id: '8', geometry: { type: 'Point', coordinates: [82.92, 55.03] }, properties: { title: 'Пожар в Новосибирске' } },
  { type: 'Feature', id: '9', geometry: { type: 'Point', coordinates: [39.72, 47.22] }, properties: { title: 'Учения в Ростове' } },
  { type: 'Feature', id: '10', geometry: { type: 'Point', coordinates: [49.12, 55.78] }, properties: { title: 'IT-конференция в Казани' } },
  { type: 'Feature', id: '11', geometry: { type: 'Point', coordinates: [56.25, 58.01] }, properties: { title: 'Землетрясение у Перми' } },
  { type: 'Feature', id: '12', geometry: { type: 'Point', coordinates: [60.60, 56.84] }, properties: { title: 'Саммит в Екатеринбурге' } },
];
