import React from 'react';
import { usePoeTabBar } from './PoeTabBar';
import './PoeTab.css';

// Nav / tab button: a gold-framed plate with an optional leading icon + label. It reads its active
// state from the enclosing <PoeTabBar> (whose `selected` matches this tab's `name`), switching to the
// magic-blue state (glow + blue border/text), and reports clicks up via the bar's `onSelect`.
export interface PoeTabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'name'> {
  /** Stable identifier; the tab is active when it equals the bar's `selected`. Drives `onSelect`. */
  name: string;
  /** Leading glyph (a lucide icon, rune, etc.). */
  icon?: React.ReactNode;
}

export function PoeTab({ name, children, icon, className = '', onClick, ...props }: PoeTabProps) {
  const bar = usePoeTabBar();
  const selected = bar?.selected === name;
  const classes = ['poe-tab', selected && 'is-selected', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={classes}
      onClick={(e) => { onClick?.(e); bar?.onSelect?.(name); }}
      {...props}
    >
      {icon != null && <span className="poe-tab__icon">{icon}</span>}
      <span className="poe-tab__label">{children}</span>
    </button>
  );
}
