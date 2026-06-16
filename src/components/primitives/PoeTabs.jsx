import React from 'react';

export function PoeTabs({ items, active }) {
  return (
    <div className="poe-tabs">
      {items.map((item) => (
        <button key={item.label} className="poe-tab" data-active={item.label === active}>
          {item.label} <span className="poe-subtle">{item.count}</span>
        </button>
      ))}
    </div>
  );
}
