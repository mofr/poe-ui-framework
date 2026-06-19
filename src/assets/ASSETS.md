# PoE UI Assets

Original PoE-inspired UI primitives (not game files). Two kinds live here: **vector glyphs** (SVG —
icons & nodes) and **generated raster chrome** (PNG — frames, surfaces, buttons), the latter being
the project's core visual-fidelity work (see `docs/FRAME-FIDELITY.md`).

## Folders
- `backgrounds/` — PNG surfaces and overlays: `surface-stone`, `surface-leather` (tileable panel
  interiors) and `blueprint-grid` (grid overlay).
- `panels/` — PNG frame art for `PoePanel` (9-sliced via `border-image`): `panel-frame-2/3.png`
  (the `frame-a`/`frame-b` options), plus `panels/debug/` — the debug `frame`/`shadow`/`specular`
  layer sets at several corner radii (`-r0/-r4/-r8/-r24`).
- `buttons/` — PNG button plate (`button.png`), 9-sliced via `border-image` for `.poe-button--ornate`.
- `debug/` — PNG debug textures (`debug-surface`, `debug-accent`, `debug-accents`, `debug-glow`)
  used by the `PoePanel` debug skeleton.
- `icons/` — small SVG domain/action glyphs for tags, buttons, tables, and tabs.
- `nodes/` — SVG passive-tree / atlas node elements.

`asset-meta.json` records pipeline metadata (trim + measured 9-slice insets) for processed raster
assets. (It still carries stale entries for the removed sprite-`PoeFrame` art — harmless; clean
when the asset pipeline is next revisited.)

## Usage rules
- Put ornament on frames, headers, dividers, and selected states.
- Keep dense data tables clean. Use icons only as compact semantic hints.
- Raster chrome (panels/buttons) is consumed as CSS `border-image` (9-slice) so it stays crisp at
  native scale; SVG icons render via `<img>` / the `PoeAssetIcon` component.
- Do not enlarge small icons beyond 32px unless the asset is in `nodes/`.
