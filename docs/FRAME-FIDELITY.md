# Frame fidelity: plan, methods ledger, progress log

> **Continuity doc.** If a session ends or quota runs out, START HERE to resume. This captures the
> agreed plan, every generation method tried (and which axis it failed on), and a running log of
> where we are. Approved 2026-06-18.

## The core problem (why 2 days produced 0 finished components)
The technical pipeline (transparency, 9-slice, CSS) works. The broken part was the **judgment
loop**: Claude kept declaring outputs "reference-grade" when they were 1/5 to the user. **Claude
cannot reliably judge fidelity to the user's aesthetic; the user can.** Every gate must be judged
by the user, not Claude.

## Governing principles (apply to every step)
1. **User rates, Claude never declares.** Present candidates rendered at UI scale beside the
   reference; user gives 1–5 + says which direction is off. Never say "reference-grade".
2. **Single variable per round.** One change at a time → attributable improvement, no overshoot.
   Keep only what the user scores higher (monotonic hill-climb).
3. **One component (the frame) to 4–5/5 before any other.** No breadth before one depth win.
4. **Match work to skill.** Visual judgment + generation steering = user. Deterministic mechanics
   (extract, desheet, trim, 9-slice, CSS, screenshot) = Claude.
5. **Never discard an approach for a mechanically-fixable failure.** Separate axes: **style/feel**
   (hard, user-judged) vs **transparency/cleanup** (solved mechanic — magenta key, bg removal). A
   model that nails feel but returns opaque (e.g. `gpt-image-2`) stays a candidate; route it through
   magenta keying. Revisit failed approaches as mechanics improve.
6. **Review images live in the repo (`review/`, tracked), NEVER `/tmp`.** The user must be able to see
   every candidate, and nothing should be lost while we converge. Index in `review/README.md`.

## Aesthetic law (what makes the reference good — user, 2026-06-18)
The reference's quality is **integration + restraint**, not ornamentation:
- Frames are **inset into the stone**, not pasted onto a background — with contact **shadows**,
  **cracks**, and wear that bleed between frame and surrounding material so they read as one solid
  surface.
- **"Perfect amount, not exaggerated. Realistic yet artistic."** Tasteful, painterly, never gaudy.
- **The whole composition matters** — don't lose the holistic feel by isolating a piece. Cropping
  is OK as an *intermediate* step, but the cohesive panel-in-context is the real target.
- IMPLICATION FOR ASSETS: a panel is a **cohesive filled unit** (frame + its inset interior + the
  shadow/crack relationship with the stone), 9-sliced with a FILLED centre — NOT a hollow
  transparent border slapped over an arbitrary background. The page/stone **background is integral**
  and must be co-designed with the frame, not an afterthought.

## Component model (user, 2026-06-18) — frame is LAYERS, not one image
This is a **library**, so a frame component is a **multi-layer** thing: outer ornament, inner lip,
a separate soft **shadow** layer, semi-transparent integration edges — so it composes over varying
content/backgrounds and still reads as inset+shadowed, without being a rigid baked picture. Fits the
existing `::before`/`::after` sprite layering, just richer (add shadow + inner-detail layers w/ alpha).
Generation strategy: produce a cohesive integrated panel, then **decompose into these layers**.

## Reference provenance
- Source: Threads post by **@d4m1n.max**, "there is only one correct way to redesign GitHub and this
  is it" (05/03/26, 186K views). https://www.threads.com/@d4m1n.max/post/DX4O1k3mOaM
- Thread has other beautiful designs; user wants to FOCUS on this one GitHub/PoE frame now, maybe
  pull from others later.
- Higher-res original NOT retrievable (fbcdn URL 403, signed). 1440px screenshot is what we have.
- Creator did not state tools/model. The painterly richness looks like a Midjourney-class generator,
  NOT necessarily OpenAI — OPEN STRATEGIC QUESTION: matching the "feeling" may be generator-bound.

## ASYMMETRY LAW (user, 2026-06-18)
Frames are **not symmetric**. The underlying *idea* is symmetric, but lighting, material behaviour,
and artistic richness make every corner/edge look different. Not a hard blocker, but:
- **Mirroring one corner → four (esp. VERTICAL flip) inverts the implied light direction** → looks
  artificial. The `/tmp/ref/extracted-frame.png` test does exactly this, so it UNDERSELLS extraction.
