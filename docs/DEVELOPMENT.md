# PoE UI Framework — Development Guide

Authoritative guide for continuing this project. Read this first.

> **STATUS (not done): the asset pipeline is NOT established yet, and the reference style in
> `inspiration/perfect-fantasy-rpg-...jpg` is NOT reached yet.** We are making progress (clean
> magenta transparency, sprite-composed frames, overhang model) but this milestone is unfinished.
> Treat the steps below as the current best approach, not a settled pipeline.

## What this is
A dark-fantasy (Path of Exile–style) React + CSS UI kit whose visual fidelity comes from
**generated raster art**, not hand-drawn SVG/CSS. **Storybook is the review surface**
(`npm run storybook`, port 6006). `src/App.jsx` was intentionally removed.

## Asset pipeline (the core workflow)
Source art is generated in the **ChatGPT app** (far higher fidelity than the OpenAI Images
API — the API path in `tools/gen-assets.mjs` is a fallback only). Provide each asset on a
**pure magenta `#ff00ff` background** — a single frame or a sheet of frames.

1. `node tools/desheet.mjs <image> <tag>` — auto-detects magenta vs the old checkerboard.
   Magenta uses a **soft-alpha chroma key + despill** (fractional alpha on anti-aliased edges,
   pull R,B toward G) → artifact-free transparency even on thin frames. Then connected-component
   slices the image into `assets-staging/sliced/<tag>-NN.png`.
2. Pick a piece → `cp` it to `assets-staging/<name>.png`; add `<name>` (category `frames` or
   `buttons`) to `tools/asset-prompts.json`; `node tools/process-assets.mjs <name>` → trims the
   margin, measures the 9-slice inset, writes `src/assets/<cat>/<name>.png` + `asset-meta.json`.
3. Frames only: `node tools/slice-frame.mjs <name>` → decomposes into sprites:
   corners `tl/tr/bl/br`, plain edge tiles `et/eb/el/er` (taken from the MIDDLE of the plain span
   so they never capture a corner/centre ornament), centre "pimps" `pt/pb/pl/pr`.

Staging dirs (`assets-staging/`, `.env`, `.shot.mjs`) are gitignored. Magenta > checkerboard.

## Frame CSS model (`src/styles/poe-core.css`)
Frames are **sprite-composed** (not `border-image`, which can't overhang or scale ornate corners):
- `::after` (z3) = plain edge tiles, repeated at 1:1.
- `::before` (z4) = corners (+ centre pimps), each drawn once, **on top of** the edges so the
  ornament overflows inward over the body and along the edges. Pimps listed before corners.
- Everything **1:1 native scale** — nothing stretched (rich art distorts otherwise).
- Body texture is clipped to the **content box** (the opening) over a dark base, so it never
  bleeds past the opaque frame.

**Two knobs per frame** (see `.poe-frame--ornate2/3`):
- `--bt` = border thickness (from the slice).
- `--ov` = outward overhang — how many px of the frame ornament rides OUTSIDE the panel box.
  Keep it **small (0–~15px)**; it is NOT the border thickness. Edges overhang perpendicular only;
  corners overhang diagonally. `padding = bt − ov` is automatic, so the opening always meets the
  body (no dark gap).
- Pimp-less frames: override `::before` to list only the 4 corners with corner positions.
- Buttons SCALE (not 1:1): `border-image … fill` (`.poe-button--ornate`).

### Add a frame, end to end
1. Get art on magenta → `desheet` → `process` → `slice-frame` (above), naming it e.g. `panel-frame-N`.
2. Add a variant class `.poe-frame--ornateN.poe-ornate` (+ `::after`/`::before`) listing its sprites,
   set `--bt` (≈ measured slice) and `--ov` (small), pick a body texture.
3. Add a Storybook story in `src/stories/PoeFrame.stories.jsx` (`className="poe-frame--ornateN"`).
4. Screenshot: `node .shot.mjs "<storyId>:WxH"` → `/tmp/shots/`, then view against the reference.

## Tooling
- `.shot.mjs` (gitignored) drives headless Chromium against `/iframe.html?id=<storyId>&viewMode=story`.
- Reference bar: `inspiration/perfect-fantasy-rpg-...jpg` (primary). Match style + high fidelity +
  proper transparency + clean 9-slice-to-CSS.

## Open questions / future work
- **Frame ↔ content positioning model.** `--ov` currently pushes the frame OUTWARD past the panel
  box. Consider the inverse — pushing frame CONTENTS inward — or supporting BOTH as independent
  knobs (outward overhang + inner content inset). This ties into upcoming layout work
  (margins/paddings/grid) so framed panels compose cleanly and don't overlap neighbours or fight
  the layout. Decide this model before building composite/multi-panel layouts.
- Per-frame CSS is hand-written; once the look is locked, auto-generate the variant classes from
  the sprite set + `asset-meta.json`.
- Reconcile material variants (stone/metal/parchment) with the body-texture system.
