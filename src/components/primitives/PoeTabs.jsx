import React from 'react';
import { PoeAssetIcon } from '../PoeAssets.jsx';

export function PoeTabs({ items, active, compact = false, onSelect }) {
  return (
    <div className={`poe-tabs ${compact ? 'poe-tabs--compact' : ''}`} role="tablist">
      {items.map((item) => {
        const isActive = item.label === active;
        return (
          <button
            key={item.label}
            className="poe-tab"
            data-active={isActive || undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(item)}
          >
            {item.icon && <PoeAssetIcon name={item.icon} alt="" />}
            <span>{item.label}</span>
            {item.count !== undefined && <span className="poe-subtle">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
