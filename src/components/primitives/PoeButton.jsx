import React from 'react';

export function PoeButton({ children, className = '', ornate = false, variant = 'default', compact = false, selected = false, ...props }) {
  const classes = [
    'poe-button',
    ornate && 'poe-button--ornate',
    `poe-button--${variant}`,
    compact && 'poe-button--compact',
    selected && 'is-selected',
    className,
  ].filter(Boolean).join(' ');

  // Default to type="button" so a PoeButton inside a <form> never submits by accident;
  // callers can still override via props (e.g. type="submit").
  return <button type="button" className={classes} data-selected={selected || undefined} {...props}>{children}</button>;
}
