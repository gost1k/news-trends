import type { ReactElement } from 'react';
import { CLUSTER_SOURCE_ID } from './constants';
import { clusterStyle, markerStyle } from './mapStyles';
import { DEMO_POINTS, type PointFeature } from './points';
import type { YmapsComponents } from './ymaps';

type Props = Pick<
  YmapsComponents,
  'YMapClusterer' | 'clusterByGrid' | 'YMapMarker' | 'YMapFeatureDataSource' | 'YMapLayer'
>;

/**
 * Кластеры требуют отдельный data source + слой markers и source у каждого YMapMarker
 * (см. доку @yandex/ymaps3-clusterer).
 */
export function ClusterMapLayer({
  YMapClusterer,
  clusterByGrid,
  YMapMarker,
  YMapFeatureDataSource,
  YMapLayer,
}: Props) {
  const marker = (feature: PointFeature): ReactElement => (
    <YMapMarker
      key={feature.id}
      coordinates={feature.geometry.coordinates}
      source={CLUSTER_SOURCE_ID}
    >
      <div style={markerStyle} title={feature.properties.title}>
        {feature.properties.title}
      </div>
    </YMapMarker>
  );

  const cluster = (coordinates: [number, number], features: PointFeature[]): ReactElement => (
    <YMapMarker
      key={`c-${features[0]?.id ?? 'x'}-${features.length}`}
      coordinates={coordinates}
      source={CLUSTER_SOURCE_ID}
    >
      <div style={clusterStyle}>{features.length}</div>
    </YMapMarker>
  );

  return (
    <>
      <YMapFeatureDataSource id={CLUSTER_SOURCE_ID} />
      <YMapLayer source={CLUSTER_SOURCE_ID} type="markers" zIndex={1800} />
      <YMapClusterer
        marker={marker}
        cluster={cluster}
        method={clusterByGrid({ gridSize: 96 })}
        features={DEMO_POINTS}
      />
    </>
  );
}
