import React from 'react';

// Buttons are RASTER only: the ornate 9-slice frame (buttons/button-ornate.png) + a CSS fill.
// (The old CSS-styled variants/compact/ornate-toggle were removed; those props are accepted and
// ignored so existing callers don't break.)
export interface PoeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  /** @deprecated accepted and ignored (legacy CSS variants were removed) */
  ornate?: boolean;
  /** @deprecated accepted and ignored */
  variant?: string;
  /** @deprecated accepted and ignored */
  compact?: boolean;
}

export function PoeButton({ children, className = '', selected = false, ornate, variant, compact, ...props }: PoeButtonProps) {
  const classes = ['poe-button', 'poe-button--ornate', selected && 'is-selected', className].filter(Boolean).join(' ');
  // type="button" so a PoeButton inside a <form> never submits by accident; callers can override.
  return <button type="button" className={classes} data-selected={selected || undefined} {...props}>{children}</button>;
}
