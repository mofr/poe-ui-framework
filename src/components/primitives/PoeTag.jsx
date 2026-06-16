import React from 'react';
import { PoeAssetIcon } from '../PoeAssets.jsx';

const iconAliases = { defence: 'armour', fire: 'elemental', cold: 'elemental', lightning: 'elemental', damage: 'attack' };

export function PoeTag({ children, type = '', state = '', icon, className = '' }) {
  const iconName = icon || iconAliases[type] || type;
  const classes = ['poe-tag', type, state && `is-${state}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {iconName && <PoeAssetIcon name={iconName} alt="" />}
      {children}
    </span>
  );
}
