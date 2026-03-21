import { markerStyle } from './mapStyles';
import { DEMO_POINTS } from './points';
import type { YmapsComponents } from './ymaps';

type Props = Pick<YmapsComponents, 'YMapMarker'>;

/** Режим «все точки» без кластеризации. */
export function PointsMapLayer({ YMapMarker }: Props) {
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
