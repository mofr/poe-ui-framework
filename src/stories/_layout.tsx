import React from 'react';

// Shared layout helpers for catalog-style stories. Not a story file.
interface BoxProps {
  children?: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}

export const Row = ({ children, gap = 12, style }: BoxProps) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: 'center', ...style }}>{children}</div>
);

export const Stack = ({ children, gap = 12, style }: BoxProps) => (
  <div style={{ display: 'grid', gap, ...style }}>{children}</div>
);

export const Grid = ({ children, min = 220, gap = 12 }: BoxProps & { min?: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${min}px,1fr))`, gap }}>{children}</div>
);

// Small caption under a specimen.
export const Caption = ({ children }: { children?: React.ReactNode }) => (
  <div className="poe-text-meta" style={{ fontFamily: 'var(--poe-font-number)', fontSize: 10, marginTop: 6 }}>{children}</div>
);
