/**
 * Яндекс Карты JS API 3.0 — NewsMap с гибридным отображением.
 *
 * Три режима визуализации переключаются автоматически по уровню зума:
 *
 *   zoom 2–6   → Полигоны регионов с подписями «N новостей»
 *   zoom 7–11  → Кластеры: близкие точки схлопываются в кружок с числом
 *   zoom 12+   → Отдельные маркеры с заголовками новостей
 *
 * Демо-данные в DEMO_POLYGONS и DEMO_POINTS — замени на ответы API.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

const CENTER: [number, number] = [37.62, 55.75];

type ViewMode = 'polygons' | 'clusters' | 'points';

function zoomToMode(zoom: number): ViewMode {
  if (zoom <= 6) return 'polygons';
  if (zoom <= 11) return 'clusters';
  return 'points';
}

// ── Демо-данные: полигоны регионов ──────────────────────────────────────────

const DEMO_POLYGONS = [
  {
    id: 'moscow-region',
    name: 'Москва',
    articleCount: 42,
    color: '#006efc',
    geometry: {
      type: 'Polygon' as const,
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
      type: 'Polygon' as const,
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
      type: 'Polygon' as const,
      coordinates: [[
        [82.75, 54.9], [83.15, 54.9], [83.15, 55.15],
        [82.75, 55.15], [82.75, 54.9],
      ]],
    },
  },
];

// ── Демо-данные: точки событий ──────────────────────────────────────────────

type PointFeature = {
  type: 'Feature';
  id: string;
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: { title: string };
};

const DEMO_POINTS: PointFeature[] = [
  { type: 'Feature', id: '1',  geometry: { type: 'Point', coordinates: [37.62, 55.75] }, properties: { title: 'Протесты в центре Москвы' } },
  { type: 'Feature', id: '2',  geometry: { type: 'Point', coordinates: [37.58, 55.73] }, properties: { title: 'Пресс-конференция в Кремле' } },
  { type: 'Feature', id: '3',  geometry: { type: 'Point', coordinates: [37.65, 55.77] }, properties: { title: 'Открытие выставки в ВДНХ' } },
  { type: 'Feature', id: '4',  geometry: { type: 'Point', coordinates: [37.50, 55.70] }, properties: { title: 'ДТП на МКАДе' } },
  { type: 'Feature', id: '5',  geometry: { type: 'Point', coordinates: [30.32, 59.93] }, properties: { title: 'Наводнение в Петербурге' } },
  { type: 'Feature', id: '6',  geometry: { type: 'Point', coordinates: [30.36, 59.95] }, properties: { title: 'Форум в Петербурге' } },
  { type: 'Feature', id: '7',  geometry: { type: 'Point', coordinates: [30.28, 59.90] }, properties: { title: 'Авария на Невском' } },
  { type: 'Feature', id: '8',  geometry: { type: 'Point', coordinates: [82.92, 55.03] }, properties: { title: 'Пожар в Новосибирске' } },
  { type: 'Feature', id: '9',  geometry: { type: 'Point', coordinates: [39.72, 47.22] }, properties: { title: 'Учения в Ростове' } },
  { type: 'Feature', id: '10', geometry: { type: 'Point', coordinates: [49.12, 55.78] }, properties: { title: 'IT-конференция в Казани' } },
  { type: 'Feature', id: '11', geometry: { type: 'Point', coordinates: [56.25, 58.01] }, properties: { title: 'Землетрясение у Перми' } },
  { type: 'Feature', id: '12', geometry: { type: 'Point', coordinates: [60.60, 56.84] }, properties: { title: 'Саммит в Екатеринбурге' } },
];

// ── Типы ────────────────────────────────────────────────────────────────────

type NewsMapProps = {
  className?: string;
};

type YmapsComponents = {
  YMap: any;
  YMapDefaultSchemeLayer: any;
  YMapDefaultFeaturesLayer: any;
  YMapMarker: any;
  YMapFeature: any;
  YMapListener: any;
  YMapClusterer: any;
  clusterByGrid: any;
};

// ── Загрузка API ────────────────────────────────────────────────────────────

let scriptPromise: Promise<void> | null = null;

function loadYmapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return Promise.reject(new Error('VITE_YANDEX_MAPS_API_KEY не задан в apps/web/.env'));
  }

  const src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => {
      scriptPromise = null;
      console.error('[NewsMap] Ошибка загрузки скрипта:', src, e);
      reject(new Error(`Не удалось загрузить скрипт: ${src}`));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

async function initYmaps(): Promise<YmapsComponents> {
  await loadYmapsScript();
  await ymaps3.ready;

  const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify');
  const reactify = ymaps3Reactify.reactify.bindTo(
    await import('react'),
    await import('react-dom'),
  );

  const {
    YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,
    YMapMarker, YMapFeature, YMapListener,
  } = reactify.module(ymaps3);

  ymaps3.import.registerCdn(
    'https://cdn.jsdelivr.net/npm/{package}',
    '@yandex/ymaps3-clusterer@latest',
  );
  const clustererModule = await ymaps3.import('@yandex/ymaps3-clusterer' as any) as any;
  const { YMapClusterer, clusterByGrid } = reactify.module(clustererModule);

  return {
    YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,
    YMapMarker, YMapFeature, YMapListener, YMapClusterer, clusterByGrid,
  };
}

// ── Стили маркеров ──────────────────────────────────────────────────────────

const markerStyle: React.CSSProperties = {
  fontSize: 12, background: '#fff', border: '2px solid #006efc',
  borderRadius: 8, padding: '2px 8px', whiteSpace: 'nowrap',
  transform: 'translate(-50%, -100%)', cursor: 'pointer',
};

const clusterStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: '#fff', background: '#006efc',
  borderRadius: '50%', width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transform: 'translate(-50%, -50%)', cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,.3)',
};

function renderMarker(feature: PointFeature): ReactElement {
  return (
    <div style={markerStyle} title={feature.properties.title}>
      {feature.properties.title}
    </div>
  );
}

function renderCluster(_coordinates: [number, number], features: PointFeature[]): ReactElement {
  return <div style={clusterStyle}>{features.length}</div>;
}

// ── Подкомпоненты слоёв ─────────────────────────────────────────────────────

function PolygonsLayer({ YMapFeature, YMapMarker }: Pick<YmapsComponents, 'YMapFeature' | 'YMapMarker'>) {
  return (
    <>
      {DEMO_POLYGONS.map((poly) => (
        <YMapFeature
          key={poly.id}
          geometry={poly.geometry}
          style={{
            stroke: [{ color: poly.color, width: 2 }],
            fill: poly.color + '20',
          }}
        />
      ))}
      {DEMO_POLYGONS.map((poly) => {
        const coords = poly.geometry.coordinates[0]!;
        const lngs = coords.map((c) => c[0]!);
        const lats = coords.map((c) => c[1]!);
        const center: [number, number] = [
          (Math.min(...lngs) + Math.max(...lngs)) / 2,
          (Math.min(...lats) + Math.max(...lats)) / 2,
        ];
        return (
          <YMapMarker key={`label-${poly.id}`} coordinates={center}>
            <div style={{
              transform: 'translate(-50%, -50%)',
              background: poly.color, color: '#fff', borderRadius: 6,
              padding: '2px 8px', fontSize: 11, whiteSpace: 'nowrap',
            }}>
              {poly.name}: {poly.articleCount} новостей
            </div>
          </YMapMarker>
        );
      })}
    </>
  );
}

function ClustersLayer({ YMapClusterer, clusterByGrid }: Pick<YmapsComponents, 'YMapClusterer' | 'clusterByGrid'>) {
  return (
    <YMapClusterer
      marker={renderMarker}
      cluster={renderCluster}
      method={clusterByGrid({ gridSize: 64 })}
      features={DEMO_POINTS}
    />
  );
}

function PointsLayer({ YMapMarker }: Pick<YmapsComponents, 'YMapMarker'>) {
  return (
    <>
      {DEMO_POINTS.map((pt) => (
        <YMapMarker key={pt.id} coordinates={pt.geometry.coordinates}>
          <div style={markerStyle} title={pt.properties.title}>
            {pt.properties.title}
          </div>
        </YMapMarker>
      ))}
    </>
  );
}

// ── Компонент карты ─────────────────────────────────────────────────────────

const modeLabels: Record<ViewMode, string> = {
  polygons: 'Регионы (zoom ≤ 6)',
  clusters: 'Кластеры (zoom 7–11)',
  points: 'Точки (zoom ≥ 12)',
};

const NewsMap = ({ className }: NewsMapProps) => {
  const [components, setComponents] = useState<YmapsComponents | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('polygons');
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    initYmaps()
      .then(setComponents)
      .catch((err) => setError(err?.message ?? 'Ошибка загрузки Яндекс Карт'));
  }, []);

  const handleUpdate = useCallback(({ location }: { location: { zoom: number } }) => {
    setMode((prev) => {
      const next = zoomToMode(location.zoom);
      return next === prev ? prev : next;
    });
  }, []);

  // Стабильная ссылка — без неё каждый ре-рендер сбрасывает позицию карты.
  // Все хуки должны быть ДО ранних return, иначе React падает с "Rendered more hooks".
  const initialLocation = useMemo(() => ({ center: CENTER, zoom: 4 }), []);

  if (error) return <div>Карта недоступна: {error}</div>;
  if (!components) return <div>Загрузка карты…</div>;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = components;

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Индикатор текущего режима */}
      <div style={{
        position: 'absolute', top: 8, left: 8, zIndex: 10,
        background: 'rgba(255,255,255,.9)', borderRadius: 6,
        padding: '4px 10px', fontSize: 12, boxShadow: '0 1px 4px rgba(0,0,0,.15)',
      }}>
        {modeLabels[mode]}
      </div>

      <div style={{ height: 500, width: '100%' }}>
        <YMap location={initialLocation} mode="vector">
          <YMapDefaultSchemeLayer />
          <YMapDefaultFeaturesLayer />
          <YMapListener onUpdate={handleUpdate} />

          {mode === 'polygons' && (
            <PolygonsLayer YMapFeature={components.YMapFeature} YMapMarker={components.YMapMarker} />
          )}
          {mode === 'clusters' && (
            <ClustersLayer YMapClusterer={components.YMapClusterer} clusterByGrid={components.clusterByGrid} />
          )}
          {mode === 'points' && (
            <PointsLayer YMapMarker={components.YMapMarker} />
          )}
        </YMap>
      </div>
    </div>
  );
};

export default NewsMap;
