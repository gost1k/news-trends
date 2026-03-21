import type { ViewMode } from './mapModes';
import { MODE_LABELS } from './mapModes';
import type { MapLocationState } from './mapTypes';
import { zoomBtnStyle } from './mapStyles';

type ModePanelProps = {
  mode: ViewMode;
  mapLocation: MapLocationState;
};

export function MapModePanel({ mode, mapLocation }: ModePanelProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
        maxWidth: 'min(92%, 320px)',
        background: 'rgba(255,255,255,.95)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,.15)',
        lineHeight: 1.45,
      }}
    >
      <div style={{ fontWeight: 600 }}>{MODE_LABELS[mode]}</div>
      <div style={{ color: '#444', marginTop: 4 }}>
        Текущий zoom: {mapLocation.zoom.toFixed(1)}
      </div>
      {mode === 'polygons' && (
        <div style={{ color: '#666', marginTop: 6 }}>
          Нажмите «+» справа или крутите колёсиком, пока zoom не станет ≥ 6 — появятся синие кластеры.
        </div>
      )}
    </div>
  );
}

type ZoomToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapZoomToolbar({ onZoomIn, onZoomOut }: ZoomToolbarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <button type="button" aria-label="Приблизить" style={zoomBtnStyle} onClick={onZoomIn}>
        +
      </button>
      <button type="button" aria-label="Отдалить" style={zoomBtnStyle} onClick={onZoomOut}>
        −
      </button>
    </div>
  );
}

export function MapFooterNote() {
  return (
    <p style={{ margin: '8px 0 0', fontSize: 11, color: '#666' }}>
      Кластеры — синие круги с числом на карте рядом с городами. В углу карты также бывает подпись
      Яндекса (условия API).
    </p>
  );
}
