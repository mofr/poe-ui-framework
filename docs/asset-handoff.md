# PoE UI Framework — Raster Asset Handoff Brief

This document is a **paste-ready brief for an image-generation tool** (Claude with image
generation, Midjourney, DALL·E, SDXL, etc.). It exists because the framework's visual bar
(see `inspiration/`) is painted raster art — textured metal, carved stone, glowing gems,
parchment — which hand-written SVG/CSS cannot match. We generate these assets externally,
then wire them into the existing CSS via `background-image`, `border-image` (9-slice), and
`<img>`/CSS icons.

Workflow: generate assets at the specs below → drop the files into the listed paths →
the integration hook tells me where each plugs into `src/styles/poe-core.css`. Generate the
**Tier 1** assets first; they carry 80% of the visual lift.

---

## Global art direction (applies to every asset)

- **Mood:** serious dark-fantasy crafting interface. Path of Exile / Warcraft armory.
  Ornate, dense, readable, textured, interactive — NOT cartoonish, NOT bright.
- **Closest references** (in `inspiration/`):
  - `perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg` — dense framed UI, hotkey action slots, meters, buttons. **Primary reference.**
  - `warcraft-related.webp` — heavy carved frames, portrait panels, readable dark panels.
  - `not-bad-poe-atlas.webp` — atlas/glow motifs, ornate plaque CTAs, magical active states.
  - `nice-paper-background.webp` — parchment surfaces inside dark/metal chrome.
- **Palette (use these exact hexes — they are the design tokens):**
  - Gold ramp: `#6f5127` → `#9a7438` → `#c9a25e` → `#f0d89a` (dark→light)
  - Stone: `#080807` / `#11100d` / `#1d1914`
  - Aged metal: `#0b0b0a` / `#171513` / `#2a2219`
  - Parchment: ink `#2f2418` on `#d7bd86` / `#ead7a7`
  - Accents: blue/magic `#4b8dff`, purple/essence `#9b5eff`, green `#53bf62`,
    amber/warning `#efbd4e`, red/danger `#cf312d`, corruption `#8f1f2c`, rare gold `#f0d35a`
- **Lighting:** single soft light from **top**. Raised metal catches light on its top edge,
  shadow pools in lower channels and recesses.
- **Technical rules for ALL assets:**
  - **PNG with transparent alpha** unless noted as "tileable texture" (those are opaque).
  - Export at **2× / @2x** the listed CSS size for crisp HiDPI (e.g. a 320×44 plaque → 640×88 px file).
  - **No baked-in text, no logos, no lorem.** Frames and plaques must be empty in the center — text is added by CSS.
  - **Flat, head-on / orthographic** view. This is UI chrome, not an isometric prop. No perspective, no drop-shadow baked outside the alpha bounds.
  - Edges must be **seamless** for tiling textures; **symmetric** for 9-slice frames.
  - Keep noise/grain subtle enough that 11–13px UI text stays readable on top.

---

## 9-slice frames — how to make them tile correctly

A 9-slice border lets one image frame any panel size. The image is cut into a 3×3 grid:
4 fixed **corners**, 4 stretched **edges**, 1 (here: empty/transparent) **center**.

For each frame asset below, the **"slice"** value is how many pixels in from each side the
corner region ends. To make it work:
- The **corner regions** (top-left, etc.) hold the ornate corner detail.
- The **edge regions** must be a constant cross-section along their length so they stretch
  cleanly (the top edge repeats horizontally, the left edge repeats vertically). Don't put a
  one-off ornament mid-edge or it will smear when stretched.
- Center = fully transparent.

---

# TIER 1 — highest leverage (generate these first)

### 1. Ornate panel frame (9-slice)  →  `src/assets/frames/panel-frame.png`
- **Purpose:** the carved border around every major panel. Replaces the current flat SVG.
- **Size:** 192×192 px file (96×96 @2x). **Slice: 28 px.**
- **Look:** thick carved **gold-on-dark-metal** molding. Outer dark rim → raised beveled
  gold band catching top light → recessed shadow channel → thin bright inner gold lip.
  **Forged metal rivet/boss in each corner.** Subtle hammered/scratched metal texture in the gold.
- **Center:** transparent.
- **Integration:** `.poe-frame.poe-ornate { border-image: url(panel-frame.png) 28 fill / 11px stretch }`
- **Paste prompt:**
  > Ornate fantasy UI panel border frame, 9-slice tileable, head-on orthographic view, square,
  > thick carved aged-gold molding on near-black metal, beveled edge catching soft light from
  > top, recessed dark inner channel, thin bright gold inner lip, a forged metal rivet boss in
  > each of the four corners, subtly hammered metal texture, hollow transparent center, dark
  > fantasy Path of Exile / Warcraft armory UI, gold #c9a25e highlights #f0d89a shadows #4a3318,
  > transparent background PNG, no text, symmetric, crisp, game UI asset.

