# Framework Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first cohesive high-fidelity foundation slice for the POE-inspired component framework.

**Architecture:** Keep the current React + CSS structure and refine the component library in place. Add visual depth through shared tokens, role-based typography, richer frame/control variants, dense modifier surfaces, and a mod-browser-style showcase that validates the components without becoming framework architecture.

**Tech Stack:** React, Vite, CSS custom properties, SVG assets, lucide-react.

---

## File Structure

- Modify `src/styles/poe-tokens.css`: shared material, typography, state, spacing, border, and glow tokens.
- Modify `src/styles/poe-core.css`: global typography role classes, frame skins, control skins, dense modifier rows, responsive showcase layout, and visual states.
- Modify `src/components/primitives/PoeFrame.jsx`: add reusable variants for material, density, selected, active, and corner ornament.
- Modify `src/components/primitives/PoeButton.jsx`: add reusable button variants and icon-friendly state classes.
- Modify `src/components/primitives/PoeTabs.jsx`: support compact tabs, active selection, counts, and optional icons.
- Modify `src/components/primitives/PoeTag.jsx`: support semantic tag variants and state-safe class composition.
- Modify `src/components/primitives/PoeBadge.jsx`: support semantic badge variants and accessible titles.
- Create `src/components/primitives/PoeActionTile.jsx`: compact icon action slot for crafting/method/action controls.
- Create `src/components/domain/ModifierGroup.jsx`: reusable grouped modifier list surface for dense prefix/suffix sections.
- Modify `src/components/domain/ModifierTable.jsx`: align existing table rows and state attributes with the new dense surface language.
- Modify `src/components/domain/Inspector.jsx`: align selected-modifier details with typography roles and material variants.
- Modify `src/components/sampleData.js`: add richer modifier groups, item-class tabs, and state examples for selected, required, blocked, warning, magic, and corruption.
- Modify `src/components/index.js`: export new primitives/domain components.
- Modify `src/App.jsx`: replace the current generic demo with a mod-browser-style showcase.
- Modify `README.md`: keep framework documentation aligned if implementation changes a documented decision.
- Create `docs/superpowers/reviews/2026-06-16-framework-foundation-visual-review.md`: record the AI visual review against the inspiration images before manual review.

## Task 1: Tokens And Typography Roles

**Files:**
- Modify: `src/styles/poe-tokens.css`
- Modify: `src/styles/poe-core.css`
- Verify: `README.md`

- [ ] **Step 1: Add material, typography, spacing, and state tokens**

Replace the `:root` block in `src/styles/poe-tokens.css` with this expanded token set while keeping the existing font import line:

```css
:root {
  color-scheme: dark;

  --poe-bg-0:#070605;
  --poe-bg-1:#0d0b09;
  --poe-bg-2:#15110e;
  --poe-bg-3:#211913;
  --poe-stone-0:#080807;
  --poe-stone-1:#11100d;
  --poe-stone-2:#1d1914;
  --poe-metal-0:#0b0b0a;
  --poe-metal-1:#171513;
  --poe-metal-2:#2a2219;
  --poe-parchment-0:#2f2418;
  --poe-parchment-1:#d7bd86;
  --poe-parchment-2:#ead7a7;
  --poe-panel:#14110f;
  --poe-panel-2:#1b1612;
  --poe-inset:#080706;

  --poe-gold-1:#6f5127;
  --poe-gold-2:#9a7438;
  --poe-gold-3:#c9a25e;
  --poe-gold-4:#f0d89a;
  --poe-text:#eadcc0;
  --poe-text-soft:#bda277;
  --poe-text-muted:#7b6a51;
  --poe-text-dark:#21170d;
  --poe-red:#d05248;
  --poe-green:#53bf62;
  --poe-blue:#4b8dff;
  --poe-purple:#9b5eff;
  --poe-amber:#efbd4e;
  --poe-danger:#cf312d;
  --poe-corruption:#8f1f2c;
  --poe-magic:#4b8dff;
  --poe-rare:#f0d35a;
  --poe-border:rgba(201,162,94,.65);
  --poe-border-dim:rgba(154,116,56,.35);
  --poe-border-cold:rgba(114,161,255,.55);

  --poe-radius:4px;
  --poe-gap:12px;
  --poe-row-height:34px;
  --poe-control-height:32px;
  --poe-pad-1:6px;
  --poe-pad-2:10px;
  --poe-pad-3:14px;

  --poe-font-display:'IM Fell English SC', Cinzel, Georgia, serif;
  --poe-font-title:Cinzel, 'IM Fell English SC', Georgia, serif;
  --poe-font-ui:Inter, IBM Plex Sans, Segoe UI, Arial, sans-serif;
  --poe-font-number:'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  --poe-font-rune:'JetBrains Mono', Cinzel, ui-monospace, monospace;

  --poe-shadow:0 12px 32px rgba(0,0,0,.45), inset 0 1px rgba(255,231,174,.08), inset 0 -1px rgba(0,0,0,.8);
  --poe-shadow-inset:inset 0 2px 10px rgba(0,0,0,.72), inset 0 1px rgba(255,231,174,.06);
  --poe-shadow-raised:0 10px 20px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.08);
  --poe-glow-gold:0 0 18px rgba(201,162,94,.18);
  --poe-glow-blue:0 0 18px rgba(75,141,255,.22);
  --poe-glow-red:0 0 18px rgba(207,49,45,.2);
}
```

