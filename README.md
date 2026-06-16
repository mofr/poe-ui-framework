# PoE UI Framework

A maintainable React + CSS starter kit for a dense Path-of-Exile-inspired knowledge app.

## Vision

This project is a reusable fantasy UI component kit for Path-of-Exile-like tooling. The goal is not to clone a fixed product layout, GitHub layout, or generic dashboard shell. The final application layout may change drastically, so the framework should prioritize strong reusable primitives over app-specific structure.

The visual direction should feel like a serious dark fantasy crafting interface: ornate, dense, readable, textured, and interactive. The current implementation is intentionally minimal, but future work should push it toward richer framed panels, better typography, stronger iconography, parchment and metal surface variants, glowing state treatments, and more game-like affordances.

Typography is a first-class part of the design. Headings, labels, buttons, table text, numbers, and small metadata should not all feel the same. Use fantasy serif or small-caps display fonts for titles and plaques, readable UI fonts for controls and dense data, and distinct numeric treatment where values matter. Font choices should make the interface feel crafted, not like a default web app with themed colors.

## First Demo Milestone

The first meaningful demo app should replicate the important interaction and information structure of Craft of Exile for PoE 2, using our own beautiful component system:

https://www.craftofexile.com/?game=poe2&b=41&ob=both&v=d&a=x&l=a&lg=20&bp=y&as=1&hb=0&bld={}&im={}&ggt=|&ccp={}&gvc={%22limit%22:88}&gns={}

This does not mean copying Craft of Exile visually. It means building a comparable crafting/modifier exploration experience with a stronger fantasy RPG interface.

Important demo capabilities:

- Select game, item base, item level, influence/context, and crafting options.
- Browse prefixes and suffixes with tiers, weights, tags, item-level requirements, and modifier families.
- Filter/search modifiers quickly without losing data density.
- Inspect a selected modifier or group in detail.
- Show related crafting information, probabilities, weights, constraints, or paths where useful.
- Present dense tables and controls in an ornate but readable way.
- Demonstrate the component kit across real UI pressure, not just isolated cards.

## Product Direction

Build a component kit first, not a final application shell.

Prioritize:

- reusable frames, panels, buttons, inputs, tabs, lists, tables, badges, tags, stat cards, progress bars, and action slots;
- visual variants such as stone, metal, parchment, inset, magic, danger, selected, active, disabled, and compact;
- typography tokens and font hierarchy;
- state richness for hover, focus, active, selected, warning, success, corruption, and magic states;
- data density suitable for crafting tools;
- composability, so future layouts can change without rewriting the whole UI;
- minimal adaptive resilience so the demo does not break badly on narrower screens.

Deprioritize for now:

- perfect mobile design;
- complex responsive navigation;
- a polished final dashboard layout;
- GitHub-specific structures;
- layout assumptions that only fit one app.

Responsiveness should be possible but lightweight. Prefer panels that can stack, tables that can scroll horizontally, controls that can wrap, and CSS such as `minmax()`, `clamp()`, and a few media queries. Do not spend major effort on mobile-first redesign until the component vocabulary is stronger.

## Visual References

The `inspiration/` directory contains the current visual targets.

- `perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg` — strongest reference for dense framed UI, hotkey actions, glowing meters, lists, buttons, and compact fantasy dashboard treatment.
- `warcraft-related.webp` — useful for portrait/profile-like panels, achievement rows, heavy dark framing, and heroic fantasy atmosphere.
- `nice-paper-background.webp` — useful for parchment content, readable table surfaces, and code/readme-like content areas.
- `not-bad-poe-atlas.webp` — useful for atlas motifs, constellation backgrounds, large ornate search, and decorative call-to-action panels.

Use these as inspiration, not as strict layout targets.

## Component Organization

`PoeUI.jsx` should be split as the component kit grows. Prefer small focused files with a barrel export rather than one large mixed component file.

Suggested direction:

```txt
src/components/
  layout/
    PoeApp.jsx
    PoeHeader.jsx
    ActionBar.jsx
  primitives/
    PoeFrame.jsx
    PoeButton.jsx
    PoeInput.jsx
    PoeTabs.jsx
    PoeTag.jsx
    PoeBadge.jsx
    PoeList.jsx
    PoeProgressBar.jsx
    PoeStatCard.jsx
  domain/
    ModifierTable.jsx
    ModifierInspector.jsx
    CraftingControls.jsx
  PoeAssets.jsx
  sampleData.js
  index.js
```

This structure is a guide, not a hard rule. Keep related tiny components together when splitting them would add noise.

## Structure

- `src/styles/poe-tokens.css` — design tokens: colors, shadows, fonts, spacing.
- `src/styles/poe-core.css` — reusable CSS classes and component skin.
- `src/components/PoeUI.jsx` — small composable React components.
- `src/components/PoeAssets.jsx` — asset registry and helper components.
- `src/assets/` — original SVG UI assets: frames, icons, nodes, backgrounds, dividers.
- `src/App.jsx` — demo layout.

## Usage

```bash
npm install
npm run dev
```

Import the CSS once:

```js
import './styles/poe-core.css';
```

Use components:

```jsx
<PoeFrame title="Prefix" meta="135 mods">...</PoeFrame>
<PoeTag type="life">Life</PoeTag>
<PoeAssetIcon name="corruption" />
<PoeDivider />
```

## Asset strategy

The assets are intentionally small, crisp SVG primitives rather than huge illustrations. They are meant to be reused by a blind LLM as a visual vocabulary:

- frame SVGs for panels, buttons, inputs, and skill slots;
- semantic glyphs for modifier tags and actions;
- passive-tree / atlas nodes for graph-like features;
- repeatable dark surfaces and grid overlays;
- low-frequency dividers and corner ornaments.

See `src/assets/ASSETS.md` and `src/assets/manifest.json`.

## Extension Rules

1. Keep utility-first data density: ornament belongs in borders, headers, dividers, and selection states.
2. Add new colors in `poe-tokens.css`, not inline.
3. Add new components by composing `PoeFrame`, `PoeTag`, `poe-table`, and `poe-button` first.
4. Avoid large decorative images in data-heavy panels.
5. Use `PoeAssetPaths` from `PoeAssets.jsx` instead of hardcoding asset paths across components.
6. Treat typography as part of the component API; add font tokens and text styles deliberately.
7. Avoid locking the framework into one demo layout. Build components that can support the Craft of Exile-style milestone and later application layouts.