- For fidelity: extract all 4 real corners *individually* (keep their unique wear/light), or rely on
  generation, which naturally varies the 4 corners (a point in generation's favour).
- 9-slice's repeated edges are inherently "too uniform" for this art — acceptable, but the richer
  path keeps per-side variation.

## SCALE LAW (user, 2026-06-18) — confirmed by measurement
The reference frame is **tiny**: edges a few px, corners ~30px (verified by 6× zoom of the react
panel corner at full-image (282,112) + luminance scan — thin dark-iron band ~6–10px + 1px gold line
+ ~25–30px gold scroll bracket; all dark-on-dark with fine grime). Its richness is **raster /
near-pixel-art craft** (cracks, dirt, every pixel meaningful), NOT high-res ornamentation. So:
- Generating a 1024px ornate frame and shrinking = WRONG (smooth massive decoration, loses grit).
- Produce/judge at ~native UI size (panel ~280–360px wide), thin edges, small corners.
- Text prompts are **too loose** (user: "the same description covers numerous pleasant and
  unpleasant pictures") → don't rely on blind text-prompt iteration; anchor on the reference.
- Downscale test: shrinking our 3/5 candidate to 360px thins it but SMOOTHS it (lanczos) — grit must
  exist in the source; thinness is free, grit/restraint/integration are not.
- The reference was almost certainly a **one-shot full-dashboard render** (consistent lighting,
  perfect inset/shadow integration), never componentized → clean extraction is blocked by entanglement.

## OPEN FORK (2026-06-18): which generation engine/method? (text prompts too loose; OpenAI runs
smooth+goldish; extraction blocked by entanglement; feel likely Midjourney-class)
- A. Switch source-art generation to a **Midjourney-class** model (reference's likely origin) → grit
  + painterly feel OpenAI lacks; Claude still slices/layers. Needs user access. Best shot at the feel.
- B. Generate **full small mockup panels** (not isolated frames) w/ best generator, downscale to
  native, extract layers. Embraces the one-shot nature; componentizing is the hard part.
- C. **OpenAI img2img + downscale + added grit texture**, iterate single-variable. Cheapest, likely
  capped below the bar.
- D. **Hand/procedural raster craft** of the thin frame + grime overlays. Max control, labor + needs
  the user's artistic eye in the loop.

## TEXT IS DECOUPLED FROM ASSET RESOLUTION (user Q, 2026-06-18)
The master size (1680) is chosen on **raster art only**. Text in the reference is baked, but in THIS
React+CSS kit all text is **live CSS** (web fonts) — only the chrome (frames/buttons/bars/bg) is raster.
So font size must NOT influence the asset resolution. 9-slice means panel dimensions are independent of
border resolution: borders stay crisp at native ~native-px thickness while the panel (and its text room)
can be any size. The user's "higher-res feels better for fonts" = a target UI density/scale decision,
handled later in CSS, independent of the 1680 art master.

## LOCKED LAYER ARCHITECTURE (2026-06-18) — the PoeFrame component contract
Z-order top→bottom = A › B › C › D (each sublayer 1 = topmost). Page background is app-level (NOT a
component layer) but parametrizes C and D.
```
A. FRAME ART  (top — overlaps inward)                 [component raster, the hard one]
   A1 Gem emissive / glow      animatable, additive            CSS/parametric
   A2 Decorative accents       gems, bosses, pimps, rivets      raster
   A3 Structural border        4 corners + 4 edges; bevel/specular BAKED in   raster
B. CONTENT SLOT  (developer-provided; a header bar is just content)
C. INTEGRATION = f(frame geometry, background material, variant)   [2 layers]
   C1 Specular                 additive / screen                CSS → upgrade to texture
   C2 Shadow                   semitransparent / darken; follows frame silhouette;
                               frame-corner/border shadow LIVES HERE (not in body)   CSS → texture
   variants: extruded · pushed-deep · floating
D. BODY SURFACE  (swappable)
   D1 Base material texture    TILEABLE; stone/leather/metal/parchment; grime baked;
                               + tint/vignette as a CSS parameter                     raster
```
Rationale notes: header collapses into content (frame-on-top z-order means a content header can't cover
corners). Integration is 2 layers because shadow(darken) vs specular(screen) need different blends;
cracks live in BOTH (dark line + catch-light) so no separate crack layer; start CSS, upgrade to
textures per material×variant for crack-grade fidelity. Body is uniform tileable — the frame-localized
corner shadow is C2, NOT the body. Integration shadow follows the ornate silhouette via CSS
`filter: drop-shadow()` (not box-shadow).
SKELETON BUILT (2026-06-18): `src/components/primitives/PoeFrameLayered.jsx` +
`src/styles/poe-frame-layered.css` + story `Primitives/PoeFrameLayered`. Validates A/B/C/D z-order,
swappable body (stone/leather), integration variants (inset/extrude/deep) in CSS, content slot.
Frame art = placeholder (not yet isolated). Screenshot `/tmp/shots/primitives-poeframelayered--all-variants.png`.
Architecture LOCKED & proven.
9-SLICE COMPLETE (2026-06-18): rebuilt every raster slot as `border-image` 9-slice (frame A, integration
specular C1 + shadow C2, body D tiles) — panel resizes freely, corners hold + edges tile across sizes
(story `NineSlice` at 360×300 / 560×220 / 240×420). Debug placeholder textures in `src/assets/debug/`
(frame=orange/teal, specular=cyan, shadow=purple, body=grid). Pretty stone page-bg (E) + vignette in the
story decorator. Screenshot `/tmp/shots/primitives-poeframelayered--nine-slice.png`.
ARCHITECTURE DONE. Refinements (2026-06-18): debug recolored ONE HUE/LAYER (frame RED, specular CYAN,
shadow PURPLE, body GREEN); integration (C) now extends OUTSIDE the frame as a SEMI-TRANSPARENT halo
(negative inset) — it's the spatially-outermost layer, blending frame→page-bg (essential to the layer);
body (D) has a vignette (tint param); dark Storybook theme `.storybook/manager.js` (needs SB restart).
Overlap fix (2026-06-18): specular (C1) is the OUTER rim halo only — does NOT enter the opening (inside
= body + C2 recess shadow only, per spec; the frame's own bevel-specular is BAKED in A3). Shadow+specular
OVERLAP outside the frame; specular debug = CYAN STRIPES so it reads over the purple shadow.
DECORATIONS (2026-06-18, revised): A2 = CENTER-EDGE pimps (gold medallions, positioned at edge midpoints,
stay centered on resize) — NO corner gems (corner is itself decoration). A1 glow = STATIC drop-shadow
(animation removed — doesn't help raster work). Frame debug texture (A3) now has TRANSPARENT holes +
irregular inner notches → integration/body shows through (realistic geometry test). Shadow (C2) softened
(blurred) so inner recess reads as a shadow, not a 2nd border; shadow+specular both readable in halo.
`decorated` prop, story `Decorated`. ALL sublayers (A1/A2/A3/B/C1/C2/D) represented.
GEOMETRY/Z FIX (2026-06-18): debug frame is a THIN ring (~18px of the 30px band) with chamfered L-corners
+ holes (irregular silhouette, doesn't fill the band). Integration SPLIT: outer halo (`.pfl__shadow` +
`.pfl__specular`, inset -28→0, OUTSIDE frame) + inner recess (`.pfl__recess`, inset 30, inset box-shadow,
INSIDE opening). NOTHING under the frame band → frame gaps/holes reveal the BODY (green), not integration.
Story spacing gap 110/pad 80 so halos don't overlap. Skeleton now models a realistic irregular frame.
CLEANUP (2026-06-18): removed body vignette (read as a 2nd inside shadow) → single inside shadow = the
purple recess (`.pfl__recess`, inset box-shadow, semi-transparent gradient over body). Outer halo
slimmed to a few px (shadow inset -6/bw6, specular bw3) — thin demonstrative shadow+specular at the
frame's outer edge. `deep` variant now deepens the recess. Chamfered corners correctly leak bg outside
the curve. DEBUG SKELETON COMPLETE & physically faithful.
INTEGRATION = DROP-SHADOW (2026-06-18): replaced the separate integration ring/recess with stacked
DIRECTIONAL `filter: drop-shadow()` on the frame art — C2 shadow (purple, lower-right) + C1 specular
(cyan, upper-left), semi-transparent. Derived from the frame's alpha → FOLLOWS the silhouette (chamfers,
holes, inner edge) so frame+integration always play together: no corner gap, inner shadow touches the
frame, directional per variant (extrude casts further / deep darker). Body clipped (clip-path chamfer)
so the cut corner shows page-bg not green. Trade-off vs locked spec's "integration as 9-slice texture":
drop-shadow has no authored texture (no cracks) — when crack-fidelity is needed, add a frame-coupled
texture layer. Simple-coupling chosen now per user's "simple solution for frame+integration to play together."
Debug textures all in `src/assets/debug/`. Screenshot `/tmp/shots/primitives-poeframelayered--decorated.png`.
NEXT TRACKS: (1) frame-art matting (isolate A with alpha incl. holes → swap real art into the 9-slice);
(2) refine integration CSS→texture for crack fidelity; (3) real body/material textures.

## (earlier) LAYERED COMPONENT MODEL (user redesign, 2026-06-18) — superseded by the LOCKED version above
A frame is NOT one baked image and NOT a frame-with-baked-background. It is modular LAYERS so the
background is swappable and the integration is restylable:
- **L0 Background/body** (stone/metal/parchment): separate swappable raster.
- **L1 Insetting/integration = CSS, NOT baked**: the recess/drop shadow + bevel highlight on the bg.
  Restylable by definition (inset ↔ extrude = flip the shadow), auto-adapts to whatever bg is behind.
  We RECREATE this in CSS, do NOT extract it from the reference. (This is what makes "restyle the
  insetting, keep the frame art" trivial — user's key requirement.)
- **L2 Frame art**: the isolated ornamental border — alpha EVERYWHERE it isn't metal (outer edge AND
  the little ornament holes). This is the ONLY hard raster.
KEY CONSEQUENCE: we don't extract shadows/highlights at all (CSS makes them); only isolate the frame art.

### Frame-art isolation = the hard step (matting), NOT solved by magenta
Magenta-key only clears the big central opening. Isolating the frame with alpha in the LITTLE
ORNAMENT HOLES + the outer edge, from a same-tone dark background, is genuine IMAGE MATTING
(dark-iron-on-dark-stone = worst case). Candidate approaches (same dedicated-model playbook as SR/LaMa):
SAM segmentation + alpha matting; or difference-matting (LaMa a clean bg plate, subtract). The Quest
Log frame (solid band + corner bosses, few holes) is tractable; heavy filigree is the harder general case.

### Decouple architecture from raster (user): lock layers BEFORE reference-grade raster
Build the `PoeFrame` skeleton NOW with the current frame as a PLACEHOLDER: prove CSS insetting
(inset↔extrude) + swappable bg end-to-end. Solve frame-art matting in PARALLEL. Architecture validated
cheaply; raster perfected separately.

(Superseded idea — integrated margin / rounded-rect magenta interior: kept for history; rejected because
the user wants the frame isolated + insetting as a separate restylable layer.)

## The plan
- **Step 0 — Recon for real source art (cheapest, highest leverage).** Web-search the reference
  (a PoE-styled GitHub dashboard concept, "The Interface Mage") for the original/higher-res art, the
  asset pack or UI framework it came from, or close purchasable fantasy-RPG UI kits. If real high-res
  art is found → user acquires PNGs, skip generation, go to Step 4. Else → Step 1.
- **Step 1 — Lock target: the FRAME.** Component = panel frame (foundation, no typography). Optional
  warm-up: a seamless background/body texture (needed for visual tests anyway). Crisp north-star =
  best from Step 0, else AI-upscale the cropped frame region from the 1440px JPG. User confirms target.
- **Step 2 — Method bake-off on the frame (user judges style/feel only; transparency ignored here).**
  Candidates: (A) direct extraction/restoration of the reference's actual pixels; (B) ChatGPT app,
  user-steered; (C) API img2img anchored on the extracted frame; (D) other models incl. `gpt-image-2`
  via magenta keying, `chatgpt-image-latest` if verified. User scores feel; adopt the winner. If all
  <3/5, loop back to Step 1 (reference problem).
- **Step 3 — Converge.** Iterate the winning method one variable per round (silhouette/proportion →
  palette → material → ornament density → corner/edge detail), each rendered for the user's rating,
  until 4–5/5.
- **Step 4 — Integrate & lock.** `tools/process-assets.mjs <name>` → `tools/slice-frame.mjs <name>`
  (frames) → wire variant in `src/styles/poe-core.css` → story in `src/stories/` → `.shot.mjs`
  screenshot → user's final sign-off → commit.
- **Step 5 — Scale.** Only after the frame is locked: repeat per component, consistent palette.

## Methods ledger (NEVER silently drop a row — update status, don't delete)
| Method / model | Style/feel (user 1–5) | Transparency | Status |
|---|---|---|---|
| `gpt-image-1.5` + ref crop + text prompt | 1/5 (too massive, not the feel) | clean RGBA ✓ | weak on feel; keep for img2img variant |
| `gpt-image-2` / `-2026-04-21` | untested by user | opaque ✗ | REVISIT via magenta keying — may win on feel |
| `chatgpt-image-latest` | untested | unknown | blocked on OpenAI org verification |
| ChatGPT app (manual, user-steered) | > API but "not the feeling" | manual magenta export | candidate B |
| Direct extraction — mirror-assembled tiles | ≤3/5 (user) | by source bg | `review/B-extracted-mirrored-*`: good local pixel crisp; BAD: corner captured whole composition (shadows/neighbor), corner→edge transition "just cut" (rough seams), vertical-flip inverts light. Superseded by ring method. |
| Direct extraction — REAL continuous panel border ring | **0/5 (user, neutral)** — DORMANT, keep | by source bg | `review/B2-*`: 9-slice the actual Repo Overview panel border. CLEAN header+top-corners but bottom edges/corners bleed map. User verdict: "it's just not a frame — the original is a composition of many little things, simple cropping is impossible." Approach parked, NOT discarded (may revisit). |
| **USER-CLEANED reference → AI/direct** (NEW, to try) | untried | n/a | User manually conceals non-relevant elements (map, title text, icons, +/- buttons, neighbors, inter-panel shadow) in an editor → clean isolated frame on magenta/transparent. Then: (a) direct process/slice by Claude, AND (b) img2img anchor for gpt-image-1.5 to sharpen/complete keeping the feel. Removes the entanglement that blocked everything. "Try all options." |
| **HYBRID (recommended next):** extract authentic CORNERS + header from ref; SYNTHESIZE thin edges + stone body; compose as layered component | untried | clean by construction | Plays to strengths: extraction for the rich hard-to-fake pieces (clean), generation/procedural for the simple repeatable thin edges + body where extraction fails. Distinct real corners → asymmetry. + separate shadow layer for integration. |
| `gpt-image-1.5` IMG2IMG anchored on real panel + SUBTLE-target prompt | awaiting user rating | clean | `assets-staging/frame-img2img-subtle.png` — looks far closer to ref's restrained style; header text baked in. |
| Asset packs (Moon Tribe, Vill8tion, Nexa, Mytherra) | -99/5 (user) | n/a | REJECTED: bland/cheap, miss the ref's painterly AI-art richness. Dead route. |

## Step 0 recon findings (2026-06-18)
- The reference ("The Interface Mage", GitHub-as-PoE) is **not a real product** — almost certainly
  AI-generated concept art. No downloadable source for the exact image.
- BUT ready-made high-res asset packs in the exact dark-iron+gold PoE/Diablo style EXIST. Shortlist
  handed to user to judge (fidelity = user's call):
  - **Moon Tribe — Fantasy RPG UI Pack** ($15.99, 4K, transparent PNG **+ PSD**, explicitly
    Diablo2/PoE-inspired; 50+ board bases/panel frames, 150+ decor, 100+ icons, bars, XP panels).
    https://moon-tribe.itch.io/fantasy-rpg-ui-pack — STRONGEST candidate (alpha + editable PSD).
  - **Vill8tion — Gothic & Gold 4K** ($3.99, 4K, PNG on solid black = needs keying, no PSD; dark-iron
    frames, gold/ruby bosses, portrait/slot frames). https://vill8tion.itch.io/medieval-fantasy-rpg-ui-kit-gothic-gold-4k
  - Backups: Nexa Visuals Dark Fantasy Inventory Kit; Mytherra Realms (ultra-knight.itch.io).
- **Decision pending (user):** eyeball pack previews vs reference. Match → buy, drop frame PNG in
  `assets-staging/`, Claude integrates. No match → proceed to Step 2 generation bake-off.

## Progress log (append-only; newest last)
- 2026-06-18: Plan approved. Established judgment-loop principles. API self-serve (`gpt-image-1.5`,
  material-forward grim prompt) was technically clean but rated **1/5 on feel** by user — NOT the
  target. `panel-frame` + CSS `--bt:100px` currently reflect that rejected attempt (to be redone).
  Reference = `inspiration/perfect-fantasy-rpg-...jpg` (1440×810, soft).
- 2026-06-18: Step 0 recon done (see above). Awaiting user's verdict on asset packs vs generation.
- 2026-06-18: User rejected ALL asset packs (-99/5: bland/cheap, miss the painterly feel). Pack route dead.
- 2026-06-18: KEY REFRAME — inspected reference at full 1440px res (`/tmp/ref/*.png` crops). Real
  frames are **SUBTLE**: near-black panel + thin gold trim + header bar (centered title, gold
  underline, gear/X icons) + small gold corner brackets + moody painterly texture. NOT the thick
  gem-encrusted slab earlier generated — that's why it was 1/5 ("too massive"). Target corrected.
- 2026-06-18: img2img (gpt-image-1.5) anchored on real panel → `assets-staging/frame-img2img-subtle.png`.
  User rated **3/5**: too goldish, frame is 3 concentric frames (not elegant/single), some elements right.
  Text prompts judged TOO LOOSE to converge.
- 2026-06-18: SCALE LAW established (see section) — frames are tiny/thin, raster pixel-craft; we'd been
  generating at the wrong scale. Confirmed by measurement.
- 2026-06-18: User access = OpenAI only (can buy others later). Wants to EXHAUST OpenAI + extraction
  before buying. All engine options still open.
- 2026-06-18: TRIED extraction (mirror tiles) → user ≤3/5: good local crisp; bad corner-captures-
  composition + rough "just cut" seams. Also: don't upscale (pixel-perfect art → show native 1:1).
- 2026-06-18: Extraction v2 = REAL continuous panel-border RING (`review/B2-*`). Fixes seams (real
  contiguous corners/edges) + asymmetry. Finding: CLEAN for header+top-corners (rich parts), BLOCKED
  for thin edges+bottom-corners (content bleeds to the few-px frame). Pure extraction can't make a
  full clean frame here.
- 2026-06-18: → Proposed HYBRID: extract authentic corners+header from ref, synthesize thin edges +
  stone body, compose layered (w/ shadow layer). AWAITING USER GO/feedback.
- Workflow fix: all review images now in repo `review/` (tracked), 1:1 native (no upscaling).
- 2026-06-18: Extraction RING rated 0/5 (neutral) — "not a frame, original is a composition, cropping
  impossible." Parked as dormant (kept in ledger). NEW idea from user: hand-clean the reference frame
  (conceal map/text/icons/buttons/neighbors) → feed cleaned frame to AI (img2img) AND/OR direct process.
  This refines the REFERENCE so the entanglement no longer blocks downstream. NEXT: user produces a
  cleaned frame; Claude runs both (a) direct slice/integrate and (b) gpt-image-1.5 img2img refine.
- 2026-06-18: REVERTED the drop-shadow integration (it drifted from the locked spec — can't carry
  authored cracks). Back to spec: outer integration = RASTER asymmetric 9-slice (C1 specular `screen`
  + C2 shadow `darken`, debug textures). Inner shadow split out as its OWN simple thing: SYMMETRIC,
  SINGLE-COLOR inset (`.pfl__recess`), sole job = seat the body in the opening (refines spec, which
  had folded it into C2). Corner gap conflict solved per user: body has TRANSPARENT (rounded) corners
  (`border-radius`) so no hard square fights the frame's corner — replaces the clip-path chamfer.
  Layout now crystal-clear: ONE element per layer (A2/A1 pimp · A3 art · B content · C1 specular ·
  C2 shadow · recess · D body). Variants = restyle of recess depth + ring opacity (same textures).
  Screenshots `review/layout/pfl-{nine-slice,decorated,variants}.png`. AWAITING user judgment.
- 2026-06-18: User: frame shows distinct corners, integration didn't. Two fixes: (1) GEOMETRY — the
  integration layers had reached the opening (specular bled inside as a flat cyan band); reshaped them
  into a proper HALO around the frame (outside + under the band's outer few px, never into the opening).
  (2) Debug textures `debug-shadow`/`debug-specular` rebuilt with 4 BOLDLY distinct corner colors
  (shadow violet/blue/magenta/indigo, specular teal/sky/green/pale) → asymmetric 9-slice corners now
  read like the frame's. Re-screenshotted. AWAITING user judgment.
- 2026-06-18: MODEL CLARIFIED & rebuilt (user-driven, supersedes the drop-shadow + per-layer-inset
  approaches above). The frame component = a plain LAYOUT RECT (box + padding + margin); ALL decoration
  is out-of-flow (`position:absolute; inset:0; pointer-events:none`) so it never touches layout. ONE
  positioning rule for every raster layer: the rect boundary sits at the CENTRE of the raster —
  implemented as `border-image` with `border-image-outset = half the band` (band straddles the rect
  edge equally in/out); all overhang/flow lives in the pixels, scaling is layout-neutral. Layers differ
  ONLY by texture/z/blend, never geometry (frame art + both integration layers are identical 9-slices).
  Best-practice review concluded: DON'T hand-roll sprites — `border-image` is the battle-tested 9-slice
  primitive, auto-stops edges at corners (respects the body bevel for free), `round` edges avoid clipped
  half-tiles. Consequence of zero-offset: integration is NOT a halo beyond the frame — it shares the
  frame's envelope, so `--band` must hold the ornament PLUS its integration breathing room. Inner shadow
  = symmetric single-colour inset, starts at the rect (just seats the body). Body has a `--bevel` param.
  Code is intended to READ as the model (header comment in `src/styles/poe-frame-layered.css`). Debug
  textures regenerated as a CO-DESIGNED set (frame ornament mid-band, integration just outside on the
  page side, distinct corners). Resolves the overhang-vs-inset open question: padding = content-inset
  knob, outset = overhang knob, independent. Screenshots `review/layout/pfl-*.png`. AWAITING user code
  review + judgment.
- 2026-06-18: TERMINOLOGY pinned (user asked to be corrected): what we call "bevel" is a CORNER RADIUS
  (`border-radius`, circular rounding); a flat 45° cut is a CHAMFER; a true bevel is a slanted/3-D edge.
  "raster" = pixel image (correct). assets live in a FOLDER/directory (not "package"). a transparent
  hole = a CUTOUT. — Debug asset reorg: corner shape lives in the RASTER, so debug frames now come as
  matched SETS per corner radius (r0/r8/r20), each = frame + BOTH integration sheets (shadow+specular),
  moved into the frames folder at `src/assets/frames/debug/` (they're frames). Each sheet has a CUTOUT
  in every corner; the debug body carries a bright edge marker so the body's border reads THROUGH the
  cutouts (verifies how the body radius relates to the frame opening). Component gets a `corner` prop
  (data-corner picks the set + matching `--bevel`); sources are CSS vars (`--src-frame/-shadow/-specular`).
  Stories consolidated to ONE `Debug — all variations` story (radius sets · integration variants ·
  decoration+resize · radius-coupling). debug body/pimp/glow stay in `src/assets/debug/` (different asset
  types, not frames). Screenshot `review/layout/pfl-debug.png`. AWAITING user code review + judgment.
- 2026-06-18: MILESTONE polish (user reviews in Storybook, not screenshots). UNIFIED TERMINOLOGY (now
  canonical in the CSS header comment): PANEL = whole component; BOX = its layout rectangle (size +
  padding + margin, the only thing affecting layout — we say "box", not "rect"); FRAME = ornamental
  border; BODY = interior background fill; CONTENT = developer content in the slot; INTEGRATION =
  shadow+specular blending frame→page; INNER SHADOW seats the body. "bevel" REMOVED everywhere → it
  was a misuse of CORNER RADIUS; prop `bevel`→`radius`, var `--bevel`→`--radius`. Fixes: r0 raster now
  FULLY SQUARE (was r_out=R+12 → a leftover radius-12 cut even at R=0); r20 sliced cleanly by giving
  bigger radii a bigger 9-slice (--band/--slice grow per set: r0/r8=30, r20=44) so the corner fits the
  corner slice and edges stop grabbing corner pixels. New layer-visibility props (showFrame /
  showIntegration / showInnerShadow / showBody) to inspect layers alone. Stories: ONE `Debug — all
  variations` (radius sets · variants · layers-in-isolation · decoration+resize · with-content ·
  coupling) on a NEW blueprint grid bg; a `Playground` with native Storybook Controls (args/argTypes)
  to tweak live; a TEMPORARY `Migration` story (PoeFrame → PoeFrameLayered, with prop mapping) on the
  stone bg. Stone bg KEPT for future artistic iteration. Debug screenshot residue (review/layout/)
  removed. AWAITING user review in Storybook.
- 2026-06-18: RENAMED component `PoeFrameLayered` → `PoePanel` (the PANEL is the whole component; the
  FRAME is one part). Files now `src/components/primitives/PoePanel.jsx` + `src/styles/poe-panel.css`
  (class `.poe-panel`), story `Primitives/PoePanel`. Term `body` → `SURFACE` (best practice: "body"
  reads as the content area, e.g. card-body; "surface" = the background layer, Material-Design sense).
  API is now CHOICE-driven, each part with a "none": `frame` (none|r0|r4|r8|r24 — sets surface radius;
  integration source chosen alongside since it shares the radius), `surface` (none|debug|stone),
  `integration` (none|debug — RASTER-driven; the old CSS `variant` inset/extrude/deep was a hack
  contradicting the model → REMOVED), `decoration` (none|debug). Removed: `radius` (coupled to frame),
  `variant`, `material` (never implemented), and the `showFrame/showIntegration/showBody` toggles
  (replaced by the none-choices). `className` kept as the standard passthrough, hidden from Controls.
  Debug frame sets regenerated at r0/r4/r8/r24 (r24 uses band/slice 48 so its corner fits). Blueprint
  story background replaced with a raster grid tile (`src/assets/backgrounds/blueprint-grid.png`) +
  blue gradient + "+" ticks + inset border, per the user's reference. Playground uses native Controls.
  DEFERRED (need decisions): (1) edge + edge-decoration as SEPARATE selectable layers — would split the
  one frame 9-slice into a corners-only + edges-only pair of border-image layers (stays in 9-slice,
  seam-safe); not done, awaiting go. (2) stone1/stone2/metal frame options — no rasters yet; the kept
  frame B/C textures (panel-frame-2/3.png) become real frame options once their slice geometry is set.
  (3) Deleting old PoeFrame code + frame-A/placeholder textures — UNSAFE now (PoeFrame is used by
  Inspector/ModifierTable/ModifierGroup; panel-frame* referenced in poe-core.css) → after those migrate
  to PoePanel. Migration story reframed to show the keeper textures (frame B/C). AWAITING user review.
- 2026-06-19: Iteration. (1) debug-r24 "is bigger" EXPLAINED (not a bug): radius 24 can't fit a 30px
  9-slice corner, so its band/slice grow to 48 — inherent 9-slice geometry; r0/r4/r8 stay 30px (uniform).
  (2) `decoration` prop → `accent` (the broad word "decoration" applies to the whole panel; this part is
  the centre-edge medallions). (3) frame values → `debug-r0/r4/r8/r24` (the frame is whole raster art,
  not just a radius; "debug" prefix leaves room for real frames). (4) Migration STORY removed; instead
  the kept frame B/C textures (`panel-frame-2/3.png`) are now REAL frame options (`frame-b`/`frame-c`):
  they're clean frames with transparent interiors + rect openings, wired as border-image at NATIVE slice
  (measured corner insets: B≈96px, C≈56px) so corners are pixel-exact (band=slice, no scaling); surface
  radius 0; no debug integration. Size the box near native (1317×917 / 1234×886) for correct proportion;
  a dedicated scale/native-size control is a noted future option. (5) Blueprint "+" ticks dimmed
  (alpha 150→80). DECIDED: surface stays a tiled background + CSS radius, NOT a 9-slice — a uniform
  tileable fill has no distinct corners/edges, and 9-slicing it would couple the surface texture to the
  corner geometry (need one texture per radius); border-radius keeps it decoupled. (Edge + edge-decoration
  as separate selectable layers still deferred per user.) AWAITING user review in Storybook.
- 2026-06-19: Iteration. Blueprint inner border line dimmed (outline .45→.16). Real frames (frame-b/c)
  REMOVED from the Debug story (kept as Playground options — they were huge native cells bloating it).
  Added `surface: 'leather'` (existing `body-leather.png`). Per-edge ACCENTS: `accent` (single) →
  `accents` array `['top','right','bottom','left']` (medallions rendered per edge) + `accentScale`.
  Frame-b/c edges were STRETCHING under `round`: their edge is one continuous bar (the whole middle
  strip = one big tile), not a small repeating motif like the debug raster — so set their `--repeat:
  stretch` (clean for a uniform bar). Exposed geometry knobs as CSS vars + Playground controls for
  manual tweaking: `--slice`/`--band` (slicing — also per-frame in poe-panel.css), `--repeat`, and
  `--overhang` = the FRAME↔SURFACE distance (how far the frame sits past the box edge; default half the
  band). Q answered: the green surface-edge marker is a solid CSS `box-shadow` ring (follows
  border-radius), not raster — so no 9-slice needed; 9-slice is only for raster art with distinct
  corners. PUSHED BACK on dropping PoeFrame: still used by Inspector/ModifierTable/ModifierGroup, which
  need a header + material/state variants PoePanel lacks; deleting now breaks them. Kept PoeFrame;
  offered to migrate the three (accepting debug look) on confirmation. AWAITING user review.
- 2026-06-19: Cleanup + scale knobs. DELETED dead code: domain components (Inspector/ModifierTable/
  ModifierGroup — barrel-only, never rendered) + PoeFrame + its story + exports (no consumers left).
  Renamed assets to drop the non-conventional "body": body-stone/body-leather/debug-body →
  surface-stone/surface-leather/debug-surface (refs updated in poe-panel.css, poe-core.css,
  Textures.stories). Real frame options renamed frame-b/frame-c → frame-a/frame-b (fresh names; files
  panel-frame-2/3.png unchanged). Story renamed → "Debug". Blueprint inner border line removed.
  SCALE knobs added (range now starts at 0.25): per-edge accent scale (4), frameScale (frame+integration),
  surfaceScale (surface tile). Accents: boolean → per-edge CHOICE (none|debug, room for more styles).
  REMOVED controls: `slice` (intrinsic to the frame raster — belongs in a future asset builder/meta, not
  a user control; I can't set it reliably by sight) and `repeat` (intrinsic to the frame, set per frame
  choice). Kept `overhang` control (auto = half band).
  TERMINOLOGY (clarified for the user):
    • prop vs control — a PROP is a parameter of the React component (the API surface); a CONTROL is a
      Storybook Controls-panel widget bound to a story ARG, which feeds a prop. Controls are a dev
      affordance, not part of the component.
    • overhang vs inset vs offset — OVERHANG = outward, how far the frame spills PAST the box edge
      (= the frame↔box distance, default half the band, knob `--overhang`). INSET = inward, distance
      pushed in from an edge (e.g. content inset = padding). "offset" is ambiguous — avoid; say overhang
      (out) or inset (in). The inner overlap (frame covering the surface) we can name "reveal" if needed.
  FUTURE NOTE (user): one full 9-slice covering frame+surface TOGETHER (border-image with the `fill`
  keyword) may help when we return to raster generation — generate a whole panel, slice it, no tricky
  frame/interior masking + extraction. Trade-off: loses surface swappability (frame and fill baked
  together). Worth it as an option for hard-to-extract art. AWAITING user review in Storybook.
- 2026-06-19: Polish + typing. Story black border removed (global `.poe-app` wrapper padding 28 in
  preview.jsx → story backdrops now `margin:-28` bleed). `surfaceShadow` prop added (inner-shadow
  strength 0–1, var `--surface-shadow`). ALL `*Scale` knobs now 1 = NATIVE pixel (1:1): native sizes
  baked — accent 48, debug surface 64, stone/leather 1254. New `Gallery` story (default + presets:
  frame-b·stone, frame-b·leather, large frame-a·stone, on a dark bg). PoePanel converted JSX → `.tsx`
  with a typed `PoePanelProps` interface (union types) — answers the untyped-props gap (repo already had
  .tsx; Vite/esbuild, no tsconfig, so types are editor-DX not build-enforced). Internal `pimp` →
  `accent` (`.poe-panel__accent`, debug-pimp→debug-accent). SLICE vs BAND clarified: slice = where to cut
  the SOURCE (source px); band (border-image-width) = rendered thickness (output px); slice==band → 1:1.
  NAMING AUDIT pending decisions: assets/frames/ mixes frames + surface `*-p[tblr]` tiles + dead per-side
  slices (poe-core ornate2/3 still references them; .poe-frame used by PoeHeader) + unused
  placeholder-frame.png; panel-frame/2/3.png vs frame-a/b option names. AWAITING user decisions.
- 2026-06-19: Naming cleanup executed (user decisions). DELETED the dead PoeFrame ornate system: all
  per-side slice sprites (panel-frame*-{tl..pr}.png), panel-frame.png (frame A), placeholder-frame.png,
  and poe-core.css lines 54-82 (.poe-ornate rules + comments). PoeHeader uses only base .poe-frame, so
  nothing live broke. RENAMED folder src/assets/frames → src/assets/panels (per user; "frames" held
  non-frames). Kept panel-frame-2/3.png (the frame-a/b options) + debug/ set. Updated all path refs
  (poe-panel.css, asset-meta.json, tools/slice-*.mjs). NOTE: asset-meta.json still has stale entries for
  the deleted frame A / slices — harmless (pipeline metadata, not runtime); clean when the asset pipeline
  is revisited. All PoePanel stories render clean.
- 2026-06-18: USER delivered hand-cleaned QUEST LOG frame (`review/C-user-cleaned-quest-log.png`,
  307×263, real pixels, leftovers: title/?/bottom-button). Ran both: (a) direct interior-cut keeps
  authentic grit+scale but leftovers remain (`C-direct-on-body-native.png`); (b) gpt-image-1.5 cleaned
  leftovers + hollow but UPRES SMOOTHED the grit / genericized border (`C-img2img-cleaned.png`).
  Trade-off mapped: grit-with-leftovers vs clean-but-smoothed.
- 2026-06-18: BOTH C routes 0/5. "direct is just the same as my input; img2img produced vastly
  different style." User reminder: **the reference is still BLURRED (and/or scaled)** — the unaddressed
  ROOT problem. Every method so far either keeps the blur (direct) or fixes blur by restyling (img2img).
- 2026-06-18: PIVOT — the missing capability is **style-preserving SUPER-RESOLUTION** (deblur/sharpen
  WITHOUT repainting style): Real-ESRGAN / Topaz class, NOT generative restyle. Env probe: Python 3.10,
  **RTX 4070 present**, pip reachable, but no ML pkgs installed. Local Real-ESRGAN is feasible & fast.
  ASKED user: local Real-ESRGAN (I set up) vs their own Topaz vs find sharper source first.
- 2026-06-18: User chose local Real-ESRGAN. SET UP: bootstrapped pip (was missing), installed
  torch 2.12+cu130 + spandrel on the RTX 4070 (CUDA True). Tool: `tools/upscale.py` (spandrel loader,
  not basicsr). Weights `assets-staging/sr-models/RealESRGAN_x4plus.pth` (anime_6B URL 404'd, TODO).
  RAN on Quest Log frame → `review/C-sr-x4plus-native307.png` + `-4x.png`. Sharper, STYLE PRESERVED
  (no restyle, unlike img2img). Leftovers (title/?/button) remain (SR sharpens only). AWAITING user
  rating: does style-preserving deblur clear the bar / is this the right direction?
- 2026-06-18: User: "feel something good about this upscaling step"; ref is blurred AND resized. Added
  TILING to `tools/upscale.py`; SR'd the FULL reference 4x → `assets-staging/sources/ref-sr-x4.png`
  (5760×3240). Comparison crops `review/D-cmp-*` show clear style-preserving deblur on real panels.
  PROCESS DECIDED: SR is a one-time pre-process; all frame work now uses the sharp master (panels
  ~1100px not ~275px). NEXT options: (a) try anime_6B model for crisper; (b) rebuild Quest Log frame
  from the sharp master + native-res leftover cloning.
- 2026-06-18: User wants the FULL reference (no crop) downscaled to many sizes to find where the crisp
  pixel-art-1:1 feeling lives (high-res reads smooth). Decision: WORK at high-res, FINALIZE components
  at the user-chosen target size. Rendered `review/sizes/ref-w0360..2400.png` from the SR master.
  AWAITING user's pick of the target native size (will render more around it if needed).
- 2026-06-18: Size sweep 1200-2400 (80px). User: **1680 is crispest** — both higher AND lower give
  blurrier lines; 1680 has very crisp thin 1px lines. = pixel-grid ALIGNMENT (ref's 1px lines land 1:1
  on output pixels at 1680; straddle/anti-alias elsewhere). Implies art's true native res ≈1680 (the
  1440 source was itself slightly downscaled). PROVISIONAL MASTER SIZE = **1680** (`review/sizes/ref-w1680.png`).
  Caveat: full-dashboard resonance; per-component optimum may differ slightly. VALIDATE on a real frame.
  Workflow: work at high-res SR master (5760), finalize each component at ~1680-equivalent (grid-aligned).
- 2026-06-18: Locked 1680 PROVISIONAL master → `assets-staging/sources/ref-master-w1680.png`. VALIDATED
  on a real frame: Quest Log panel cropped from it (`review/E-questlog-sharp-1680.png`, ~368×~290, bottom
  bound TBD — long list) is crisp (header/border/ornaments). Pipeline now: SR full ref → 5760 master →
  1680 honest master → crop frames sharp. NEXT: turn Quest Log into a component (remove interior content
  + leftovers title/?/View-All-Quests button). DECISION PENDING: cleanup via user hand-clean vs Claude
  native-res cloning vs both; confirm 1680.
- 2026-06-18: 1680 APPROVED as provisional+rerunnable (SR master is the fixed artifact; re-slice any size later).
  User: hand-cleaning hard because "the composition mixes everything" (blend/entanglement, not blur).
  Tried crude clone-clean (`review/E-questlog-cleaned-*`) → ROUGH (header column-clone smears; edges catch
  neighbor/action-bar). CONCLUSION: content-removal from the entangled composition is the remaining hard
  problem (blur is solved). PIVOT: **LaMa inpainting** (local, GPU, native-res object removal + plausible
  fill, keeps real pixels, NO restyle — unlike OpenAI edits which resample to 1024 & re-smooth). Workflow:
  rough-mark regions to remove (title/?/button/list) → LaMa reconstructs chrome/interior. Same playbook as
  Real-ESRGAN. NEXT: set up IOPaint/LaMa (pending user nod) vs user hand-clean the now-sharp source.
- 2026-06-18: User nodded. SET UP LaMa via `simple-lama-inpainting` (swapped opencv→opencv-python-headless
  for libGL). Tool: `tools/inpaint.py <img> <mask> <out>` (white mask = remove). RAN on Quest Log panel
  (`assets-staging/sources/ql-panel.png` from 1680 master + `ql-mask.png`) → `review/E-questlog-FRAME-clean-1680.png`.
  RESULT: clean frame — REAL sharp gritty border/corners/header band; content (list/title/?/button) removed;
  interior = LaMa smooth fill (replace w/ our body); bottom-frame center reconstructed (corners real). FIRST
  clean frame from the real reference at native size. AWAITING user judgment on border quality → then
  cut interior transparent → 9-slice → integrate as the first component.