- [ ] **Step 2: Add typography role classes**

In `src/styles/poe-core.css`, keep the existing import at line 1 and replace the current first long rule line with expanded base and typography rules:

```css
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(circle at 50% -20%,#251b12 0,#100d0b 38%,#070605 100%);color:var(--poe-text);font-family:var(--poe-font-ui);font-size:13px;font-feature-settings:"liga" 1,"calt" 1;text-rendering:geometricPrecision}
.poe-app{min-height:100vh;padding:12px;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px);background-size:28px 28px}
.poe-title,.poe-text-display{font-family:var(--poe-font-display);font-weight:400;letter-spacing:.06em;text-transform:none;color:var(--poe-gold-4);text-shadow:0 1px 0 #000,0 0 12px rgba(201,162,94,.25)}
.poe-text-heading,.poe-heading{font-family:var(--poe-font-title);font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--poe-gold-4)}
.poe-text-label,.poe-label{font-family:var(--poe-font-title);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--poe-text-soft)}
.poe-text-body{font-family:var(--poe-font-ui);color:var(--poe-text);line-height:1.45}
.poe-text-meta,.poe-subtle{color:var(--poe-text-muted)}
.poe-text-number,.poe-number{font-family:var(--poe-font-number);font-variant-numeric:tabular-nums;color:var(--poe-gold-4)}
.poe-text-rune{font-family:var(--poe-font-rune);letter-spacing:.08em;text-transform:uppercase;color:var(--poe-blue);text-shadow:0 0 10px rgba(75,141,255,.28)}
.poe-text-warning{color:var(--poe-amber);text-shadow:0 0 10px rgba(239,189,78,.18)}
.poe-text-danger{color:#ff9a8f;text-shadow:0 0 10px rgba(207,49,45,.2)}
```

- [ ] **Step 3: Run build to catch CSS import or syntax errors**

Run: `npm run build`

Expected: Vite finishes successfully and writes `dist/` output.

- [ ] **Step 4: Commit tokens and typography**

```bash
git add src/styles/poe-tokens.css src/styles/poe-core.css
git commit -m "Add foundation tokens and typography roles"
```

## Task 2: Frame Material System

**Files:**
- Modify: `src/components/primitives/PoeFrame.jsx`
- Modify: `src/styles/poe-core.css`
- Verify: `src/components/index.js`

- [ ] **Step 1: Expand `PoeFrame` API**

Replace `src/components/primitives/PoeFrame.jsx` with:

```jsx
import React from 'react';

export function PoeFrame({
  title,
  meta,
  children,
  className = '',
  material = 'stone',
  compact = false,
  selected = false,
  active = false,
  cornered = false,
  as: Component = 'section',
}) {
  const classes = [
    'poe-frame',
    'poe-ornate',
    `poe-frame--${material}`,
    compact && 'poe-frame--compact',
    selected && 'is-selected',
    active && 'is-active',
    cornered && 'poe-cornered',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} data-selected={selected || undefined} data-active={active || undefined}>
      {(title || meta) && (
        <header className="poe-panel-header">
          {title && <span>{title}</span>}
          {meta && <span className="poe-subtle">{meta}</span>}
        </header>
      )}
      <div className="poe-panel-body">{children}</div>
    </Component>
  );
}
```

