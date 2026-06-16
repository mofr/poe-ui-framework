# Framework Foundation Visual Review

## References Checked

- `inspiration/perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg`
- `inspiration/warcraft-related.webp`
- `inspiration/nice-paper-background.webp`
- `inspiration/not-bad-poe-atlas.webp`

## Verdict

The first foundation slice is ready for user review when the UI shows cohesive frame depth, distinct typography roles, readable dense modifier rows, semantic state glow, and integrated icon/action treatments.

## Findings

- **Border depth:** panels use carved/inset gradients with overlay chrome (gold-2 linear gradient mix-blend-mode screen), pseudo-element inner borders, and `overflow:hidden`. Result reads as beveled frames rather than flat CSS boxes. The `--poe-shadow` (12px offset) and `--poe-shadow-inset` add physical depth.
- **Typography hierarchy:** display (`.poe-title`), panel heading (`.poe-panel-header`), body (`.poe-text-body`), label (`.poe-text-label`), numeric (`.poe-text-number`), and rune (`.poe-text-rune`) roles are visually distinct through different font stacks, sizes, letter-spacing, uppercase transforms, and color.
- **Typography readability:** fantasy serif (IM Fell English SC, Cinzel) is confined to display and panel-heading plaques. Dense modifier rows, stats, and tags use Inter (UI) and JetBrains Mono (numeric) — no fantasy font leak into data-heavy surfaces.
- **Numeric treatment:** tiers, item levels, weights, counts, and hotkeys all use `font-family: --poe-font-number` with `font-variant-numeric: tabular-nums`. Consistent alignment across tables, modifier rows, and action tiles.
- **Parchment restraint:** parchment material is defined as a frame variant but not used in the current mod-browser demo. The inset and stone variants carry the weight. Parchment is available for readability-heavy panels when introduced.
- **Semantic glow:** gold glow communicates selected rows and frames; blue glow communicates active frames and hovered action tiles; green border-left communicates required state; red border communicates blocked and danger states; amber glow communicates warning state. Glow does not appear as generic decoration.
- **Dense-row readability:** modifier rows use a `grid-template-columns: minmax(0,1fr) auto` split — left column holds name + tags (name truncated with ellipsis), right column holds three stat values. Tags wrap cleanly. Stats are right-aligned and compact. Scannable at a glance.
- **Asset integration:** frame SVGs (panel-frame.svg, header-plaque.svg) are applied as `border-image` and `background-image` on ornate frames. Ornament layer stays behind the panel header. Action tiles and skill slots use their own frame SVGs. Icon tags use `PoeAssetIcon` with consistent sizing.
- **Overall cohesion:** the result reads as one component library — consistent border radius (3–4px), consistent gold-2/gold-3/gold-4 accent hierarchy, consistent glow language, consistent numeric styling, consistent uppercase title/heading/label treatment.

## Required Iterations Before User Review

No required iterations before user review.
