import React from 'react';
import { PoeAssetIcon } from '../PoeAssets.jsx';

export function PoeActionTile({ label, hotkey, icon, variant = 'default', selected = false, disabled = false, className = '', ...props }) {
  const classes = ['poe-action-tile', `poe-action-tile--${variant}`, selected && 'is-selected', className].filter(Boolean).join(' ');

  return (
    <button className={classes} type="button" disabled={disabled} data-selected={selected || undefined} {...props}>
      {hotkey && <kbd>{hotkey}</kbd>}
      {icon && <PoeAssetIcon name={icon} size="lg" alt="" />}
      <span>{label}</span>
    </button>
  );
}
