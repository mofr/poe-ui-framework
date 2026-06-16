import React from 'react';
import { PoeBadge } from '../primitives/PoeBadge.jsx';
import { PoeFrame } from '../primitives/PoeFrame.jsx';
import { PoeTag } from '../primitives/PoeTag.jsx';

export function ModifierTable({ title = 'Prefix', meta = '135 mods', rows = [] }) {
  return (
    <PoeFrame title={title} meta={meta}>
      <table className="poe-table">
        <thead>
          <tr>
            <th>Modifier</th>
            <th>Tiers</th>
            <th>iLvl</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} data-selected={row.state === 'selected' || undefined} data-state={row.state || undefined}>
              <td>
                {row.badge && <PoeBadge type={row.badgeType}>{row.badge}</PoeBadge>} {row.mod}{' '}
                {row.tags?.map((tag) => <PoeTag key={tag} type={tagType(tag)}>{tag}</PoeTag>)}
              </td>
              <td>{row.tiers}</td>
              <td>{row.ilvl}</td>
              <td>{row.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PoeFrame>
  );
}

function tagType(tag) {
  const value = tag.toLowerCase();
  if (value.includes('life')) return 'life';
  if (value.includes('attack') || value.includes('damage')) return 'attack';
  if (value.includes('defence') || value.includes('armour')) return 'defence';
  if (['cold', 'fire', 'lightning', 'elemental'].some((element) => value.includes(element))) return 'elemental';
  if (value.includes('chaos')) return 'chaos';
  return '';
}
