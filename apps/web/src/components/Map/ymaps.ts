export type YmapsComponents = {
  YMap: any;
  YMapDefaultSchemeLayer: any;
  YMapDefaultFeaturesLayer: any;
  YMapFeatureDataSource: any;
  YMapLayer: any;
  YMapMarker: any;
  YMapFeature: any;
  YMapListener: any;
  YMapClusterer: any;
  clusterByGrid: any;
};

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

export async function initYmaps(): Promise<YmapsComponents> {
  await loadYmapsScript();
  await ymaps3.ready;

  const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify');
  const reactify = ymaps3Reactify.reactify.bindTo(
    await import('react'),
    await import('react-dom'),
  );

  const {
    YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,
    YMapFeatureDataSource, YMapLayer,
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
    YMapFeatureDataSource, YMapLayer,
    YMapMarker, YMapFeature, YMapListener, YMapClusterer, clusterByGrid,
  };
}
