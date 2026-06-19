# PoE UI Framework — Development Guide

Authoritative guide for continuing this project. Read this first.

> **STATUS (2026-06-19): reference-style fidelity is NOT yet reached — work in progress.**
> The technical pipeline (transparency, 9-slice, layered CSS) works; the open problem is matching
> the reference's *feel* at native scale. **`docs/FRAME-FIDELITY.md` is the source of truth** for
> the fidelity plan, the methods ledger, and the current state — read it before touching art.
> Hard rule (see that doc): **the user judges fidelity; Claude never declares an asset
> "reference-grade".** Present candidates rendered at UI scale beside the reference and let the
> user rate them. The asset commands below are how art is *produced*; whether a given output
> clears the bar is always the user's call.

### Frame prompt levers (for `gpt-image-1.5` generation)
Generic API attempts give thin gold picture-frames. Three prompt levers steer it toward the grim,
material look (they make outputs *plausible*, not automatically good — the user still rates them):
1. **Material over ornament** — "THICK heavy near-black DARK-IRON border, NOT a thin painting
   frame"; name the carved gold *inlay* as secondary.
2. **Grim, desaturated palette** — "cold near-BLACK gunmetal grey (NOT warm brown/bronze), muted
   TARNISHED gold (NOT bright shiny brass)".
3. **Explicit corner features** — "raised gold boss set with a faceted glowing BLUE GEMSTONE at
   each of the four corners".
Keep "CENTER COMPLETELY HOLLOW + fully transparent" and "isolated, head-on orthographic, no
scene/shadow/text". The reference crop (`inspiration/crops/panel.png`) is still passed via the
edits endpoint. Winning prompts live in `tools/asset-prompts.json`.

## What this is
A dark-fantasy (Path of Exile–style) React + CSS UI kit whose visual fidelity comes from
**generated raster art**, not hand-drawn SVG/CSS. **Storybook is the review surface**
(`npm run storybook`, port 6006). `src/App.jsx` was intentionally removed.

## Asset pipeline (the core workflow)
**Preferred (self-serve API):** `node tools/gen-assets.mjs <name> [--tag=X --force]` →
`gpt-image-1.5` with the reference crop + the material-forward prompt returns a clean RGBA asset
straight into `assets-staging/<name>.png` (no desheet step — alpha is already real). Then jump to
step 2 below (`process-assets`) to trim + measure the 9-slice. Iterate the prompt in
`tools/asset-prompts.json`, regenerate with a `--tag` to A/B, then promote the winner by copying
it to `assets-staging/<name>.png`.

> NOTE: `PoePanel` consumes a **whole frame PNG via `border-image`** (9-slice), so the pipeline
> stops at `process-assets` for it — no per-sprite decomposition step.

**Alternative (hand-authored sheets from the ChatGPT app):** when you want to draw/curate art by
hand, export each asset on a **pure magenta `#ff00ff` background** (single frame or a sheet) and
recover alpha with `desheet.mjs`:

1. `node tools/desheet.mjs <image> <tag>` — auto-detects magenta vs the old checkerboard.
   Magenta uses a **soft-alpha chroma key + despill** (fractional alpha on anti-aliased edges,
   pull R,B toward G) → artifact-free transparency even on thin frames. Then connected-component
   slices the image into `assets-staging/sliced/<tag>-NN.png`.
2. Pick a piece → `cp` it to `assets-staging/<name>.png`; add `<name>` (category `frames` or
   `buttons`) to `tools/asset-prompts.json`; `node tools/process-assets.mjs <name>` → trims the
   margin, writes `src/assets/<cat>/<name>.png`, and **prints** the measured 9-slice inset.
   Copy that inset into the frame's `data-frame` rule in `poe-panel.css` (`--slice`/`--band`) —
   the CSS is the single source of truth for slice geometry.

Staging dirs (`assets-staging/`, `.env`, `.shot.mjs`) are gitignored. Magenta > checkerboard.

