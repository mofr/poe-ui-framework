# PoE UI Assets

Crisp SVG assets intended for HTML/CSS/React usage. They are original PoE-inspired UI primitives, not game files.

## Folders
- `backgrounds/` — repeatable surfaces and grid overlays.
- `frames/` — scalable ornamental frame backgrounds for panels, buttons, inputs, and action slots.
- `icons/` — small domain/action glyphs for tags, buttons, tables, and inspectors.
- `nodes/` — passive-tree / atlas node elements.
- `decor/` — low-frequency ornament: dividers, corners, socket clusters.

## Usage rules
- Put ornament on frames, headers, dividers, and selected states.
- Keep dense data tables clean. Use icons only as compact semantic hints.
- Prefer SVG as CSS `background-image` for frames and `<img>` or React components for icons.
- Do not enlarge small icons beyond 32px unless the asset is in `nodes/` or `frames/`.
