import React from 'react';
import './PoeCircleFrame.css';

// Circular frame container: the round analog of PoePanel's decorative frame — a metallic ring wrapping
// arbitrary content. Pass `src` for a clipped image, or `children` for anything else (a number → level
// orb, initials, an icon). `status` adds a corner presence dot; `glow` lights the inner accent ring.
//
// Two looks: the CSS-baseline metallic ring (default), or a cut raster ring via `raster` — a trimmed
// annulus PNG that overlays on top while the content sits behind it, anchored to the mask's hole. The
// per-raster image + content-box live in a `[data-raster=…]` block in the CSS.
export type PoeCircleFrameStatus = 'online' | 'away' | 'busy' | 'offline';

export interface PoeCircleFrameProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Convenience: an image URL to clip inside the ring. Omit to render `children` instead. */
  src?: string;
  alt?: string;
  /** Outer diameter in px (default 96). Ring thickness scales with it. */
  size?: number;
  /** Corner presence dot. */
  status?: PoeCircleFrameStatus;
  /** Light the inner accent ring (content sits on a coloured glow, like the reference hero avatar). */
  glow?: boolean;
  /** Accent colour for the inner glow / default status hue (default: --poe-blue). */
  accent?: string;
  /** Use a cut raster ring (a `[data-raster=…]` name, e.g. "big-ornate-1") instead of the CSS ring. */
  raster?: string;
}

export function PoeCircleFrame({
  src, alt = '', size = 96, status, glow = false, accent, raster, children, className = '', style, ...props
}: PoeCircleFrameProps) {
  const classes = ['poe-circle-frame', raster && 'poe-circle-frame--raster', glow && 'is-glowing', className].filter(Boolean).join(' ');
  const vars = {
    '--poe-circle-frame-size': `${size}px`,
    ...(accent ? { '--poe-circle-frame-accent': accent } : null),
  } as React.CSSProperties;
  const content = src ? <img className="poe-circle-frame__img" src={src} alt={alt} /> : children;
  return (
    <span className={classes} data-raster={raster || undefined} style={{ ...vars, ...style }} {...props}>
      {raster ? (
        // outer-shadow caster (below the content, so its inner-edge shadow hides under it),
        // then content, then the cut ring art on top
        <>
          <span className="poe-circle-frame__shadow" aria-hidden="true" />
          <span className="poe-circle-frame__inner">{content}</span>
          <span className="poe-circle-frame__art" aria-hidden="true" />
        </>
      ) : (
        // CSS ring wraps the content
        <span className="poe-circle-frame__ring">
          <span className="poe-circle-frame__inner">{content}</span>
        </span>
      )}
      {status && <span className="poe-circle-frame__status" data-status={status} aria-label={status} />}
    </span>
  );
}
