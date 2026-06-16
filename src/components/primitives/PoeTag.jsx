import React from 'react';
import { PoeAssetIcon } from '../PoeAssets.jsx';

export function PoeTag({ children, type = '' }) {
  return (
    <span className={`poe-tag ${type}`}>
      {type && <PoeAssetIcon name={type === 'defence' ? 'armour' : type} alt="" />}
      {children}
    </span>
  );
}