## Panel CSS model — `PoePanel` (`src/components/primitives/PoePanel.tsx`, `src/styles/poe-panel.css`)
The live framed-surface component is **`PoePanel`** — a *layered* panel, NOT one baked image.
(The earlier sprite-composed `PoeFrame` / `.poe-frame--ornate2/3` system and its
`PoeFrame.stories.jsx` were removed; if you read references to them in old notes, they are
historical.) The full layer contract lives in **`docs/FRAME-FIDELITY.md` → "LOCKED LAYER
ARCHITECTURE"**; the short version:

- The **panel** is the whole component; the **frame** is just one layer. Layout is only the box
  (size + padding + margin); every visual layer is decoration (`position:absolute; inset:0`,
  out of flow), so panels compose over varying content/backgrounds.
- Layers (back→front): `__surface` (interior fill) → `__recess` (inner shadow seating the
  surface) → `__shadow` + `__specular` (integration — blend the frame into the page) →
  `__content` (children) → `__art` (the frame) → `__accent--{t,r,b,l}` (per-edge medallions).
- The frame is a `border-image` 9-slice at NATIVE slice (corners pixel-exact, no scaling). The
  surface is a tiled background + CSS `border-radius` (kept decoupled from the frame geometry on
  purpose — a uniform tile has no distinct corners to 9-slice).
- All `*Scale` props are **1 = native pixel (1:1)**. Knobs: `frame`, `frameScale`, `surface`,
  `surfaceScale`, `surfaceShadow`, `integration`, `accent{Top,Right,Bottom,Left}` (+ scales),
  and `--overhang` (frame↔box distance; `-1`/auto = half the band). See `PoePanelProps`.

`PoeHeader` still uses the base `.poe-frame` class in `poe-core.css` (a simple frame, not the
removed ornate sprite system).

## Tooling
- `.shot.mjs` (gitignored) drives headless Chromium against `/iframe.html?id=<storyId>&viewMode=story`.
- Reference bar: `inspiration/perfect-fantasy-rpg-...jpg` (primary). Match style + high fidelity +
  proper transparency + clean 9-slice-to-CSS. **The user rates fidelity — see `FRAME-FIDELITY.md`.**

## Testing
- `npx vitest run` runs the suite headlessly (Chromium via Playwright). The
  `@storybook/addon-vitest` integration turns **every story into a smoke test** (it must render
  without throwing) and runs any story `play` function as an interaction test.
- Behavioral assertions live in `play` functions using `storybook/test`
  (`within`, `userEvent`, `expect`, `fn`) — e.g. `PoeTabs` selection, `PoeButton` click /
  disabled, and `PoePanel`'s layer contract. Add tests by giving a story a `play`; tag a
  test-only story `tags: ['!dev']` to keep it out of the sidebar while still running in CI.
- If a run fails with *"Failed to fetch dynamically imported module … sb-vitest/deps/…"* after you
  add or change an `import`, the Vite dep-optimizer cache is stale: `rm -rf
  node_modules/.cache/storybook node_modules/.vite` and re-run.

## Open questions / future work
- **Reach the fidelity bar for one real frame** (the live blocker — see `FRAME-FIDELITY.md`).
- **Panel ↔ content positioning model.** `--overhang` is the frame↔box distance (outward). The
  inner content inset is coupled to the band today; consider exposing both as independent knobs.
  This ties into upcoming layout work (margins/paddings/grid) so framed panels compose cleanly and
  don't overlap neighbours or fight the layout. Decide before building composite/multi-panel layouts.
- Per-frame slice/band values are hand-set in `poe-panel.css` (the single source of truth);
  `process-assets` prints measured insets to copy in. If this becomes tedious once many frames
  exist, consider generating the per-frame CSS vars from a measured manifest.
- Reconcile material variants (stone/metal/parchment) with the surface-texture system.
