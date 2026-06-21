# PoE UI Assets

Original PoE-inspired UI primitives (not game files): **generated raster chrome** (PNG — frames,
surfaces, buttons), the project's core visual-fidelity work (see `docs/FRAME-FIDELITY.md`).

## Folders
- `backgrounds/` — PNG surfaces and overlays: `surface-gpt-stone-1`, `surface-gpt-stone-2` (tileable panel
  interiors) and `blueprint-grid` (grid overlay).
- `panels/` — PNG frame art for `PoePanel` (9-sliced via `border-image`): `panel-gpt-panel-a/b.png`
  (the `gpt-panel-a`/`gpt-panel-b` generated drafts) and `panel-basic-panel-a/b.png` (the
  `basic-panel-a`/`basic-panel-b` frames extracted from the reference via the mask editor), plus
  `panels/debug/` — the debug `frame`/`shadow`/`specular` layer sets at several corner radii (`-r0/-r4/-r8/-r24`).
- `buttons/` — PNG button plate (`button-ornate.png`), 9-sliced via `border-image` for `.poe-button--ornate`.
- `debug/` — PNG debug textures (`debug-surface`, `debug-accent`) used by the `PoePanel` debug skeleton.

## Usage rules
- Put ornament on frames, headers, dividers, and selected states.
- Raster chrome (panels/buttons) is consumed as CSS `border-image` (9-slice) so it stays crisp at
  native scale.
