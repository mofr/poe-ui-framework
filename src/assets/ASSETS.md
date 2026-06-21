# PoE UI Assets

Original PoE-inspired UI primitives (not game files): **generated raster chrome** (PNG — frames,
surfaces, buttons), the project's core visual-fidelity work (see `docs/FRAME-FIDELITY.md`).

PoePanel's swappable parts (surfaces, frames) are named by **appearance + number** (`<look>-<n>`), kept in
sync with the `data-surface`/`data-frame` values, the `Surface`/`Frame` TS unions, and the Storybook
options. Single-asset component chrome (button/input/segment-bar) is named by role within its component dir.

## Folders
- `backgrounds/` — tileable `PoePanel` surfaces + overlays: `cracked-stone-1`, `worn-leather-1`,
  `solid-black-1`, `matte-stone-1`, `matte-stone-2` (crisper super-res of `-1`), `smooth-slate-1`;
  `matte-stone-soft` (blurred colour field — a Storybook backdrop only) and `blueprint-grid` (grid overlay).
- `panels/` — PoePanel frame art (9-sliced via `border-image`): `jeweled-gold-1`, `slim-gold-1`
  (full 1:1 raster frames) and `plain-dark-1/2`, `ruled-gold-1` (extracted from the reference via the mask
  editor; `plain-dark-1` ships `…-integration-shadow.png` too). Plus `panels/debug/` — all PoePanel debug
  scaffolding in one place: `debug-surface`, `debug-accent`, and the `frame`/`shadow`/`specular` layer
  sets at several corner radii (`-r0/-r4/-r8/-r24`).
- `inputs/` — `frame.png`, the ornate 9-slice input frame (`.poe-input--ornate`).
- `buttons/` — `ornate.png`, the 9-slice button plate (`.poe-button--ornate`; the one implemented variant).
- `segment-bar/` — `rail.png` (shared 9-slice rail) + per-variant fills `fill-blue.png` / `fill-green.png`
  (green is a baked recolour) for `PoeSegmentBar`.

## Usage rules
- Put ornament on frames, headers, dividers, and selected states.
- Raster chrome (panels/buttons) is consumed as CSS `border-image` (9-slice) so it stays crisp at
  native scale.
