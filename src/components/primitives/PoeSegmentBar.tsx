import React from 'react';

// Segmented progress bar: a 9-slice raster rail + the raster segment repeated with
// `background-repeat: round` (natural integer count, any width). `variant` picks the rail+segment
// raster set ('blue' is extracted; 'green' is a temporary recolour until its own mask exists).
// `pad` (px) controls the gap between segments and the rail.
export interface PoeSegmentBarProps {
  variant?: 'blue' | 'green';
  /** Gap (px) between segments and the rail. */
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