- [ ] **Step 2: Add frame variants and states**

In `src/styles/poe-core.css`, replace the existing `.poe-frame`, `.poe-panel-header`, and `.poe-panel-body` rules with:

```css
.poe-frame{position:relative;border:1px solid var(--poe-border-dim);border-radius:var(--poe-radius);background:linear-gradient(180deg,rgba(255,231,174,.045),transparent 20%),linear-gradient(180deg,var(--poe-panel-2),var(--poe-panel));box-shadow:var(--poe-shadow);overflow:hidden}
.poe-frame:before{content:"";position:absolute;inset:3px;pointer-events:none;border:1px solid rgba(201,162,94,.18);border-radius:2px;z-index:1}
.poe-frame:after{content:"";position:absolute;inset:-1px;pointer-events:none;background:linear-gradient(90deg,var(--poe-gold-2),transparent 18%,transparent 82%,var(--poe-gold-2));opacity:.25;mix-blend-mode:screen;z-index:1}
.poe-frame--metal{background:linear-gradient(180deg,rgba(255,255,255,.05),transparent 18%),linear-gradient(180deg,var(--poe-metal-2),var(--poe-metal-0));border-color:rgba(177,148,92,.52)}
.poe-frame--stone{background:linear-gradient(180deg,rgba(255,231,174,.045),transparent 20%),linear-gradient(180deg,var(--poe-stone-2),var(--poe-stone-0))}
.poe-frame--parchment{background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.04)),linear-gradient(180deg,var(--poe-parchment-2),var(--poe-parchment-1));color:var(--poe-text-dark);border-color:rgba(111,81,39,.85)}
.poe-frame--parchment .poe-panel-header{color:#f8df9e;background:linear-gradient(180deg,#3a2a18,#1c130c)}
.poe-frame--parchment .poe-panel-body{color:var(--poe-text-dark)}
.poe-frame--inset{background:linear-gradient(180deg,#050403,#100d0b);box-shadow:var(--poe-shadow-inset)}
.poe-frame--compact .poe-panel-header{min-height:26px;padding:5px 9px;font-size:11px}
.poe-frame--compact .poe-panel-body{padding:8px}
.poe-frame.is-selected{border-color:var(--poe-gold-3);box-shadow:var(--poe-shadow),var(--poe-glow-gold)}
.poe-frame.is-active{border-color:var(--poe-border-cold);box-shadow:var(--poe-shadow),var(--poe-glow-blue)}
.poe-panel-header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;min-height:30px;padding:7px 10px;border-bottom:1px solid rgba(201,162,94,.24);background:linear-gradient(180deg,#2a2119,#17120f);font-family:var(--poe-font-title);font-weight:600;letter-spacing:.065em;text-transform:uppercase;color:var(--poe-gold-4)}
.poe-panel-header .poe-subtle{font-family:var(--poe-font-number);font-size:10px;letter-spacing:.02em;text-transform:none}
.poe-panel-body{position:relative;z-index:2;padding:10px}
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 4: Commit frame API and skins**

```bash
git add src/components/primitives/PoeFrame.jsx src/styles/poe-core.css
git commit -m "Add reusable frame material variants"
```

## Task 3: Controls, Tags, Badges, And Action Tiles

**Files:**
- Modify: `src/components/primitives/PoeButton.jsx`
- Modify: `src/components/primitives/PoeTabs.jsx`
- Modify: `src/components/primitives/PoeTag.jsx`
- Modify: `src/components/primitives/PoeBadge.jsx`
- Create: `src/components/primitives/PoeActionTile.jsx`
- Modify: `src/components/index.js`
- Modify: `src/styles/poe-core.css`

- [ ] **Step 1: Expand `PoeButton` API**

Replace `src/components/primitives/PoeButton.jsx` with:

```jsx
import React from 'react';

