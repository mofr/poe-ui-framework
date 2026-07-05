import React from 'react';
import './PoeTab.css';

// Nav / tab button: a gold-framed plate with an optional leading icon + label. `selected` switches it to
// the magic-blue state (glow + blue border/text), matching the reference's active nav tab. Compose a row
// of these inside <PoeTabBar> for the shared baseline rail.
export interface PoeTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading glyph (a lucide icon, rune, etc.). */
  icon?: React.ReactNode;
  /** Active tab — blue glow + blue text/icon. Drives `aria-selected`. */
  selected?: boolean;
}

export function PoeTab({ children, icon, selected = false, className = '', ...props }: PoeTabProps) {
  const classes = ['poe-tab', selected && 'is-selected', className].filter(Boolean).join(' ');
  return (
    <button type="button" role="tab" aria-selected={selected} className={classes} {...props}>
      {icon != null && <span className="poe-tab__icon">{icon}</span>}
      <span className="poe-tab__label">{children}</span>
    </button>
  );
}

// Thin tablist wrapper owning the shared baseline rail; tabs flow as a flex row.
export interface PoeTabBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PoeTabBar({ children, className = '', ...props }: PoeTabBarProps) {
  return (
    <div role="tablist" className={`poe-tab-bar ${className}`.trim()} {...props}>{children}</div>
  );
}
