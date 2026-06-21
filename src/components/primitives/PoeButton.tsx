import React from 'react';

// Buttons are RASTER plates: a 9-slice frame + CSS fill, picked by `variant`. `ornate` is the one
// implemented variant today (buttons/ornate.png → .poe-button--ornate); more can be added later.
export type PoeButtonVariant = 'ornate';

export interface PoeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Which raster plate to use (default 'ornate'). */
  variant?: PoeButtonVariant;
  /** Selected state — brightens the plate and exposes an `is-selected` class + `data-selected` hook. */
  selected?: boolean;
}

export function PoeButton({ children, className = '', variant = 'ornate', selected = false, ...props }: PoeButtonProps) {
  const classes = ['poe-button', `poe-button--${variant}`, selected && 'is-selected', className].filter(Boolean).join(' ');
  // type="button" so a PoeButton inside a <form> never submits by accident; callers can override.
  return <button type="button" className={classes} data-selected={selected || undefined} {...props}>{children}</button>;
}
