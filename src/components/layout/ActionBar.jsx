import React from 'react';
import { PoeActionTile } from '../primitives/PoeActionTile.jsx';

export function ActionBar() {
  const actions = [
    ['Search', 'search'],
    ['Prefixes', 'prefix'],
    ['Suffixes', 'suffix'],
    ['Craft', 'craft'],
    ['Sim', 'simulate'],
    ['Filter', 'filter'],
    ['Pin', 'pin'],
    ['Export', 'export'],
    ['Atlas', 'atlas'],
    ['Settings', 'settings'],
  ];

  return (
    <nav className="poe-kbdbar">
      {actions.map(([label, icon], index) => (
        <PoeActionTile key={label} label={label} icon={icon} hotkey={(index + 1) % 10} selected={index === 1} />
      ))}
    </nav>
  );
}