export function PoeButton({ children, className = '', ornate = false, variant = 'default', compact = false, selected = false, ...props }) {
  const classes = [
    'poe-button',
    ornate && 'poe-button--ornate',
    `poe-button--${variant}`,
    compact && 'poe-button--compact',
    selected && 'is-selected',
    className,
  ].filter(Boolean).join(' ');

  return <button className={classes} data-selected={selected || undefined} {...props}>{children}</button>;
}
```

- [ ] **Step 2: Expand `PoeTabs` API**

Replace `src/components/primitives/PoeTabs.jsx` with:

```jsx
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
```

- [ ] **Step 3: Expand `PoeTag` and `PoeBadge` APIs**

Replace `src/components/primitives/PoeTag.jsx` with:

```jsx
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
```

Replace `src/components/primitives/PoeBadge.jsx` with:

```jsx
import React from 'react';

export function PoeBadge({ children, type = 'corrupt', title, className = '' }) {
  const classes = ['poe-badge', type, className].filter(Boolean).join(' ');
  return <span className={classes} title={title}>{children}</span>;
}
```

- [ ] **Step 4: Add `PoeActionTile`**

Create `src/components/primitives/PoeActionTile.jsx`:

```jsx
import React from 'react';
import { PoeAssetIcon } from '../PoeAssets.jsx';

