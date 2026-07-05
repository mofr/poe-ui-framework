import React from 'react';
import './PoeAvatar.css';

// Circular framed image: a metallic gold ring (CSS baseline; a painterly raster ring is a later manual
// pass) with the portrait clipped inside. With no `src` it renders `children` centred, so it doubles as
// a level orb / circular label. `status` adds the corner presence dot; `glow` lights the inner accent ring.
export type PoeAvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface PoeAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Portrait image URL. Omit to render `children` (initials, a number, an icon…) instead. */
  src?: string;
  alt?: string;
  /** Outer diameter in px (default 96). Ring thickness scales with it. */
  size?: number;
  /** Presence dot in the corner. */
  status?: PoeAvatarStatus;
  /** Light the inner accent ring (portrait sits on a coloured glow, like the reference hero avatar). */
  glow?: boolean;
  /** Accent colour for the inner glow / default status hue (default: --poe-blue). */
  accent?: string;
}

export function PoeAvatar({
  src, alt = '', size = 96, status, glow = false, accent, children, className = '', style, ...props
}: PoeAvatarProps) {
  const classes = ['poe-avatar', glow && 'is-glowing', className].filter(Boolean).join(' ');
  const vars = {
    '--poe-avatar-size': `${size}px`,
    ...(accent ? { '--poe-avatar-accent': accent } : null),
  } as React.CSSProperties;
  return (
    <span className={classes} style={{ ...vars, ...style }} {...props}>
      <span className="poe-avatar__frame">
        <span className="poe-avatar__inner">
          {src ? <img className="poe-avatar__img" src={src} alt={alt} /> : children}
        </span>
      </span>
      {status && <span className="poe-avatar__status" data-status={status} aria-label={status} />}
    </span>
  );
}
