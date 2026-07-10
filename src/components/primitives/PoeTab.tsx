import React from 'react';
import { usePoeTabBar } from './PoeTabBar';
import './PoeTab.css';

// Nav / tab button: a gold-framed plate with an optional leading icon + label. It reads its active
// state from the enclosing <PoeTabBar> (whose `selected` matches this tab's `name`), switching to the
// magic-blue state (glow + blue border/text), and reports clicks up via the bar's `onSelect`.
export type TabFrame = 'normal-1' | 'normal-2';

const FRAMES: TabFrame[] = ['normal-1', 'normal-2'];
// The plate variants differ only at noise level, so an unset `frame` derives a stable pick from the
// tab's `name` — a bar gets organic variety with zero config. Pass `frame` to pin one.
function pickFrame(name: string): TabFrame {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return FRAMES[Math.abs(h) % FRAMES.length];
}

export interface PoeTabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'name'> {
  /** Stable identifier; the tab is active when it equals the bar's `selected`. Drives `onSelect`. */
  name: string;
  /** Leading glyph (a lucide icon, rune, etc.). */
  icon?: React.ReactNode;
  /** Traced frame raster variant — same plate family, noise-level art differences. Default: a stable pick from `name`. */
  frame?: TabFrame;
}

export function PoeTab({ name, children, icon, frame, className = '', onClick, ...props }: PoeTabProps) {
  const bar = usePoeTabBar();
  const selected = bar?.selected === name;
  const classes = ['poe-tab', selected && 'is-selected', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-frame={frame ?? pickFrame(name)}
      className={classes}
      onClick={(e) => { onClick?.(e); bar?.onSelect?.(name); }}
      {...props}
    >
      {icon != null && <span className="poe-tab__icon">{icon}</span>}
      <span className="poe-tab__label">{children}</span>
      {selected && <span className="poe-tab__glow" aria-hidden="true" />}
    </button>
  );
}
