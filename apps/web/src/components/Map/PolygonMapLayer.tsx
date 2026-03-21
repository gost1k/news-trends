import { DEMO_POLYGONS } from './polygons';
import type { YmapsComponents } from './ymaps';

type Props = Pick<YmapsComponents, 'YMapFeature' | 'YMapMarker'>;

/** Режим «регионы»: полигоны + подписи в центре bbox. */
export function PolygonMapLayer({ YMapFeature, YMapMarker }: Props) {
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
            <div
              style={{
                transform: 'translate(-50%, -50%)',
                background: poly.color,
                color: '#fff',
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: 11,
                whiteSpace: 'nowrap',
              }}
            >
              {poly.name}: {poly.articleCount} новостей
            </div>
          </YMapMarker>
        );
      })}
    </>
  );
}
