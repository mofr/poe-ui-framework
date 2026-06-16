import React from 'react';
import { Grid, Stack, Row, Caption } from './_layout.jsx';
import { PoeAssetPaths, PoeAssetIcon, PoeNodePreview } from '../components';

export default { title: 'Foundations/Overview', parameters: { layout: 'fullscreen' } };

/* ---- Colors ---- */
const SWATCHES = {
  Surfaces: ['--poe-bg-1', '--poe-bg-2', '--poe-bg-3', '--poe-stone-1', '--poe-stone-2', '--poe-metal-1', '--poe-metal-2', '--poe-panel', '--poe-panel-2', '--poe-inset'],
  Parchment: ['--poe-parchment-0', '--poe-parchment-1', '--poe-parchment-2'],
  Gold: ['--poe-gold-1', '--poe-gold-2', '--poe-gold-3', '--poe-gold-4'],
  Text: ['--poe-text', '--poe-text-soft', '--poe-text-muted', '--poe-text-dark'],
  Accents: ['--poe-red', '--poe-green', '--poe-blue', '--poe-purple', '--poe-amber', '--poe-danger', '--poe-corruption', '--poe-rare'],
};

const Swatch = ({ token }) => (
  <div>
    <div style={{ height: 56, borderRadius: 4, background: `var(${token})`, border: '1px solid rgba(255,255,255,.12)', boxShadow: 'inset 0 1px rgba(255,255,255,.12)' }} />
    <Caption>{token.replace('--poe-', '')}</Caption>
  </div>
);

export const Colors = {
  render: () => (
    <Stack gap={20}>
      {Object.entries(SWATCHES).map(([group, tokens]) => (
        <section key={group}>
          <div className="poe-text-heading" style={{ marginBottom: 8 }}>{group}</div>
          <Grid min={120}>{tokens.map((t) => <Swatch key={t} token={t} />)}</Grid>
        </section>
      ))}
    </Stack>
  ),
};

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

/* ---- Iconography ---- */
export const Iconography = {
  render: () => (
    <Stack gap={20}>
      <section>
        <div className="poe-text-heading" style={{ marginBottom: 8 }}>Icons</div>
        <Grid min={92}>
          {Object.keys(PoeAssetPaths.icons).map((name) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <PoeAssetIcon name={name} size="lg" />
              <Caption>{name}</Caption>
            </div>
          ))}
        </Grid>
      </section>
      <section>
        <div className="poe-text-heading" style={{ marginBottom: 8 }}>Passive / Atlas nodes</div>
        <PoeNodePreview />
      </section>

    </Stack>
  ),
};