export function PoeActionTile({ label, hotkey, icon, variant = 'default', selected = false, disabled = false, className = '', ...props }) {
  const classes = ['poe-action-tile', `poe-action-tile--${variant}`, selected && 'is-selected', className].filter(Boolean).join(' ');

  return (
    <button className={classes} type="button" disabled={disabled} data-selected={selected || undefined} {...props}>
      {hotkey && <kbd>{hotkey}</kbd>}
      {icon && <PoeAssetIcon name={icon} size="lg" alt="" />}
      <span>{label}</span>
    </button>
  );
}
```

- [ ] **Step 5: Export `PoeActionTile`**

Add this line to `src/components/index.js` after the `PoeSegmentBar` export:

```js
export * from './primitives/PoeActionTile.jsx';
```

- [ ] **Step 6: Add control CSS**

In `src/styles/poe-core.css`, replace the existing `.poe-button`, `.poe-tabs`, and `.poe-tab` rules with:

```css
.poe-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:var(--poe-control-height);border:1px solid var(--poe-border-dim);border-radius:3px;background:linear-gradient(180deg,#2d241b,#13100d);color:var(--poe-text);padding:7px 10px;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.08);font-family:var(--poe-font-title);font-size:12px;font-weight:600;letter-spacing:.045em;text-transform:uppercase}
.poe-button:hover:not(:disabled){border-color:var(--poe-gold-2);color:var(--poe-gold-4);box-shadow:var(--poe-glow-gold),inset 0 1px rgba(255,255,255,.08)}
.poe-button:active:not(:disabled){transform:translateY(1px)}
.poe-button:disabled{cursor:not-allowed;opacity:.45;filter:saturate(.6)}
.poe-button--compact{min-height:26px;padding:4px 8px;font-size:11px}
.poe-button--primary,.poe-button--magic{border-color:rgba(114,161,255,.45);background:linear-gradient(180deg,#26345a,#111827);color:#dce8ff}
.poe-button--danger,.poe-button--corrupt{border-color:rgba(207,49,45,.5);background:linear-gradient(180deg,#3a1715,#170907);color:#ffc0b8}
.poe-button--ghost{background:rgba(8,7,6,.45);box-shadow:var(--poe-shadow-inset)}
.poe-button.is-selected{border-color:var(--poe-gold-3);box-shadow:var(--poe-glow-gold),inset 0 1px rgba(255,255,255,.08)}
.poe-tabs{display:flex;flex-wrap:wrap;gap:6px}.poe-tabs--compact{gap:4px}
.poe-tab{display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(201,162,94,.25);background:#11100e;color:var(--poe-text-soft);border-radius:999px;padding:4px 9px;font-family:var(--poe-font-title);font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}
.poe-tabs--compact .poe-tab{padding:3px 7px;font-size:10px}
.poe-tab .poe-subtle{font-family:var(--poe-font-number);font-size:10px}
.poe-tab[data-active="true"],.poe-tab[data-active]{border-color:#8ba8ff;background:linear-gradient(180deg,#202849,#101524);color:#cfe0ff;box-shadow:0 0 12px rgba(75,141,255,.22)}
.poe-action-tile{position:relative;display:flex;min-height:72px;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1px solid var(--poe-border-dim);border-radius:5px;background:radial-gradient(circle at 50% 32%,rgba(75,141,255,.18),transparent 28%),linear-gradient(180deg,#2a2119,#0e0c0b);color:var(--poe-text);font-family:var(--poe-font-title);font-size:11px;font-weight:600;letter-spacing:.045em;text-transform:uppercase;box-shadow:var(--poe-shadow-raised);cursor:pointer}
.poe-action-tile kbd{position:absolute;top:4px;left:50%;transform:translateX(-50%);color:var(--poe-text-muted);font-family:var(--poe-font-number);font-size:10px}.poe-action-tile:hover:not(:disabled){border-color:var(--poe-gold-2);box-shadow:var(--poe-glow-blue),var(--poe-shadow-raised)}.poe-action-tile.is-selected{border-color:var(--poe-border-cold);box-shadow:var(--poe-glow-blue),var(--poe-shadow-raised)}.poe-action-tile:disabled{cursor:not-allowed;opacity:.45;filter:saturate(.5)}.poe-action-tile--danger{background:radial-gradient(circle at 50% 32%,rgba(207,49,45,.18),transparent 28%),linear-gradient(180deg,#2a1715,#0e0c0b)}
```

- [ ] **Step 7: Run build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 8: Commit controls and action tile**

```bash
git add src/components/primitives/PoeButton.jsx src/components/primitives/PoeTabs.jsx src/components/primitives/PoeTag.jsx src/components/primitives/PoeBadge.jsx src/components/primitives/PoeActionTile.jsx src/components/index.js src/styles/poe-core.css
git commit -m "Add foundation controls and action tile"
```

## Task 4: Dense Modifier Surfaces

**Files:**
- Create: `src/components/domain/ModifierGroup.jsx`
- Modify: `src/components/domain/ModifierTable.jsx`
- Modify: `src/components/sampleData.js`
- Modify: `src/components/index.js`
- Modify: `src/styles/poe-core.css`

- [ ] **Step 1: Add richer sample data**

Replace `src/components/sampleData.js` with:

```js
export const itemClassTabs = [
  { label: 'STR Armour', count: 550, icon: 'armour' },
  { label: 'DEX Armour', count: 543, icon: 'armour' },
  { label: 'INT Armour', count: 540, icon: 'mana' },
  { label: 'Axes', count: 243, icon: 'attack' },
  { label: 'Rings', count: 240, icon: 'currency' },
  { label: 'Waystones', count: 58, icon: 'waystone' },
];

export const modifierGroups = [
  {
    title: 'Life',
    kind: 'prefix',
    meta: '13 tiers · 13000 weight',
    rows: [
      { mod: '+(10-149) to maximum Life', tiers: 13, ilvl: '1-60', weight: 13000, tags: ['Life'], state: 'selected' },
      { mod: '+(4-6)% increased maximum Life', tiers: 3, ilvl: '35-75', weight: 1800, tags: ['Life', 'Defence'], state: 'required' },
    ],
  },
  {
    title: 'Defences',
    kind: 'prefix',
    meta: '11 tiers · 11000 weight',
    rows: [
      { mod: '+(11-176) to Evasion Rating', tiers: 11, ilvl: '1-54', weight: 11000, tags: ['Armour', 'Defence'] },
      { mod: '+(15-220) to Armour', tiers: 12, ilvl: '1-68', weight: 9500, tags: ['Armour', 'Defence'] },
    ],
  },
  {
    title: 'Elemental Resistance',
    kind: 'suffix',
    meta: '8 tiers · 8000 weight',
    rows: [
      { mod: '+(6-45)% to Fire Resistance', tiers: 8, ilvl: '1-82', weight: 8000, tags: ['Elemental', 'Fire'], state: 'magic' },
      { mod: '+(6-45)% to Cold Resistance', tiers: 8, ilvl: '1-82', weight: 8000, tags: ['Elemental', 'Cold'] },
    ],
  },
  {
    title: 'Corrupted Outcomes',
    kind: 'suffix',
    meta: 'blocked · special',
    rows: [
      { mod: 'Damage Penetrates (10-15)% Cold Resistance', tiers: 1, ilvl: '65', weight: 0, tags: ['Damage', 'Cold'], badge: 'C', badgeType: 'corrupt', state: 'blocked' },
      { mod: 'Cannot roll attack modifiers', tiers: 1, ilvl: '1', weight: 0, tags: ['Craft'], badge: '!', badgeType: 'warning', state: 'warning' },
    ],
  },
];

export const sampleRows = modifierGroups.flatMap((group) => group.rows);
```

- [ ] **Step 2: Create `ModifierGroup`**

Create `src/components/domain/ModifierGroup.jsx`:

```jsx
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
```

- [ ] **Step 3: Align `ModifierTable` with row states**

Update the row element in `src/components/domain/ModifierTable.jsx` from:

```jsx
<tr key={index} data-selected={index === 1 || undefined}>
```

to:

```jsx
<tr key={index} data-selected={row.state === 'selected' || undefined} data-state={row.state || undefined}>
```

- [ ] **Step 4: Export `ModifierGroup`**

Add this line to `src/components/index.js` after the `Inspector` export:

```js
export * from './domain/ModifierGroup.jsx';
```

- [ ] **Step 5: Add dense modifier CSS**

Append this block to `src/styles/poe-core.css`:

```css
.poe-mod-group{box-shadow:var(--poe-shadow-inset)}
.poe-mod-group--prefix .poe-panel-header{border-left:2px solid var(--poe-blue)}
.poe-mod-group--suffix .poe-panel-header{border-left:2px solid var(--poe-purple)}
.poe-mod-list{display:grid;gap:4px}
.poe-mod-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;min-height:var(--poe-row-height);padding:7px 8px;border:1px solid rgba(255,255,255,.055);background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(0,0,0,.08));box-shadow:inset 0 1px rgba(255,255,255,.035)}
.poe-mod-row:hover{border-color:rgba(201,162,94,.32);background:rgba(201,162,94,.075)}
.poe-mod-row[data-state="selected"]{border-color:var(--poe-gold-3);background:rgba(201,162,94,.12);box-shadow:inset 0 0 16px rgba(201,162,94,.08),var(--poe-glow-gold)}
.poe-mod-row[data-state="required"]{border-color:rgba(83,191,98,.55);box-shadow:inset 3px 0 0 var(--poe-green)}
.poe-mod-row[data-state="blocked"]{border-color:rgba(207,49,45,.38);background:rgba(80,16,16,.22);color:rgba(234,220,192,.72)}
.poe-mod-row[data-state="warning"]{border-color:rgba(239,189,78,.45);background:rgba(99,65,13,.16)}
.poe-mod-row[data-state="magic"]{border-color:rgba(75,141,255,.42);box-shadow:inset 0 0 14px rgba(75,141,255,.08)}
.poe-mod-main{display:grid;gap:4px;min-width:0}.poe-mod-name{display:flex;align-items:center;gap:6px;min-width:0}.poe-mod-name span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.poe-mod-tags{display:flex;flex-wrap:wrap;gap:3px}.poe-mod-stats{display:grid;grid-template-columns:repeat(3,minmax(52px,auto));gap:8px;text-align:right}.poe-mod-stats span{display:grid;gap:1px}.poe-mod-stats b{font-family:var(--poe-font-number);font-size:12px;color:var(--poe-gold-4);font-variant-numeric:tabular-nums}.poe-mod-stats small{font-family:var(--poe-font-title);font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--poe-text-muted)}
```

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 7: Commit dense modifier surfaces**

```bash
git add src/components/domain/ModifierGroup.jsx src/components/domain/ModifierTable.jsx src/components/sampleData.js src/components/index.js src/styles/poe-core.css
git commit -m "Add dense modifier group surfaces"
```

## Task 5: Mod-Browser Showcase

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/domain/Inspector.jsx`
- Modify: `src/components/layout/ActionBar.jsx`
- Modify: `src/styles/poe-core.css`

- [ ] **Step 1: Update `Inspector` to use foundation roles**

Replace `src/components/domain/Inspector.jsx` with:

```jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { PoeButton } from '../primitives/PoeButton.jsx';
import { PoeFrame } from '../primitives/PoeFrame.jsx';
import { PoeTag } from '../primitives/PoeTag.jsx';

export function Inspector() {
  const stats = [
    ['Family', 'Base Maximum Life'],
    ['Tier Count', '13'],
    ['Item Level', '1-60'],
    ['Weight', '13000'],
    ['Domains', 'STR Armour'],
  ];

  return (
    <PoeFrame title="Selected Modifier" meta="Inspector" material="metal" active>
      <h2 className="poe-inspector-title">+(70-149) to Maximum Life</h2>
      <p className="poe-text-body poe-inspector-copy">A high-weight life prefix used as the selected state benchmark for dense modifier browsing.</p>
      <div className="poe-tag-row">
        <PoeTag type="life">Life</PoeTag>
        <PoeTag type="defence">Defence</PoeTag>
        <PoeTag type="elemental" state="required">Required</PoeTag>
      </div>
      <div className="poe-stat-stack">
        {stats.map(([label, value]) => (
          <div className="poe-statline" key={label}>
            <span className="poe-text-label">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <PoeButton variant="magic" style={{ marginTop: 12, width: '100%' }}><Sparkles size={15} /> Show related paths</PoeButton>
    </PoeFrame>
  );
}
```

- [ ] **Step 2: Update `ActionBar` to use `PoeActionTile`**

Replace `src/components/layout/ActionBar.jsx` with:

```jsx
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
```

- [ ] **Step 3: Replace `App.jsx` showcase**

Replace `src/App.jsx` with:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ActionBar, Inspector, ModifierGroup, PoeApp, PoeButton, PoeFrame, PoeHeader, PoeTabs, itemClassTabs, modifierGroups } from './components';

function Demo() {
  const prefixGroups = modifierGroups.filter((group) => group.kind === 'prefix');
  const suffixGroups = modifierGroups.filter((group) => group.kind === 'suffix');

  return (
    <PoeApp>
      <PoeHeader title="PoE2 Modifier Browser" subtitle="Framework foundation playground" />
      <PoeFrame title="Item Class Atlas" meta="first foundation slice" material="metal">
        <PoeTabs items={itemClassTabs} active="STR Armour" compact />
      </PoeFrame>
      <div className="poe-mod-browser">
        <aside className="poe-browser-sidebar">
          <PoeFrame title="Spawn Filters" meta="compact" compact>
            <div className="poe-filter-stack">
              <PoeButton compact selected>All Mods</PoeButton>
              <PoeButton compact variant="ghost">Prefixes</PoeButton>
              <PoeButton compact variant="ghost">Suffixes</PoeButton>
              <PoeButton compact variant="danger">Blocked</PoeButton>
            </div>
          </PoeFrame>
          <PoeFrame title="Rules" meta="warning" material="inset" compact>
            <p className="poe-text-warning">Blocked rows remain visible so density and exclusion states can be reviewed together.</p>
          </PoeFrame>
        </aside>
        <main className="poe-mod-columns">
          <section className="poe-affix-column">
            <PoeFrame title="Prefixes" meta={`${prefixGroups.length} groups`} material="stone" selected>
              <div className="poe-group-stack">
                {prefixGroups.map((group) => <ModifierGroup key={group.title} {...group} />)}
              </div>
            </PoeFrame>
          </section>
          <section className="poe-affix-column">
            <PoeFrame title="Suffixes" meta={`${suffixGroups.length} groups`} material="stone">
              <div className="poe-group-stack">
                {suffixGroups.map((group) => <ModifierGroup key={group.title} {...group} />)}
              </div>
            </PoeFrame>
          </section>
        </main>
        <aside className="poe-browser-inspector">
          <Inspector />
        </aside>
      </div>
      <ActionBar />
    </PoeApp>
  );
}

createRoot(document.getElementById('root')).render(<Demo />);
```

- [ ] **Step 4: Add showcase layout CSS**

Append this block to `src/styles/poe-core.css`:

```css
.poe-mod-browser{display:grid;grid-template-columns:240px minmax(560px,1fr) 320px;gap:12px;margin-top:12px;align-items:start}.poe-browser-sidebar,.poe-browser-inspector,.poe-group-stack{display:grid;gap:12px}.poe-mod-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.poe-affix-column{min-width:0}.poe-filter-stack{display:flex;flex-wrap:wrap;gap:6px}.poe-inspector-copy{margin:0 0 10px}.poe-tag-row{display:flex;flex-wrap:wrap;gap:5px}.poe-stat-stack{margin-top:12px}@media(max-width:1100px){.poe-mod-browser{grid-template-columns:220px minmax(0,1fr)}.poe-browser-inspector{grid-column:1 / -1}.poe-mod-columns{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.poe-mod-browser{grid-template-columns:1fr}.poe-mod-columns{grid-template-columns:1fr}.poe-kbdbar{grid-template-columns:repeat(5,1fr)}}
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 6: Commit showcase**

```bash
git add src/App.jsx src/components/domain/Inspector.jsx src/components/layout/ActionBar.jsx src/styles/poe-core.css
git commit -m "Add mod browser foundation showcase"
```

## Task 6: Documentation And AI Visual Review

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/reviews/2026-06-16-framework-foundation-visual-review.md`

- [ ] **Step 1: Check README against implementation**

Read `README.md` sections `Framework Foundation Direction`, `Typography Direction`, and `Visual Review Bar`. If implementation introduced a changed component name or changed first-milestone scope, update only those lines so README remains accurate.

- [ ] **Step 2: Write the visual review artifact**

Create `docs/superpowers/reviews/2026-06-16-framework-foundation-visual-review.md` with this structure and fill each verdict from the implemented UI:

```markdown
# Framework Foundation Visual Review

## References Checked

- `inspiration/perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg`
- `inspiration/warcraft-related.webp`
- `inspiration/nice-paper-background.webp`
- `inspiration/not-bad-poe-atlas.webp`

## Verdict

The first foundation slice is ready for user review when the UI shows cohesive frame depth, distinct typography roles, readable dense modifier rows, semantic state glow, and integrated icon/action treatments.

## Findings

- Border depth: record whether panels look carved/raised/inset rather than flat CSS boxes.
- Typography hierarchy: record whether display, panel heading, body, label, numeric, and rune roles are visually distinct.
- Typography readability: record whether fantasy type is limited to identity and plaque roles while dense rows stay readable.
- Numeric treatment: record whether tiers, item levels, weights, counts, and hotkeys use tabular alignment.
- Parchment restraint: record whether parchment appears only where readability benefits.
- Semantic glow: record whether glow communicates selected, active, magic, danger, or warning states.
- Dense-row readability: record whether modifier names, tags, and stats are scannable at a glance.
- Asset integration: record whether icons and action tiles feel integrated with frames and typography.
- Overall cohesion: record whether the result feels like one component library.

## Required Iterations Before User Review

- If any finding is below the bar, list the concrete component or CSS selector to improve.
- If all findings are acceptable, write: `No required iterations before user review.`
```

- [ ] **Step 3: Run final build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 4: Commit docs and visual review**

```bash
git add README.md docs/superpowers/reviews/2026-06-16-framework-foundation-visual-review.md
git commit -m "Document foundation visual review"
```

## Task 7: Final Verification Handoff

**Files:**
- Inspect: all modified files from Tasks 1-6

- [ ] **Step 1: Check worktree status**

Run: `git status --short`

Expected: no uncommitted files, or only intentionally uncommitted files that are named in the handoff.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 3: Inspect recent commits**

Run: `git log --oneline -8`

Expected: commits from the implementation tasks appear in order after `Document framework foundation design`.

- [ ] **Step 4: Handoff summary**

Report:

```markdown
Implemented the first framework foundation slice.

Changed:
- Tokens and typography roles.
- Frame material variants.
- Buttons, tabs, tags, badges, and action tiles.
- Dense modifier group surfaces.
- Mod-browser-style showcase.
- Visual review artifact.

Verification:
- `npm run build` passed.
- Visual review recorded in `docs/superpowers/reviews/2026-06-16-framework-foundation-visual-review.md`.
```

## Plan Self-Review

- Spec coverage: tasks cover tokens, typography, font-swappable roles, frame/control/tag/dense row components, mod-browser playground, README upkeep, build verification, and AI visual review.
- Scope check: this is one cohesive foundation slice; input component and full application layout are deliberately out of scope.
- Placeholder scan: no unfinished-marker words or undefined component names are used in implementation steps.
- Type consistency: component props introduced in earlier tasks match later showcase usage: `material`, `compact`, `selected`, `active`, `variant`, `items`, `active`, `icon`, and `state`.
