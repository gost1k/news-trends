/**
 * Яндекс Карты 3.0 — оболочка: загрузка API, синхронизация zoom/центра, переключение слоёв.
 * Данные и визуальные слои — в `points.ts`, `polygons.ts`, `*MapLayer.tsx`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CENTER } from './constants';
import { ClusterMapLayer } from './ClusterMapLayer';
import { MapFooterNote, MapModePanel, MapZoomToolbar } from './MapOverlays';
import { zoomToMode, type ViewMode } from './mapModes';
import type { MapLocationState, NewsMapProps } from './mapTypes';
import { PolygonMapLayer } from './PolygonMapLayer';
import { PointsMapLayer } from './PointsMapLayer';
import { normalizeCenter } from './tools';
import { initYmaps, type YmapsComponents } from './ymaps';

const MAP_HEIGHT_PX = 500;

export default function NewsMap({ className }: NewsMapProps) {
  const [components, setComponents] = useState<YmapsComponents | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('polygons');
  const [mapLocation, setMapLocation] = useState<MapLocationState>(() => ({
    center: CENTER,
    zoom: 4,
  }));
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    initYmaps()
      .then(setComponents)
      .catch((err) => setError(err?.message ?? 'Ошибка загрузки Яндекс Карт'));
  }, []);

  const handleUpdate = useCallback((payload: { location: { center: unknown; zoom: number } }) => {
    const { location } = payload;
    const center = normalizeCenter(location.center);
    const z = location.zoom;
    setMapLocation((prev) => {
      if (
        Math.abs(prev.zoom - z) < 0.001 &&
        Math.abs(prev.center[0] - center[0]) < 1e-8 &&
        Math.abs(prev.center[1] - center[1]) < 1e-8
      ) {
        return prev;
      }
      return { center, zoom: z };
    });
  }, []);

  useEffect(() => {
    setMode((prev) => {
      const next = zoomToMode(mapLocation.zoom);
      return next === prev ? prev : next;
    });
  }, [mapLocation.zoom]);

  const bumpZoom = useCallback((delta: number) => {
    setMapLocation((prev) => ({
      center: prev.center,
      zoom: Math.min(18, Math.max(2, prev.zoom + delta)),
    }));
  }, []);

  if (error) return <div>Карта недоступна: {error}</div>;
  if (!components) return <div>Загрузка карты…</div>;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = components;

  return (
    <div className={className} style={{ position: 'relative' }}>
      <MapModePanel mode={mode} mapLocation={mapLocation} />

      <div style={{ height: MAP_HEIGHT_PX, width: '100%', position: 'relative' }}>
        <MapZoomToolbar onZoomIn={() => bumpZoom(1)} onZoomOut={() => bumpZoom(-1)} />
        <YMap location={mapLocation} mode="vector">
          <YMapDefaultSchemeLayer />
          <YMapDefaultFeaturesLayer />
          <YMapListener onUpdate={handleUpdate} />

          {mode === 'polygons' && (
            <PolygonMapLayer YMapFeature={components.YMapFeature} YMapMarker={components.YMapMarker} />
          )}
          {mode === 'clusters' && (
            <ClusterMapLayer
              YMapClusterer={components.YMapClusterer}
              clusterByGrid={components.clusterByGrid}
              YMapMarker={components.YMapMarker}
              YMapFeatureDataSource={components.YMapFeatureDataSource}
              YMapLayer={components.YMapLayer}
            />
          )}
          {mode === 'points' && <PointsMapLayer YMapMarker={components.YMapMarker} />}
        </YMap>
      </div>

      <MapFooterNote />
    </div>
  );
}
