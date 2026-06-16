import React from 'react';
import { Settings } from 'lucide-react';
import { PoeButton } from '../primitives/PoeButton.jsx';

export function PoeHeader({ title = 'PoE2 Modifier Browser', subtitle = 'Arcane Cartographer UI' }) {
  return (
    <header className="poe-frame poe-header">
      <div>
        <h1 className="poe-title" style={{ margin: 0, fontSize: 22 }}>{title}</h1>
        <div className="poe-subtle">{subtitle}</div>
      </div>
      <div style={{ flex: 1 }}>
        <input className="poe-search poe-search--ornate" placeholder="Search modifiers, tags, item classes..." />
      </div>
      <PoeButton ornate><Settings size={15} /> Settings</PoeButton>
    </header>
  );
}
