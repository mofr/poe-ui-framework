import React from 'react';
import '../../styles/poe-panel.css';

// PoePanel — a layered decorative PANEL (docs/FRAME-FIDELITY.md). DEBUG skeleton.
// The PANEL is the whole component; the FRAME is one part. LAYOUT is just the box (size+padding+margin);
// every layer is decoration (absolute, inset:0, out of flow). All `*Scale` knobs are 1 = native px (1:1).

export type Frame = 'none' | 'debug-r0' | 'debug-r4' | 'debug-r8' | 'debug-r24' | 'frame-a' | 'frame-b';
export type Surface = 'none' | 'debug' | 'stone' | 'leather';
export type Integration = 'none' | 'debug';
export type Accent = 'none' | 'debug';

export interface PoePanelProps {
  children?: React.ReactNode;
  /** Frame raster set (corner radius + art). `frame-a/b` are real 1:1 frames. */
  frame?: Frame;
  /** Scales the frame + integration render (1 = native px). */
  frameScale?: number;
  /** Interior fill material. */
  surface?: Surface;
  /** Scales the surface texture tile (1 = native px). */
  surfaceScale?: number;
  /** Inner-shadow strength, 0–1 (0 = none). */
  surfaceShadow?: number;
  /** Shadow + specular that blend the frame into the page (raster-driven). */
  integration?: Integration;
  accentTop?: Accent;
  accentRight?: Accent;
  accentBottom?: Accent;
  accentLeft?: Accent;
  accentTopScale?: number;
  accentRightScale?: number;
  accentBottomScale?: number;
  accentLeftScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PoePanel({
  children,
  frame = 'debug-r8',
  frameScale = 1,
  surface = 'debug',
  surfaceScale = 1,
  surfaceShadow = 0.55,
  integration = 'debug',
  accentTop = 'none',
  accentRight = 'none',
  accentBottom = 'none',
  accentLeft = 'none',
  accentTopScale = 1,
  accentRightScale = 1,
  accentBottomScale = 1,
  accentLeftScale = 1,
  className = '',
  style,
}: PoePanelProps) {
  const vars = {
    '--frame-scale': frameScale,
    '--surface-scale': surfaceScale,
    '--surface-shadow': surfaceShadow,
    ...style,
  } as React.CSSProperties;

  const accents: Array<['t' | 'r' | 'b' | 'l', Accent, number]> = [
    ['t', accentTop, accentTopScale],
    ['r', accentRight, accentRightScale],
    ['b', accentBottom, accentBottomScale],
    ['l', accentLeft, accentLeftScale],
  ];

  return (
    <div
      className={`poe-panel ${className}`}
      data-frame={frame}
      data-surface={surface}
      data-integration={integration}
      style={vars}
    >
      <div className="poe-panel__surface" />               {/* D  surface */}
      <div className="poe-panel__recess" />                {/* inner shadow — seats the surface */}
      <div className="poe-panel__shadow" />                {/* C2 integration */}
      <div className="poe-panel__specular" />              {/* C1 integration (screen) */}
      <div className="poe-panel__content">{children}</div> {/* B  content */}
      <div className="poe-panel__art" />                   {/* A3 frame */}
      {accents.map(([e, choice, scale]) =>
        choice !== 'none' ? (
          <span
            key={e}
            className={`poe-panel__accent poe-panel__accent--${e}`}
            style={{ '--accent-scale': scale } as React.CSSProperties}
          />
        ) : null
      )}
    </div>
  );
}
