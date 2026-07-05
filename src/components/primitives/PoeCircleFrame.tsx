import React from 'react';
import './PoeCircleFrame.css';

// Circular frame container: the round analog of PoePanel's decorative frame — a metallic ring (CSS
// baseline; a painterly raster ring is a later manual pass) wrapping arbitrary content. Pass `src` for a
// clipped image, or `children` for anything else (a number → level orb, initials, an icon). `status` adds
// a corner presence dot; `glow` lights the inner accent ring.
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
}

export function PoeCircleFrame({
  src, alt = '', size = 96, status, glow = false, accent, children, className = '', style, ...props
}: PoeCircleFrameProps) {
  const classes = ['poe-circle-frame', glow && 'is-glowing', className].filter(Boolean).join(' ');
  const vars = {
    '--poe-circle-frame-size': `${size}px`,
    ...(accent ? { '--poe-circle-frame-accent': accent } : null),
  } as React.CSSProperties;
  return (
    <span className={classes} style={{ ...vars, ...style }} {...props}>
      <span className="poe-circle-frame__ring">
        <span className="poe-circle-frame__inner">
          {src ? <img className="poe-circle-frame__img" src={src} alt={alt} /> : children}
        </span>
      </span>
      {status && <span className="poe-circle-frame__status" data-status={status} aria-label={status} />}
    </span>
  );
}
