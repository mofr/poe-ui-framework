import React from 'react';
import './PoeSegmentBar.css';

// Segmented progress bar: a 9-slice raster rail (shared) + the per-variant fill repeated with
// `background-repeat: round` (natural integer count, any width). `variant` picks the fill raster;
// `blue` is extracted, `green` is a baked recolour shipped as its own asset. `pad` (px) is the gap
// between the fill and the rail.
export interface PoeSegmentBarProps {
  variant?: 'blue' | 'green';
  /** Gap (px) between the fill and the rail. */
  pad?: number;
  className?: string;
}

export function PoeSegmentBar({ variant = 'blue', pad, className = '' }: PoeSegmentBarProps) {
  const style = pad != null ? ({ '--segment-pad': `${pad}px` } as React.CSSProperties) : undefined;
  return (
    <div className={`poe-segment-bar ${className}`} data-variant={variant} style={style}>
      <div className="poe-segment-fill" />
    </div>
  );
}
