# PoE UI Assets

Original PoE-inspired UI primitives (not game files): **generated raster chrome** (PNG — frames,
surfaces, buttons), the project's core visual-fidelity work (see `docs/FRAME-FIDELITY.md`).

PoePanel's swappable parts (surfaces, frames) are named by **appearance + number** (`<look>-<n>`), kept in
sync with the `data-surface`/`data-frame` values, the `Surface`/`Frame` TS unions, and the Storybook
options.

## Where the rasters live
A raster CUT FROM A MASK is **colocated with its component** in `src/components/primitives/`, beside its
`*.mask.json` and the matching `*.css` (the file is named to match the mask, e.g. `PoePanel.slim-dark-1.png`
+ `…integration-shadow.png`, `PoeButton.buttons.png`, `PoeList.list*.png`, `PoeInput.big-input.png`,
`PoeSegmentBar.progress-bar*.png` / `…fill-green.png`). Each is a committed, hand-tweakable artifact;
regenerate one deliberately with `node tools/build-mask.mjs <maskName>` — this is **never** wired into
`npm run build` (cuts aren't pure functions of the mask: inpaint, AI textures and hand-finishing are in play).

This `src/assets/` tree holds only the **shared / mask-less** rasters:

- `backgrounds/` — tileable `PoePanel` surfaces + overlays, shared with Storybook backdrops:
  `cracked-stone-1`, `worn-leather-1`, `solid-black-1`, `matte-stone-1`, `matte-stone-2` (crisper super-res
  of `-1`), `smooth-slate-1`; `matte-stone-soft` (blurred colour field — a Storybook backdrop only) and
  `blueprint-grid` (grid overlay).
- `panels/` — the mask-less PoePanel frames `jeweled-gold-1`, `slim-gold-1` (full 1:1 raster frames). Plus
  `panels/debug/` — all PoePanel debug scaffolding in one place: `debug-surface`, `debug-accent`, and the
  `frame`/`shadow`/`specular` layer sets at several corner radii (`-r0/-r4/-r8/-r24`).
  (The masked frames `slim-dark-1/2/3` and `ruled-gold-1` now live with the component — see above.)

## Usage rules
- Put ornament on frames, headers, dividers, and selected states.
- Raster chrome (panels/buttons) is consumed as CSS `border-image` (9-slice) so it stays crisp at
  native scale.
