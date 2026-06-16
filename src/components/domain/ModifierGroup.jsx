import React from 'react';
import { PoeBadge } from '../primitives/PoeBadge.jsx';
import { PoeFrame } from '../primitives/PoeFrame.jsx';
import { PoeTag } from '../primitives/PoeTag.jsx';

export function ModifierGroup({ title, kind = 'prefix', meta, rows = [] }) {
  return (
    <PoeFrame title={title} meta={meta} compact material="inset" className={`poe-mod-group poe-mod-group--${kind}`}>
      <div className="poe-mod-list">
        {rows.map((row) => <ModifierRow key={`${row.mod}-${row.ilvl}`} row={row} />)}
      </div>
    </PoeFrame>
  );
}

function ModifierRow({ row }) {
  return (
    <article className="poe-mod-row" data-state={row.state || undefined}>
      <div className="poe-mod-main">
        <div className="poe-mod-name">
          {row.badge && <PoeBadge type={row.badgeType}>{row.badge}</PoeBadge>}
          <span>{row.mod}</span>
        </div>
        <div className="poe-mod-tags">
          {row.tags?.map((tag) => <PoeTag key={tag} type={tagType(tag)}>{tag}</PoeTag>)}
        </div>
      </div>
      <div className="poe-mod-stats">
        <span><b>{row.tiers}</b><small>tiers</small></span>
        <span><b>{row.ilvl}</b><small>ilvl</small></span>
        <span><b>{row.weight}</b><small>weight</small></span>
      </div>
    </article>
  );
}

function tagType(tag) {
  const value = tag.toLowerCase();
  if (value.includes('life')) return 'life';
  if (value.includes('attack') || value.includes('damage') || value.includes('craft')) return 'attack';
  if (value.includes('defence') || value.includes('armour')) return 'defence';
  if (['cold', 'fire', 'lightning', 'elemental'].some((element) => value.includes(element))) return 'elemental';
  if (value.includes('chaos')) return 'chaos';
  return '';
}
