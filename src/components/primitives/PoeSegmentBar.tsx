import React from 'react';
import './PoeSegmentBar.css';

// Segmented progress bar: a 9-slice raster rail (shared) + the per-variant fill repeated with
// `background-repeat: round`. `variant` picks the fill raster (`blue` extracted, `green` a baked
// recolour). With `value` omitted the fill spans the whole rail (decorative). Pass `value` (0..1) to
// drive real progress — e.g. an XP bar — and `label` for a centred overlay (XP count, percent…).
export interface PoeSegmentBarProps {
  variant?: 'blue' | 'green';
  /** Fill fraction 0..1. Omit for a full decorative bar. */
  value?: number;
  /** Centred overlay text (e.g. "68,750 / 100,000 XP"). */
  label?: React.ReactNode;
  /** Gap (px) between the fill and the rail. */
  pad?: number;
  className?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function PoeSegmentBar({ variant = 'blue', value, label, pad, className = '' }: PoeSegmentBarProps) {
  const style = pad != null ? ({ '--segment-pad': `${pad}px` } as React.CSSProperties) : undefined;
  const measured = value != null;
  const pct = measured ? clamp01(value) * 100 : 100;
  return (
    <div
      className={`poe-segment-bar ${className}`.trim()}
      data-variant={variant}
      style={style}
      role={measured ? 'progressbar' : undefined}
      aria-valuenow={measured ? Math.round(pct) : undefined}
      aria-valuemin={measured ? 0 : undefined}
      aria-valuemax={measured ? 100 : undefined}
    >
      <div className="poe-segment-track">
        <div className="poe-segment-fill" style={measured ? { width: `${pct}%` } : undefined} />
      </div>
      {label != null && <div className="poe-segment-label">{label}</div>}
    </div>
  );
}
