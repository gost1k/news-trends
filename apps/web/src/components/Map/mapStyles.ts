import type { CSSProperties } from 'react';

export const markerStyle: CSSProperties = {
  fontSize: 12,
  background: '#fff',
  border: '2px solid #006efc',
  borderRadius: 8,
  padding: '2px 8px',
  whiteSpace: 'nowrap',
  transform: 'translate(-50%, -100%)',
  cursor: 'pointer',
};

export const clusterStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#fff',
  background: '#006efc',
  borderRadius: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  border: '3px solid #fff',
  boxShadow: '0 2px 10px rgba(0,0,0,.45)',
};

export const zoomBtnStyle: CSSProperties = {
  width: 36,
  height: 36,
  fontSize: 20,
  lineHeight: 1,
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: 6,
  background: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.12)',
};
