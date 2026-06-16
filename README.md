# PoE UI Framework

A maintainable React + CSS starter kit for a dense Path-of-Exile-inspired knowledge app.

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