### 2. Header plaque / banner (9-slice, horizontal)  →  `src/assets/frames/header-plaque.png`
- **Purpose:** the engraved title bar at the top of each panel (`.poe-panel-header`).
- **Size:** 640×88 px (320×44 @2x). **Slice: 20 px horizontal, full height vertical.**
- **Look:** dark beveled stone/metal nameplate, gold trim along top & bottom edge, small
  ornament or gem stud at far left & right ends, slight center sheen. Empty middle for text.
- **Integration:** `.poe-panel-header { background-image: url(header-plaque.png); background-size:100% 100% }`
- **Paste prompt:**
  > Fantasy UI title plaque banner, horizontal nameplate, head-on view, dark carved
  > stone-and-metal bar with gold trim along top and bottom edges, a small gold gem stud at the
  > left and right ends, faint center sheen, empty center for text, dark fantasy game UI, gold
  > #c9a25e on near-black #11100d, transparent background PNG, no text, tileable horizontally, crisp.

### 3. Tileable dark stone texture  →  `src/assets/backgrounds/dark-stone.png`
- **Purpose:** the app background surface. **Seamless tile.**
- **Size:** 512×512 px, **opaque** (no alpha), must tile seamlessly on all edges.
- **Look:** very dark weathered stone/slate, low contrast, faint cracks and grain, subtle
  warm-cool variation. Must NOT compete with foreground panels — keep it dim (#0b0907 range).
- **Integration:** layered in the `.poe-app` background stack.
- **Paste prompt:**
  > Seamless tileable dark stone texture, top-down flat, very dark weathered slate, faint cracks
  > and fine grain, subtle warm and cool mottling, low contrast, near-black #0b0907, dark fantasy
  > game UI background, no seams, no text, 512x512 tileable, muted.

### 4. Tileable aged-metal panel texture  →  `src/assets/backgrounds/panel-metal.png`
- **Purpose:** subtle surface fill inside panels (`.poe-frame` background layer).
- **Size:** 256×256 px, opaque, seamless tile.
- **Look:** dark brushed/hammered aged bronze-iron, faint vertical brushing + sparse scratches,
  very low contrast so 12px text stays readable. Tone around `#171513`.
- **Paste prompt:**
  > Seamless tileable aged dark metal texture, flat top-down, brushed and faintly hammered
  > bronze-iron, sparse fine scratches, very low contrast, dark #171513, dark fantasy UI panel
  > surface, no seams, no text, 256x256 tileable, subtle.

---

# TIER 2 — controls & richness

### 5. Button plate (9-slice)  →  `src/assets/frames/button-frame.png`
- **Size:** 240×84 px (120×42 @2x). **Slice: 14 px.**
- **Look:** beveled metal button cap, raised, gold-rimmed, soft top highlight, darker base.
  Provide it neutral; CSS tints magic/danger variants.
- **Integration:** `.poe-button.poe-button--ornate { background-image: url(button-frame.png); background-size:100% 100% }`
- **Paste prompt:**
  > Fantasy UI button plate, head-on, raised beveled dark metal cap with gold rim, soft highlight
  > along top edge, darker recessed base, empty center for label, dark fantasy game UI, gold
  > #9a7438 rim on #1b1510, transparent background PNG, no text, 9-slice tileable, crisp.

### 6. Action slot / skill tile (9-slice or fixed)  →  `src/assets/frames/skill-slot.png`
- **Size:** 160×160 px (80×80 @2x). **Slice: 22 px** (or supply as fixed-size if not stretched).
- **Look:** square socketed action slot like a PoE skill gem slot — beveled metal frame, dark
  inset center with faint blue arcane glow, small hotkey notch at top. Empty center.
- **Integration:** `.poe-action-tile` / `.poe-skill` background.
- **Paste prompt:**
  > Fantasy UI skill/action slot, square socket, head-on, beveled dark metal frame, dark inset
  > center with faint blue arcane glow, small notch at top edge, empty center for icon, Path of
  > Exile gem slot style, gold #9a7438 frame, blue #4b8dff inner glow, transparent background PNG,
  > no text, crisp game UI asset.

### 7. Input field frame (9-slice)  →  `src/assets/frames/input-frame.png`
- **Size:** 320×68 px (160×34 @2x). **Slice: 14 px.**
- **Look:** recessed/inset dark slot with thin gold edge, looks carved-in (opposite of the raised
  button). Empty center.
- **Integration:** `.poe-search.poe-search--ornate` background.
- **Paste prompt:**
  > Fantasy UI text input field frame, head-on, recessed inset dark slot carved into metal, thin
  > gold edge, inner shadow at top, empty center, dark fantasy game UI, gold #6f5127 edge on
  > black #080706, transparent background PNG, no text, 9-slice tileable, crisp.

### 8. Tileable parchment texture  →  `src/assets/backgrounds/parchment.png`
- **Size:** 512×512 px, opaque, seamless tile.
- **Look:** aged warm parchment/vellum, soft fiber grain, faint stains, lighter center falloff
  avoided (keep even so it tiles). Tone `#ead7a7`/`#d7bd86`. For readable content panels.
- **Paste prompt:**
  > Seamless tileable aged parchment vellum texture, flat top-down, warm cream paper, soft fiber
  > grain, faint age stains, even tone, light #ead7a7, fantasy document surface, no seams, no text,
  > 512x512 tileable.

---

# TIER 3 — icons, gems, ornaments (a small matched set)

Provide these as a **cohesive set** (same line weight, same lighting) rather than one-offs.

### 9. Gem socket icons  →  `src/assets/icons/socket-{red,green,blue,white,purple}.png`
- **Size:** 96×96 px each (48 @2x), transparent.
- **Look:** faceted round gem set in a dark metal socket ring, top-lit, slight inner glow in the
  gem color. One file per color: red `#d05248`, green `#53bf62`, blue `#4b8dff`, purple `#9b5eff`,
  white `#eadcc0`. Consistent ring across all five.
- **Paste prompt (per color, swap the color word + hex):**
  > Faceted round red gem set in a dark metal socket ring, head-on, top-lit, glossy facets, faint
  > inner red glow, Path of Exile socket, gem #d05248 metal ring #2a2219, transparent background
  > PNG, no text, 96x96, crisp game icon, part of a matched set.

### 10. Domain/tag glyphs  →  `src/assets/icons/{life,mana,armour,attack,elemental,chaos,...}.png`
- **Size:** 64×64 px (32 @2x), transparent.
- **Look:** simple engraved gold glyph on transparent bg, single light source, readable at 16px.
  Keep them iconographic and uniform — a matched family, not illustrations.
- **Paste prompt:**
  > Set of engraved gold fantasy UI glyph icons on transparent background: a heart (life), a
  > droplet (mana), a shield (armour), crossed swords (attack), a flame (elemental), a skull
  > (chaos) — uniform line weight, top-lit gold #c9a25e relief, minimal, readable at small size,
  > Path of Exile UI, transparent PNG, no text, 64x64 each, matched icon family.

### 11. Corner ornament + divider  →  `src/assets/decor/corner-ornament.png`, `divider-rune.png`
- **Corner:** 96×96 px transparent, filigree gold corner flourish (top-left orientation; CSS rotates for others).
- **Divider:** 480×40 px transparent, horizontal rule with a central gem/rune and tapered gold lines.
- **Paste prompt (corner):**
  > Ornate fantasy UI corner flourish, gold filigree scrollwork for a top-left corner, top-lit
  > relief, transparent background PNG, no text, 96x96, dark fantasy game UI, crisp.
- **Paste prompt (divider):**
  > Ornate fantasy UI horizontal divider, tapered gold rule lines meeting a central small blue gem
  > rune, top-lit, transparent background PNG, no text, 480x40 wide, dark fantasy game UI, crisp.

### 12. Background atlas/nebula (optional hero)  →  `src/assets/backgrounds/atlas.png`
- **Size:** 1920×1080 px, opaque or with dark vignette edges.
- **Look:** deep space nebula with a faint constellation/passive-tree node web, very dim, cool
  blues/purples over near-black, so panels float above it. Like `not-bad-poe-atlas.webp` but darker.
- **Paste prompt:**
  > Dark fantasy atlas background, deep space nebula with faint constellation node web and thin
  > connecting lines, very dim, cool blue and purple over near-black, vignette edges, Path of Exile
  > atlas, no text, 1920x1080, subtle so UI panels read on top.

---

## After you generate them

Drop each file at its listed path (PNG). Tell me which tiers you produced and I'll:
1. Rewire the matching CSS rule (hooks are listed per asset).
2. Re-screenshot against the inspiration crops and tune sizing/opacity/slice values.
3. Keep the current SVGs as fallback for any asset you skip.

Filenames matter — match them exactly so the integration is a drop-in.
