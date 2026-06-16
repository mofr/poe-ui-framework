# Design Handoff — read this first

**Audience:** a design tool/agent (e.g. Claude Design) tasked with raising this project's
**visual fidelity**. This is the entry point. The full product vision is in the root
`README.md`; the visual bar is the four images in `inspiration/`.

## The mission

This is a reusable **dark-fantasy (Path of Exile–style) React + CSS UI component kit**. The
architecture, component split, tokens, and semantic states are in good shape. **The one thing
that is failing is visual fidelity** — the rendered result looks flat and generic next to the
references.

## Be blunt about the current state

Compare these honestly:

- **The bar:** `inspiration/perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg`
  (primary), `warcraft-related.webp`, `not-bad-poe-atlas.webp`, `nice-paper-background.webp`.
  Painted, textured, carved metal & stone, glowing gems, parchment. Rich and physical.
- **Where we are:** `docs/screenshots/01-baseline.png` (before any work) and
  `docs/screenshots/02-current.png` (after a first hand-written-SVG/CSS pass).

The current `02-current.png` is **still far below the bar**, and the reason is fundamental:
the chrome is **hand-authored SVG + CSS** — vector strokes, gradients, box-shadows. That
medium cannot reproduce painterly raster texture (hammered metal, carved stone, gem facets,
parchment grain). The frames read as thin clean outlines, not forged metal. **This is the
ceiling we need help breaking.**

## What we need from you

Raise fidelity to the inspiration bar. The highest-leverage path is **raster assets**:
`docs/asset-handoff.md` is a complete, paste-ready asset brief — exact dimensions, 9-slice
cuts, the real palette hexes, format/transparency rules, per-asset image-gen prompts, and the
**CSS integration hook each asset plugs into**. Generate the Tier 1 assets first (panel frame,
header plaque, stone + metal textures); they carry most of the lift. Match the filenames so
integration is a drop-in.

Work **one component at a time, against a crop of the reference** — not the whole page at once.

## Hard constraints (from README.md — keep these intact)

- **Typography is part of the component API.** Use the shared font tokens and `.poe-text-*`
  role classes (display / heading / label / body / meta / number / rune). Don't introduce
  arbitrary inline fonts.
- **Material variants** on `PoeFrame`: stone / metal / parchment / inset (+ selected / active).
- **Semantic states** must stay consistent: hover, focus, selected, required, blocked, warning,
  danger, disabled, magic, corruption.
- **Data density** matters (crafting tool). Ornament belongs on borders, headers, dividers, and
  selection states; dense tables/rows stay readable. Don't bury data under decoration.
- **Composability** — don't lock the kit into one page layout.
- Add colors/tokens in `poe-tokens.css`, never inline.

## Architecture map (where things live)

```
src/
  styles/
    poe-tokens.css     # design tokens: colors, fonts, shadows, glows, spacing  ← tune palette here
    poe-core.css       # all component CSS + asset-backed ornament layer         ← most visual work lands here
  components/
    layout/            # PoeApp, PoeHeader, ActionBar
    primitives/        # PoeFrame, PoeButton, PoeTabs, PoeTag, PoeBadge, PoeActionTile, PoeSegmentBar
    domain/            # ModifierGroup, ModifierTable, Inspector  (the mod-browser showcase)
    index.js           # barrel export
    sampleData.js      # demo data
  assets/              # original SVG primitives (frames/ icons/ nodes/ decor/ backgrounds/)
                       # ← raster assets from docs/asset-handoff.md replace/augment these
  App.jsx              # the demo: a PoE2 modifier-browser playground
inspiration/           # THE VISUAL BAR
docs/
  asset-handoff.md     # paste-ready raster asset brief (specs + prompts + CSS hooks)
  screenshots/         # current rendered state for comparison
```

## Run it

```
npm install
npm run dev        # vite, serves the App.jsx demo
```

The CSS ornament layer at the bottom of `poe-core.css` already wires SVG assets via
`border-image` (9-slice), `background-image`, and CSS icons — so swapping in richer raster
assets at the same paths is the intended extension point.
