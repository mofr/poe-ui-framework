import React from 'react';
import './PoePanel.css';

// PoePanel — a layered decorative PANEL (docs/FRAME-FIDELITY.md). DEBUG skeleton.
// The PANEL is the whole component; the FRAME is one part. LAYOUT is just the box (size+padding+margin);
// every layer is decoration (absolute, inset:0, out of flow). All `*Scale` knobs are 1 = native px (1:1).

export type Frame = 'none' | 'debug-r0' | 'debug-r4' | 'debug-r8' | 'debug-r24' | 'jeweled-gold-1' | 'slim-gold-1' | 'slim-dark-1' | 'slim-dark-2' | 'slim-dark-3' | 'ruled-gold-1';
export type Surface = 'none' | 'debug' | 'cracked-stone-1' | 'cracked-stone-2' | 'worn-leather-1' | 'solid-black-1' | 'matte-stone-1' | 'matte-stone-2' | 'smooth-slate-1';
// Integration = the contact shadow blending the frame into the page. Chosen by the component user, because
// not every frame ships a clean cut: 'raster' = the frame's own integration PNG (when it has one); 'css' =
// a drop-shadow following the frame silhouette (works for any frame, no asset); 'none' = off.
export type Integration = 'none' | 'raster' | 'css';
export type Accent = 'none' | 'debug';

export interface PoePanelProps {
  children?: React.ReactNode;
  /** Frame raster set (corner radius + art). `slim-dark-*`/`ruled-gold-1` are real 1:1 frames extracted from the reference. */
  frame?: Frame;
  /** Scales the frame + integration render (1 = native px). */
  frameScale?: number;
  /** Interior fill material. */
  surface?: Surface;
  /** Scales the surface texture tile (1 = native px). */
  surfaceScale?: number;
  /** Inner-shadow blur radius in px (default 16) — the shadow that seats the surface into the frame. */
  innerShadowSize?: number;
  /** Inner-shadow colour, any CSS colour incl. opacity, e.g. 'rgba(0,0,0,.55)' (opacity = intensity). */
  innerShadowColor?: string;
  /** Frame spill past the box edge, in px at frameScale 1 (scales with frameScale); omit or negative = auto (half the band). */
  overhang?: number;
  /** Content inset from the box edge, in px at frameScale 1 (scales with frameScale); omit or negative = auto (= frame thickness). */
  contentPad?: number;
  /** Contact shadow blending the frame into the page: 'raster' (frame's cut PNG), 'css' (drop-shadow), 'none'. */
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
  innerShadowSize,
  innerShadowColor,
  overhang,
  contentPad,
  integration = 'raster',
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
    ...(innerShadowSize != null ? { '--inner-shadow-size': `${innerShadowSize}px` } : {}),
    ...(innerShadowColor != null ? { '--inner-shadow-color': innerShadowColor } : {}),
    // Explicit overhang/content-pad are "px at frameScale 1" and scale with the frame, matching the
    // auto defaults — so frameScale stays a uniform zoom even when these are non-zero.
    ...(overhang != null && overhang >= 0 ? { '--overhang': `calc(${overhang}px * var(--frame-scale))` } : {}),
    ...(contentPad != null && contentPad >= 0 ? { '--content-pad': `calc(${contentPad}px * var(--frame-scale))` } : {}),
    ...style,
  } as React.CSSProperties;

  const accent = (edge: 't' | 'r' | 'b' | 'l', choice: Accent, scale: number) =>
    choice === 'none' ? null : (
      <span
        className={`poe-panel__accent poe-panel__accent--${edge}`}
        style={{ '--accent-scale': scale } as React.CSSProperties}
      />
    );

  return (
    <div
      className={`poe-panel ${className}`}
      data-frame={frame}
      data-surface={surface}
      data-integration={integration}
      style={vars}
    >
      <div className="poe-panel__surface" />                     {/* D  surface */}
      <div className="poe-panel__inner-shadow" />                {/* inner shadow — seats the surface */}
      <div className="poe-panel__integration-shadow" />          {/* C2 integration */}
      <div className="poe-panel__integration-specular" />        {/* C1 integration (screen) */}
      <div className="poe-panel__content">{children}</div>       {/* B  content — compose PoePanelHeader / PoePanelBody (parts self-pad) */}
      <div className="poe-panel__frame" />                       {/* A3 frame */}
      {accent('t', accentTop, accentTopScale)}
      {accent('r', accentRight, accentRightScale)}
      {accent('b', accentBottom, accentBottomScale)}
      {accent('l', accentLeft, accentLeftScale)}
    </div>
  );
}

// Composable parts (the shadcn/MUI Card model): the panel imposes NO padding — full-bleed is the
// default. Each part self-pads from --content-pad (the per-frame clearance). Drop them in as children;
// either is optional, and a bare full-bleed child (image, flush list) needs no wrapper. Both are plain
// styled divs — swap in your own element when you want a custom header/body.

/** Section title bar — spans the panel interior; text inset to clear the frame. Title left, meta right. */
export function PoePanelHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`poe-panel__header ${className}`.trim()} {...props}>{children}</div>;
}

/** Padded content region (content cleared from the frame). Omit it for full-bleed content. */
export function PoePanelBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`poe-panel__body ${className}`.trim()} {...props}>{children}</div>;
}
