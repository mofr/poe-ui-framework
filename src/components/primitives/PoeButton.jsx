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

  return <button className={classes} data-selected={selected || undefined} {...props}>{children}</button>;
}
