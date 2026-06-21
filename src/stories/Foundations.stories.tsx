import React from 'react';
import { Stack, Caption } from './_layout.tsx';

export default { title: 'Foundations/Overview', parameters: { layout: 'fullscreen' } };

/* ---- Typography ---- */
const ROLES = [
  ['poe-text-display', 'Display — fantasy identity', 'Wraeclast Cartographer'],
  ['poe-text-heading', 'Heading — panel plaques', 'Prefix Modifiers'],
  ['poe-text-label', 'Label — captions & categories', 'Item Level'],
  ['poe-text-body', 'Body — dense readable rows', 'A high-weight life prefix used as the benchmark for dense modifier browsing.'],
  ['poe-text-meta', 'Meta — subordinate counts', '135 mods · 13 tiers'],
  ['poe-text-number', 'Number — tiers, ilvl, weights', '+(70-149)  ·  13000  ·  i60'],
  ['poe-text-rune', 'Rune — sockets, hotkeys, magic', 'LINKED · Q W E R'],
];

export const Typography = {
  render: () => (
    <Stack gap={16}>
      {ROLES.map(([cls, desc, sample]) => (
        <div key={cls}>
          <Caption>{desc} · .{cls}</Caption>
          <div className={cls} style={{ fontSize: cls === 'poe-text-display' ? 30 : cls === 'poe-text-body' ? 14 : 18 }}>{sample}</div>
        </div>
      ))}
    </Stack>
  ),
};

/* ---- Inputs ---- */
export const Inputs = {
  render: () => (
    <Stack gap={20}>
      <div style={{ maxWidth: 520 }}>
        <Caption>Large input — ornate 9-slice frame (inputs/frame.png) · .poe-input--ornate</Caption>
        <input className="poe-input poe-input--ornate" placeholder="Search or jump to..." />
      </div>
      <div style={{ maxWidth: 520 }}>
        <Caption>Plain input · .poe-input</Caption>
        <input className="poe-input" placeholder="Search modifiers, tags, item classes..." />
      </div>
    </Stack>
  ),
};
