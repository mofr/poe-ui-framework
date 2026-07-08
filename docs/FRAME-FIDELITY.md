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
6. **Review images live in the repo (`asset-review/`, tracked), NEVER `/tmp`.** The user must be able to see
   every candidate, and nothing should be lost while we converge. Index in `asset-review/README.md`.

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
- **Step 4 — Integrate & lock.** `tools/process-assets.mjs <name>` (trims + prints the 9-slice
  inset) → add a `data-frame` rule in `src/styles/poe-panel.css` with the measured `--slice`/`--band`
  → story in `src/stories/` → `.shot.mjs` screenshot → user's final sign-off → commit.
- **Step 5 — Scale.** Only after the frame is locked: repeat per component, consistent palette.

## Methods ledger (NEVER silently drop a row — update status, don't delete)
| Method / model | Style/feel (user 1–5) | Transparency | Status |
|---|---|---|---|
| `gpt-image-1.5` + ref crop + text prompt | 1/5 (too massive, not the feel) | clean RGBA ✓ | weak on feel; keep for img2img variant |
| `gpt-image-2` / `-2026-04-21` | untested by user | opaque ✗ | REVISIT via magenta keying — may win on feel |
| `chatgpt-image-latest` | untested | unknown | blocked on OpenAI org verification |
| ChatGPT app (manual, user-steered) | > API but "not the feeling" | manual magenta export | candidate B |
| Direct extraction — mirror-assembled tiles | ≤3/5 (user) | by source bg | `asset-review/B-extracted-mirrored-*`: good local pixel crisp; BAD: corner captured whole composition (shadows/neighbor), corner→edge transition "just cut" (rough seams), vertical-flip inverts light. Superseded by ring method. |
| Direct extraction — REAL continuous panel border ring | **0/5 (user, neutral)** — DORMANT, keep | by source bg | `asset-review/B2-*`: 9-slice the actual Repo Overview panel border. CLEAN header+top-corners but bottom edges/corners bleed map. User verdict: "it's just not a frame — the original is a composition of many little things, simple cropping is impossible." Approach parked, NOT discarded (may revisit). |
| **USER-CLEANED reference → AI/direct** (NEW, to try) | untried | n/a | User manually conceals non-relevant elements (map, title text, icons, +/- buttons, neighbors, inter-panel shadow) in an editor → clean isolated frame on magenta/transparent. Then: (a) direct process/slice by Claude, AND (b) img2img anchor for gpt-image-1.5 to sharpen/complete keeping the feel. Removes the entanglement that blocked everything. "Try all options." |
| **HYBRID (recommended next):** extract authentic CORNERS + header from ref; SYNTHESIZE thin edges + stone body; compose as layered component | untried | clean by construction | Plays to strengths: extraction for the rich hard-to-fake pieces (clean), generation/procedural for the simple repeatable thin edges + body where extraction fails. Distinct real corners → asymmetry. + separate shadow layer for integration. |
| `gpt-image-1.5` IMG2IMG anchored on real panel + SUBTLE-target prompt | awaiting user rating | clean | `assets-staging/frame-img2img-subtle.png` — looks far closer to ref's restrained style; header text baked in. |
| Asset packs (Moon Tribe, Vill8tion, Nexa, Mytherra) | -99/5 (user) | n/a | REJECTED: bland/cheap, miss the ref's painterly AI-art richness. Dead route. |
| **VECTOR-PATH MASK (user idea, BUILT 2026-06-19)** | **WORKING — first extracted frames** | clean AA by construction | User traces the frame boundary as polygon contours ONCE (their scarce contribution = spatial truth, not yes/no); stored normalised in `tools/masks/<name>.json`; Claude recuts crisp at ANY resolution. Tooling: `tools/mask-editor/` (clicker, `npm run mask`) + `tools/cut-mask.mjs` (rasterise+apply, op keep/hole) + `tools/inpaint-mask.mjs` (op:inpaint → LaMa). DELIVERED `basic-frame-a` (combat log, button inpainted) + `basic-frame-b` (contribution-health, traced as separate corner+edge contours) as PoePanel frames. Remaining LIMIT: clean polygon edge may read "cookie-cutter" on the gritty OUTER edge → fix via path→trimap→alpha-matting (ViTMatte) if needed. |
| **ChatGPT-5.5 as a LOCAL AGENT (user trial, 2026-06-19)** | outer crop 4/5; 9-slice 1/5; integration 0/5 (user) | n/a | `gpt-5-5-ref-extract-1` — GPT drove extraction of the common/Activity-Feed panel from `reference-1680.png`. Notes in `asset-review/gpt-5-5-ref-extract-1-notes.md`; kept images in `asset-review/gpt-5-5-ref-extract-1-*`. GPT's own verdict: outer crop close but off a few px; 9-slice edges behaved strangely; separated integration layers worse than the frame. **DO NOT re-add to PoePanel as-is** (GPT). Next attempt: fix outer-crop bounds, then 9-slice geometry, before integration. Contrast: the mask-editor path got a clean frame on the same target — vector cut > GPT auto-9-slice here. |

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
- 2026-06-18: Extraction v2 = REAL continuous panel-border RING (`asset-review/B2-*`). Fixes seams (real
  contiguous corners/edges) + asymmetry. Finding: CLEAN for header+top-corners (rich parts), BLOCKED
  for thin edges+bottom-corners (content bleeds to the few-px frame). Pure extraction can't make a
  full clean frame here.
- 2026-06-18: → Proposed HYBRID: extract authentic corners+header from ref, synthesize thin edges +
  stone body, compose layered (w/ shadow layer). AWAITING USER GO/feedback.
- Workflow fix: all review images now in repo `asset-review/` (tracked), 1:1 native (no upscaling).
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
  Screenshots `asset-review/layout/pfl-{nine-slice,decorated,variants}.png`. AWAITING user judgment.
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
  knob, outset = overhang knob, independent. Screenshots `asset-review/layout/pfl-*.png`. AWAITING user code
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
  types, not frames). Screenshot `asset-review/layout/pfl-debug.png`. AWAITING user code review + judgment.
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
  stone bg. Stone bg KEPT for future artistic iteration. Debug screenshot residue (asset-review/layout/)
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
- 2026-06-18: USER delivered hand-cleaned QUEST LOG frame (`asset-review/C-user-cleaned-quest-log.png`,
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
  RAN on Quest Log frame → `asset-review/C-sr-x4plus-native307.png` + `-4x.png`. Sharper, STYLE PRESERVED
  (no restyle, unlike img2img). Leftovers (title/?/button) remain (SR sharpens only). AWAITING user
  rating: does style-preserving deblur clear the bar / is this the right direction?
- 2026-06-18: User: "feel something good about this upscaling step"; ref is blurred AND resized. Added
  TILING to `tools/upscale.py`; SR'd the FULL reference 4x → `assets-staging/sources/ref-sr-x4.png`
  (5760×3240). Comparison crops `asset-review/D-cmp-*` show clear style-preserving deblur on real panels.
  PROCESS DECIDED: SR is a one-time pre-process; all frame work now uses the sharp master (panels
  ~1100px not ~275px). NEXT options: (a) try anime_6B model for crisper; (b) rebuild Quest Log frame
  from the sharp master + native-res leftover cloning.
- 2026-06-18: User wants the FULL reference (no crop) downscaled to many sizes to find where the crisp
  pixel-art-1:1 feeling lives (high-res reads smooth). Decision: WORK at high-res, FINALIZE components
  at the user-chosen target size. Rendered `asset-review/sizes/ref-w0360..2400.png` from the SR master.
  AWAITING user's pick of the target native size (will render more around it if needed).
- 2026-06-18: Size sweep 1200-2400 (80px). User: **1680 is crispest** — both higher AND lower give
  blurrier lines; 1680 has very crisp thin 1px lines. = pixel-grid ALIGNMENT (ref's 1px lines land 1:1
  on output pixels at 1680; straddle/anti-alias elsewhere). Implies art's true native res ≈1680 (the
  1440 source was itself slightly downscaled). PROVISIONAL MASTER SIZE = **1680** (`asset-review/sizes/ref-w1680.png`).
  Caveat: full-dashboard resonance; per-component optimum may differ slightly. VALIDATE on a real frame.
  Workflow: work at high-res SR master (5760), finalize each component at ~1680-equivalent (grid-aligned).
- 2026-06-18: Locked 1680 PROVISIONAL master → `assets-staging/sources/ref-master-w1680.png`. VALIDATED
  on a real frame: Quest Log panel cropped from it (`asset-review/E-questlog-sharp-1680.png`, ~368×~290, bottom
  bound TBD — long list) is crisp (header/border/ornaments). Pipeline now: SR full ref → 5760 master →
  1680 honest master → crop frames sharp. NEXT: turn Quest Log into a component (remove interior content
  + leftovers title/?/View-All-Quests button). DECISION PENDING: cleanup via user hand-clean vs Claude
  native-res cloning vs both; confirm 1680.
- 2026-06-18: 1680 APPROVED as provisional+rerunnable (SR master is the fixed artifact; re-slice any size later).
  User: hand-cleaning hard because "the composition mixes everything" (blend/entanglement, not blur).
  Tried crude clone-clean (`asset-review/E-questlog-cleaned-*`) → ROUGH (header column-clone smears; edges catch
  neighbor/action-bar). CONCLUSION: content-removal from the entangled composition is the remaining hard
  problem (blur is solved). PIVOT: **LaMa inpainting** (local, GPU, native-res object removal + plausible
  fill, keeps real pixels, NO restyle — unlike OpenAI edits which resample to 1024 & re-smooth). Workflow:
  rough-mark regions to remove (title/?/button/list) → LaMa reconstructs chrome/interior. Same playbook as
  Real-ESRGAN. NEXT: set up IOPaint/LaMa (pending user nod) vs user hand-clean the now-sharp source.
- 2026-06-18: User nodded. SET UP LaMa via `simple-lama-inpainting` (swapped opencv→opencv-python-headless
  for libGL). Tool: `tools/inpaint.py <img> <mask> <out>` (white mask = remove). RAN on Quest Log panel
  (`assets-staging/sources/ql-panel.png` from 1680 master + `ql-mask.png`) → `asset-review/E-questlog-FRAME-clean-1680.png`.
  RESULT: clean frame — REAL sharp gritty border/corners/header band; content (list/title/?/button) removed;
  interior = LaMa smooth fill (replace w/ our body); bottom-frame center reconstructed (corners real). FIRST
  clean frame from the real reference at native size. AWAITING user judgment on border quality → then
  cut interior transparent → 9-slice → integrate as the first component.
- 2026-06-19: REFRAME (user insight) — "as a judge I only emit yes/no, but I see the whole picture; let me
  contribute the BOUNDARY itself." Re-derived the vector clipping-path / mask, + the good twist: store the
  curve NORMALISED in a plain file and recut at any resolution. Verdict: sound, not naive (it's the pro
  technique). BUILT the in-repo clicker (user chose build-a-tool over Inkscape): `tools/mask-editor/`
  (`server.mjs` static+save+list, `index.html` zoom/pan canvas: click=add point · drag point to move ·
  `del` remove · `n` new contour=hole · mask SELECTOR dropdown (`/api/masks`) + CONTOUR LIST panel (per-contour
  colour swatch, click to activate, ✕ to delete) · save→`tools/masks/<name>.json`. Curve model SIMPLIFIED
  twice on user feedback: Catmull-Rom (wobbled siblings — non-local) → cubic Bézier w/ handles (local but
  "too many complex handles") → **straight-segment POLYGON, no handles** (`path.mjs`): simplest, fully local,
  antialiasing comes from the rasteriser. Points are bigger (zoom for precision). Round 2 of polish (user):
  clicking INSERTS the point on the nearest edge (not append) once a contour has ≥3 pts; per-contour `round`
  (0..1 of width) FILLETS corners with arcs (the `smooth` slider) so 1 pt/corner gives a smooth bend — local,
  bounded by half each edge; per-contour `name` (corner/edge/…) editable in the contour list = first step
  toward the regions `kind`/`op` meta. Faint control-polygon guide shows points behind the rounding.)
  Round 3 (user): HOLES are now EXPLICIT per-contour `op: keep|hole` (was even-odd nesting) — frame band =
  keep outer + hole inner; cut-mask fills keeps white then punches holes black (no nesting/order subtlety),
  editor previews via an offscreen `destination-out` composite, hole outlines dashed. Per-contour `note`
  (free text, longer than name). Smooth slider moved INTO a per-contour details panel (op/smooth/note for the
  active contour) + squared mapping for fine low-end values; `+ contour` button moved into the list panel;
  `fit` grouped right with `save`; canvas image drawn NEAREST (`imageSmoothingEnabled=false`) so zoomed pixels
  stay crisp; `ctrl+z` UNDO (history snapshot before each point/contour mutation). Contour shape:
  `{points,name,op,note,round}` → directly the regions schema minus `kind`.
  Round 4 (user): VISIBILITY eyes — per-contour eye (toggles `c.hidden`) + master eye in the panel header +
  `h` shortcut, to check the original image without overlay. DISPLAY-ONLY: cut-mask ignores `hidden` (verified
  a hidden contour still cuts), so toggling never changes the asset. lucide eye/eye-off SVG icons.
- 2026-06-19: FIRST FRAME via the mask editor. User traced `combat-log-frame` (tools/masks/combat-log-frame.json:
  keep outline + 2 holes [interior, a button covering the edge]) on the 1680 master. Cut → trimmed to 454×306
  (`asset-review/cut-combat-log-frame.png`) → placed `src/assets/panels/panel-combat-log.png` → wired as
  PoePanel frame `combat-log` (data-frame rule: band/slice 44 = corner ornament extent, surface-radius 0,
  edge-repeat stretch [thin continuous double-line bar], overhang 0 [raster trimmed to frame outer edge];
  added to Frame type + Playground options + a Gallery cell). Rendered check (`asset-review/combat-log-in-panel.png`):
  TOP CORNERS clean — filigree brackets fully contained in the slice, continuous corner→edge transition, no
  clip/bleed. KNOWN leftover (user said ignore for now): bottom band still has the baked "View Full Log"
  button+text (stretched) — needs LaMa inpaint or an op:inpaint region. AWAITING user review in Storybook.
- 2026-06-19: INPAINT op added to the pipeline (user: "the button covering the edge isn't part of the frame,
  remove it completely" — a hole leaves a gap; reconstructing the edge behind it = inpaint). Third contour
  intent `op: 'inpaint'` (besides keep/hole). New `tools/inpaint-mask.mjs`: rasterises op:inpaint contours →
  white mask (grow ~4px for AA edges) → LaMa via tools/inpaint.py → cleaned plate, auto-cropped back to source
  size (LaMa pads to mult of 8). `cut-mask.mjs` now IGNORES inpaint contours in the silhouette (they're recon
  instructions, not geometry). Editor: `inpaint` option in the per-contour `do` menu + red wash. Flow:
  `node tools/inpaint-mask.mjs <mask>` → `node tools/cut-mask.mjs <mask> --src=<cleaned plate>`. Applied to
  combat-log: button + "View Full Log" text removed, bottom edge reconstructed as a continuous double-line
  matching the other 3 sides; re-cut → updated `panel-combat-log.png` (452×306). Now a complete closed frame
  in PoePanel at both aspect ratios (`asset-review/combat-log-in-panel.png`). AWAITING user review in Storybook.
  + `tools/cut-mask.mjs` (even-odd SVG → AA alpha via sharp, `--width`/`--feather`/`--src`/`--out`, recut
  any res from the stored normalised mask). `npm run mask`. Smoke-tested both pieces (native + 2x recut,
  alpha hole/band/outside correct; all server endpoints incl. traversal guard). Division of labour: USER
  traces boundary once (spatial truth); CLAUDE owns rasterise/apply/recut. NEXT: user traces a real frame →
  recut → rate the AA edge. Pair with LaMa for on-band content + missing geometry (path cuts, doesn't fill).
- 2026-06-19: KEY DIRECTION (user, why in-repo tool over Inkscape) — the mask file should be a DECLARATIVE
  DOCUMENT over the reference that drives the WHOLE pipeline from one source of truth, not just geometry.
  Target schema (grow INCREMENTALLY, one field as it earns its place — not all up front): wrap contours in
  `regions`, each `{id, kind: frame|button|surface|text|icon|accent…, op: keep|inpaint, contours:[outer+holes
  (even-odd)], slice:{top,right,bottom,left,repeat}}`. Then ONE `tools/build-assets.mjs <mask>` would: (1)
  union every `op:inpaint` region → single LaMa mask → cleaned plate (replaces hand-painting ql-mask.png in
  GIMP); (2) vector-cut every `op:keep` region FROM the cleaned plate at any res → asset PNGs; (3) emit 9-slice
  insets into asset-meta.json for CSS. Collapses today's scattered steps (hand-painted masks, separate slice
  measurement, separate cuts) into one annotated tracing session. `op:keep|inpaint` also encodes the path's
  limit (content painted ON the band = tag `inpaint`, LaMa clears it). Current `cut-mask.mjs` format already
  uses contour OBJECTS → forward-compatible; the regions layer is the next increment AFTER a geometry trace
  validates the UX.
- 2026-06-20: MILESTONE — first art successfully extracted from the reference (user: "simplest, but a step
  forward"). RENAMED `combat-log` → `basic-frame-a` (combat-log panel, button inpainted out) and added
  `basic-frame-b` (wide contribution-health panel; user traced it as SEPARATE per-corner + per-edge keep
  contours — the cut flattens them into one frame band; a stray full-rectangle `outline` keep was filling the
  interior, removed). Both wired as PoePanel frames (Frame type + poe-panel.css + Playground options + Gallery
  cells); `combat-log` wiring + `panel-combat-log.png` dropped. Renders `asset-review/basic-frames-in-panel.png`.
  basic-frame-a slice 44, basic-frame-b slice 24 (small corners). AWAITING user review in Storybook.
  GREEN BORDER Q (user): the bright green is the DEBUG surface's OUTER 2px edge-marker
  (`box-shadow:0 0 0 2px`, non-inset, at the box edge). It's display-only debug; the surface FILL stays under
  the frame. It peeks out because basic-frame-* use overhang 0 (frame outer edge = box edge), so the 2px ring
  spills just past it. Real surfaces (stone/leather) have no ring → nothing shows. Not a leak. FIXED per user:
  changed the debug marker to `box-shadow: inset 0 0 0 2px` → now the INNER 2px of the surface, never spills
  outside the frame (bright, easy to spot the surface edge when tuning slices).
  BACKGROUND now SWAPPABLE: moved the blueprint/gallery backdrops into a Storybook toolbar dropdown
  (`globalTypes.bg` + one global decorator in `.storybook/preview.jsx`: blueprint/dark/stone/plain); removed
  per-story `onBlueprint`/`onGallery` decorators (Gallery defaults to `dark` via `parameters.bg`). Net less code.
  GPT-5.5 local-agent trial logged in methods ledger (NOT wired per GPT's own note).
- 2026-06-20: Iteration. (1) Re-cut `basic-frame-b` from the user's updated mask (corners re-traced; 914×191).
  (2) RENAMED the generated drafts `frame-a/b` → `draft-frame-a/b` (vs the extracted `basic-frame-a/b`): keys
  in poe-panel.css, Frame type, story (Gallery cells + Playground options + LayerContract args/assert), asset
  files `panel-frame-2/3.png` → `panel-draft-frame-a/b.png`, ASSETS.md. (3) Mask editor: added `new` (reset to
  empty mask) + `delete` (removes the current mask file via new server POST `/delete`) buttons. (4) High-res
  reference surfaced: editor image dropdown now floats reference-like images (ref-*/master/reference) to the
  TOP and lists sources before asset-review — so `ref-sr-x4.png` (5760×3240, the SR master, already on disk)
  is easy to pick for precise tracing (masks are normalised → a trace transfers between 1680 and 5760).
  NOTE (user-tuned, kept): basic-frame-a/b now surface-radius 4, overhang 2, edge-repeat repeat; basic-frame-b
  slice 34.
- 2026-06-20: Storybook/code cull (user): deleted not-properly-implemented components+stories — PoeTabs,
  PoeActionTile, the Layout/Shell set (PoeHeader, PoeApp, ActionBar) + Layout.stories; dropped PoeNodePreview
  (+ its node SVG paths) from PoeAssets; removed Foundations stories Colors + Iconography (kept Typography).
  PRESERVED per user: `.poe-title` text style + the display font (in poe-core.css, untouched). Kept
  PoeAssetIcon/PoeAssetPaths (PoeTag still uses them). Orphaned now (not deleted): `src/assets/nodes/*.svg`.
  Mask editor: added `100%` button (+ key `1`) next to `fit` — 1 image px = 1 screen px, centred.
  PREP for upcoming masks (backgrounds · button frames · panel integrations): pipeline already handles all —
  cut-mask/inpaint-mask take any mask + `--src`/`--out`; destination dirs exist (src/assets/{panels,buttons,
  backgrounds}); PoePanel already has per-frame `--src-integration-shadow/-specular` 9-slice slots. Conventions:
  backgrounds→backgrounds/, button frames→buttons/ (border-image like panels), integration layers→panels/ as
  `panel-<name>-integration-{shadow,specular}.png` wired in the data-frame rule. CAVEAT: integrations are SOFT
  gradients, not hard edges — cut with `--feather` (or keep them CSS); a crisp polygon won't suit them.
- 2026-06-20: REFERENCE RECONSTRUCTION story + multi-region masks. (1) New story `Reference/Reconstruction`
  (`src/stories/ReferenceReconstruction.stories.jsx`) — rebuilds the Interface-Mage dashboard from OUR
  framework (header, Repositories/Quest Log, react-stats, Contribution Health [basic-frame-b + green
  PoeSegmentBar], Coding Energy [blue], Combat Log/Activity Feed [basic-frame-a], Repo Overview, Pinned, ornate
  action bar). A living scratchpad to judge chrome IN CONTEXT; render `asset-review/reference-reconstruction.png`.
  (2) cut-mask gained `--each`: one trimmed PNG per KEEP contour (multi-region masks). Also fixed trim to
  re-decode the PNG so the alpha border is seen. (3) NEW `backgrounds` mask (7 regions: stone slab, foregrounds,
  panel interiors + a `cracks` inpaint) extracted via inpaint→`--each` to `asset-review/bg/` — small material
  SWATCHES (97×21…514×29). Left for review, NOT wired (tileable-vs-asis is a user call). (4) Re-cut basic-frame-a
  (now has integration-bottom-left/right keeps → little contact "feet" baked at the bottom corners; 465×313) +
  basic-frame-b (914×191). (5) Deleted `src/assets/nodes/*.svg`.
- 2026-06-20: PANELS + integration layer + tileable backgrounds + mask comments (user batch).
  • RENAMED `basic-frame-a/b` → `basic-panel-a/b` (masks + `panel-basic-panel-*.png` + CSS keys + Frame type +
    stories) — a mask with frame+integration is a "panel". • INTEGRATION moved OUT of the frame raster into its
    own layer: retagged the `integration-*` contours `op:'integration'`; new `tools/cut-panel.mjs` cuts FRAME
    (keep−hole) and INTEGRATION (op:integration, feathered) to a SHARED union bbox so they align as PoePanel's
    9-slice layers. basic-panel-a now 475×318 frame + `panel-basic-panel-a-integration-shadow.png` (bottom-corner
    contact shadows); wired `--src-integration-shadow`. NOTE: frame grew 465→475 incl. the feet area → slice 44
    may want a re-tune. • Integration PROP value `debug`→`on` (Integration='none'|'on'; it's a real layer now,
    default 'on'). • RECONSTRUCTION uses ONLY basic-panel-a/b (no draft frames), `integration:on`, surface
    `ref-panel`, bg `refstone`. • cut-mask `--each` (per-keep-contour) used to extract the 7 `backgrounds`
    regions; new `tools/make-bg-tiles.mjs` makes each a SEAMLESS 2×2 mirror tile from the inpainted plate →
    `src/assets/backgrounds/tile-<slug>.png`. Wired the clean ones: page stone → bg selector option `refstone`
    (`.storybook/preview.jsx`); panel interior → PoePanel surface `ref-panel`. • Mask files gained a top-level
    `comment` field + the editor has a comment textarea (server /save persists it).
  CAVEATS for user judgment: several traced bg regions overlapped UI/ornament (the foreground samples grabbed
  the blue bar; `basic panel background 3` grabbed gold corner art) → those tiles are contaminated, re-trace
  cleaner patches. CRACKS not yet integrated (deferred — mechanical crack overlay is risky + "sparingly" is a
  judgment call). Render: `asset-review/reference-reconstruction.png`.
- 2026-06-20: Fixes + page-frame. • OVERHANG SHIFT FIXED: cut-panel now sizes the frame to the FRAME's own
  bbox (not the frame∪integration union) — integration extended ~7px below the frame and was inflating the
  raster/shifting the 9-slice. basic-panel-a back to 452×305; integration cut to that same box (tip past the
  edge clipped). • `make-bg-tiles` BUG FIXED (user was RIGHT, tracings were clean): it cropped the contour
  BBOX (spilling into neighbouring UI); now it samples the LARGEST RECTANGLE INSCRIBED IN THE POLYGON
  (maximal-rectangle/histogram) → always inside the traced material. Regenerated all tiles. • page-frame
  integrated: the OUTER dashboard border (rounded-rect, full 1680×945, inpaint cleaned). Wired as Frame
  option `page-frame` (band/slice 40, stretch) + used in Reconstruction as a border-image WRAPPER div (PoePanel
  is fixed-size; a plain div border-image handles the tall auto-height dashboard). • Gallery basic-panel cells
  → surface `ref-panel` + integration on. • Reconstruction bg reverted to `dark` (refstone still flat).
  REF-STONE diagnosis (user: "doesn't look like stone, extremely repetitive"): the page bg is mostly FLAT
  dark — its stone CHARACTER is the cracks/imperfections, which backgrounds.json INPAINTS OUT; plus the tile
  is tiny + mirror-tiled (4-fold symmetry). FIX OPTIONS (proposed, not yet done): (A) scatter sparse cracks
  as a NON-tiling overlay (= user's "cracks sparingly"; restores character + breaks repeat) — recommended
  quick win; (B) GENERATE a tileable stone (material gen is OK, unlike the ornate frame); (C) offset-heal
  seamless instead of mirror; (D) large cover + vignette to mask repeat. CRACKS still deferred (ties into A).
- 2026-06-20: User-batch fixes. (1) Mask-editor HOTKEY GUARD now covers TEXTAREA + contentEditable (was
  only INPUT/SELECT) → del/f/n no longer fire while typing the comment box. (2) RENAMED `draft-frame-a/b` →
  `gpt-panel-a/b` (the earlier generated frames; assets + CSS + Frame type + stories). (3) RENAMED surfaces
  `stone`/`leather` → `gpt-stone-1`/`gpt-stone-2` (assets surface-gpt-stone-1/2.png + CSS + Surface type +
  stories). (4) INTEGRATION fix: cut-panel now sizes the FRAME to its own bbox (stable overhang, not in the
  frame raster) and the INTEGRATION to the frame∪integration UNION bbox (shares the frame's top/left/width so
  it registers, extends lower/wider so the contact feet aren't clipped — keeps position per the mask contour).
  basic-panel-a frame 452×305, integration 474×318; feet now render at the bottom corners (subtle dark, spills
  past frame). (5) REF-STONE solid-part refinement: make-bg-tiles now FLATTENS the low-frequency lighting
  gradient (crop−blur+mean) so the tile is uniform-tone — removes the contrast bands (user: "very contrast
  patterns"; root = page light falloff baked into the sample, the tone-distance issue). REMAINING: mirror-tile
  of a tiny thin inscribed sample still shows a repeating motif → needs a bigger clean trace, offset-tiling
  (no mirror symmetry), or generation. Cracks remain ON HOLD per user (solid part first).
- 2026-06-20: More fixes. (1) HIDDEN contours no longer editable — `hit()` skips `c.hidden` (was grabbing/
  moving/deleting hidden points). (2) INTEGRATION now renders OUTSIDE the frame: frame keeps its own bbox
  (overhang unchanged, not in frame raster), integration cut on the union bbox, and the integration-shadow
  layer gets its OWN larger outset via `--integration-overhang` (basic-panel-a: 16px) so the contact feet
  spill past the frame's bottom corners per the contour (verified). (3) REGENERATED all masks: basic-panel-a
  (frame+integration), basic-panel-b, page-frame, backgrounds tiles; NEW masks cut to asset-review for review
  — `cut-progress-bar.png`, `buttons/` (1 region), `text-labels/` (7 regions). (4) REF-STONE via GENERATION
  (user: reference too busy to sample a bigger area): gpt-image-1.5 (edits +ref = the clean flattened stone
  sample, flat-lighting prompt) → `asset-review/gen-ref-stone.png` (1024², uniform dark grain, nearly tileable
  — faint seam). Reads as stone, far less repetitive than the tiny mirror tile. AWAITING user judgment; if good,
  make seamless (offset-heal) + wire as bg/surface.
- 2026-06-20: Wired extracted button/progress-bar + typography + stone retry. (1) PROGRESS-BAR approved →
  `src/assets/panels/progress-bar.png` (808×38 thin rail, transparent interior); `.poe-segment-bar` now a
  9-slice border-image of it (slice 8) wrapping the CSS segments (the segments ARE the live fill — raster is
  just the rail). (2) BUTTON: hollowed the ornate "Issues" tile centre (kept 16px ornate border) →
  `button-ornate.png`; `.poe-button--ornate` = 9-slice border-image (slice 16, no fill) + CSS gradient fill
  behind. (3) TYPOGRAPHY (existing fonts were already Cinzel/IM-Fell/Inter — right family): matched labels —
  DISPLAY/title roles flipped GOLD→WHITE serif (gaearon/react are white serif, not gold caps); heading
  letter-spacing .07→.11em to match the wide gold caps "ACTIVITY FEED". First pass; other label roles
  (small-title, title-subtext, list-item-secondary) not yet individually tuned. (4) REF-STONE retry per user
  ("0/5, want smooth realistic clay-stone slab"): regenerated with a smooth-clay prompt → `gen-ref-stone-2.png`
  (smooth warm taupe clay slab, much closer; tile seam to heal). AWAITING judgment. Reconstruction re-rendered
  (`asset-review/reference-reconstruction.png`): ornate buttons + framed segment bars + white-serif titles.
- 2026-06-20: Batch. (1) PROGRESS-BAR segments now RASTER: mask has `segment 1/2` + `frame` + interior hole;
  extracted `segment.png` (28×23, the frame-interior hole was subtracting the segments → cut it WITHOUT the
  hole) + `progress-bar.png` (rail). PoeSegmentBar = 9-slice rail + `.poe-segment-fill` using the segment as
  `background-repeat:round` → integer segment count auto-fits width. Segment raster is BLUE; default green =
  `hue-rotate(-105deg)`, `blue` prop = native. (2) BUTTON: re-cut at 10% (border 9px) → removed the solid inner
  plate + fully cut interior + dropped the red-medallion smudge; `button-ornate.png` 9-slice (slice 9) + CSS
  fill. DELETED non-raster buttons (CSS variants primary/magic/danger/ghost/compact gone), REMOVED glow (base
  :hover/is-selected glow stripped; ornate hover/selected = brightness only). PoeButton = raster-only (ornate),
  old props swallowed. (3) PAGE-FRAME gap diagnosed: mask has NO `edge-bottom` contour (top/left/right only) →
  bottom-middle alpha = 0 = the gap. No comments exist in the mask file. USER must trace `edge-bottom`. (4)
  TYPOGRAPHY (live CSS, not raster): matched labels — display/title WHITE serif (gaearon/react), heading gold
  Cinzel CAPS wide (.11em), label → gold title-case (was grey uppercase). body/meta/number already matched.
  First pass; the user's literal-subtraction-diff fitness idea = a focused follow-up for pixel-precise tuning.
  (5) REF-STONE regen, model in filename (= gpt-image-1.5): `gen-ref-stone-gpt-image-1.5.png` — text-only (no
  ref, which had biased toward noise/desert), smooth polished clay-stone slab. AWAITING judgment; still needs
  seamless treatment. Other models (gpt-image-2, chatgpt-image-latest) gated on OpenAI org verification.
- 2026-06-20: Fixes + typography LOOP. (1) SEGMENTS: half-cut + loose gap fixed — `background-repeat:round`
  needs an explicit `background-size` (was `auto 100%` → round didn't engage → clipped last segment); now
  `24px 100%` + `round` = whole segments at every width; `.poe-segment-bar` padding 5/10→2/4 (tighter to rail).
  (2) PAGE-FRAME edge gaps at large size = `--edge-repeat:repeat` tiling a thin non-tiling line → set to
  `stretch`. Bottom edge still absent BY DESIGN (no `edge-bottom` contour — user must trace it). (3) TYPOGRAPHY
  refinement loop BUILT: `tools/font-fit.mjs` — renders each ref label's text in every candidate font/weight
  headless (our web fonts), binarises + stretches to the ref's box, scores by glyph-shape pixel-diff. RUNS, but
  the fitness is NOISY (~18–32%, unstable rankings; picks Cinzel even for the sans body line) — naive pixel-diff
  can't reliably pick a typeface (same wall as auto visual-judgment). Reliable signal = ASPECT (ref text is more
  condensed than ours → spacing guidance). NOT auto-applied (would regress body→serif); visual roles kept
  (titles white serif, headers Cinzel gold caps, body sans). Next: better fitness (grayscale/edge diff, baseline
  align) or human-pick family + auto-fit spacing. (4) OpenAI ORG VERIFICATION = one-time identity check (gov ID
  via Persona) at platform.openai.com → Settings → Organization → General → Verify; gates the newest models/
  features. We use `gpt-image-1.5` (in the filename); other image models need the org verified first.
- 2026-06-20: Batch. (1) SEGMENT padding now `--segment-pad` (default 1px) + PoeSegmentBar `pad` prop. (2)
  `blue` boolean → `variant` prop (clean choice): assets renamed `progress-bar-blue.png`/`segment-blue.png`;
  `variant='blue'` = native raster, `variant='green'` = TEMP hue-rotate of blue until its own mask is traced
  (different frame+segments). (3) TYPOGRAPHY now human-in-the-loop: `tools/font-compare.mjs` renders each ref
  label beside candidate fonts → `asset-review/type-compare-<label>.png` (5 sheets); USER picks the family per
  role, then font-fit.mjs auto-fits spacing. Sheets confirm the auto-loop's errors (Cinzel forces caps on the
  lowercase 'gaearon'; body line is sans not IM-Fell). (4) DROPPED RpgText/SvgRpgText + story (unused) + dead
  rpg-text.css (+ its PoeAssets import). (5) REF-STONE low-frequency colour field: `stone-lowfreq.png` =
  central core of the traced stone region, low-passed (8px→512 + blur) → faithful dark-warm page tone, no
  noise; wired as the `refstone` bg option (cover). (6) PAGE-FRAME gaps: edges measured CONSISTENT (~10px line,
  offset 0 on top/left/right) → no inpaint needed; gaps were `--edge-repeat:repeat` → now `stretch`. Bottom
  edge genuinely absent (no `edge-bottom` contour) — user to trace. (7) Reconstruction enlarged to 1680px wide
  for 1:1 comparison with the reference.
- 2026-06-20: Batch. (1) USER page bg `chatgpt-page-backgroun-by-user.png` (smooth dark-brown stone, 1254²)
  → `page-bg-user.png`, wired as bg option `userstone` + reconstruction backdrop. (2) BUTTON: removed the CSS
  gradient fill (the "inner rect") → `background:transparent`; raster ornate frame only, transparent centre.
  (3) edge-repeat DEFAULT is now `repeat` everywhere (base + segment bar + page-frame) per user ("default for
  all frames"). (4) BIG-INPUT extracted → `input-frame.png` (570×42 thin rounded) → `.poe-search--ornate`
  9-slice; used as the large search in the reconstruction header + a Foundations `Inputs` story. (5) PAGE-FRAME
  gaps DIAGNOSED: the left edge line has a 56px TRANSPARENT GAP before the bottom corner — the traced edge
  contours don't reach the corners (edges measured consistent ~10px, so not slice/repeat/inpaint). FIX = extend
  the edge contours to connect with the corners (user retrace). (6) TYPOGRAPHY per user's sheet picks: display/
  title/label → IM Fell English (added to the font import; `--poe-font-display` switched off the SC variant);
  headers → Cinzel `font-variant:small-caps` (all-caps with larger initial, matches the ref); display sizes
  bumped (gaearon 26, react 24). COLOURS sampled from labels + applied: title #e9e3d2, header #ba9b48, label
  #8d8464, body #a8a9a6, meta #84898c. body sans kept (user: closest option, not perfect). (7) DROPPED nothing
  new. Reconstruction reads much closer (`asset-review/reference-reconstruction.png`).
- 2026-06-20: (1) REF STONE baked into the reconstruction itself (`stoneBackdrop` div, `page-bg-user.png`,
  1:1 `repeat`, full-bleed via margin -80) — independent of the toolbar Background selector; reconstruction
  `parameters.bg='plain'`. (2) Background NO LONGER stretched: userstone selector option + reconstruction both
  use `background-size:auto` + `repeat` (1:1), not `cover`. (3) FONT-SIZE knobs: `--poe-fs-{display,heading,
  label,body,meta,number}` tokens in poe-tokens.css, applied to the role classes → tweak sizes there globally
  (stories still override per-instance inline). (4) ANSWERED: node placement = pixel EDGES/boundaries (the
  rasteriser fills a pixel when the path covers its centre, so trace the gridline between kept/dropped pixels);
  page-frame gap = drag the corner + edge end-nodes TOWARD each other in the editor until they overlap (no
  retrace into other content needed); the reconstruction OUTER frame is a plain border-image DIV (not a
  PoePanel — PoePanel is fixed-size, the dashboard is tall auto-height), inner panels ARE PoePanel.
- 2026-06-20: (1) PoePanel is now AUTO-HEIGHT — `.poe-panel__content` is `position:relative` (in normal flow,
  drives height); decoration layers stay `position:absolute;inset:0`. Removed the fixed 360×300 default. So it
  works as a container; the reconstruction's OUTER page-frame is now a real `<PoePanel frame="page-frame">`
  (auto-height), and inner panels dropped their fixed heights → size to content. (2) SEMANTIC TYPE: new
  `PoeText` component (`variant` → .poe-text-* role, `as` for the element); reconstruction uses it everywhere,
  NO inline font sizes. Sizes come from `--poe-fs-*` tokens (poe-tokens.css). (3) page-bg-user SUPER-RES'd
  (Real-ESRGAN 4× then back to 1254 via upscale.py) → smoother; applied + bg options 1:1 (`auto`/`repeat`, not
  `cover`). Stone baked into the reconstruction (`stoneBackdrop`), independent of the selector. (4) PAGE-FRAME
  GAPS CLOSED via new `tools/assemble-frame.mjs`: corners kept as real pixels in place; each edge REBUILT by
  stretching its cleanest 1-px line cross-section across the FULL side (overwriting the gap region where
  unrelated reference content broke the line) → continuous corner-to-corner lines (left-edge gap 56px→0). The
  "move the parts together" approach. Bottom still open (no `edge-bottom` contour, user-confirmed OK).
- 2026-06-20: (1) assemble-frame.mjs v2 — edges no longer STRETCHED (ugly/uniform); now TILE the longest
  CLEAN real run of each edge line across the side (real pixels, natural variation), corners real on top →
  gapless + natural. (2) Reconstruction: removed the artificial stoneBackdrop div; the page stone is now the
  OUTER PoePanel's SURFACE (`page-stone`) — proper layer model. New `page-stone` surface option (poe-panel.css
  + Surface type) using `page-stone-tile.png`. (3) TILING gradient concealed: `page-stone-tile.png` = the
  super-res'd user stone with its low-frequency gradient/vignette flattened 85% (crop − 0.85·(blur − mean)) →
  tiles without the periodic vignette (faint hairline seam remains; offset-heal if needed). (4) Inner panels
  show `ref-panel` surface again (verified — clearly dark-on-stone now). Reconstruction render
  `asset-review/reference-reconstruction.png` reads cohesive: gapless outer frame + stone surface + ref-panel
  inner panels + small-caps gold headers + IM Fell titles + raster segments/buttons.
- 2026-06-21: NAMING CLEANUP — surfaces/frames renamed to **appearance + number** (no provenance/source
  words), synced across filename ↔ CSS `data-*` ↔ TS union ↔ Storybook. SURFACES: `gpt-stone-1`→`cracked-stone-1`,
  `big-stone-2`→`smooth-slate-1`, `gpt-stone-2`→`worn-leather-1`, `ref-panel`→`solid-black-1`,
  `page-stone`→`matte-stone-1`, `page-stone-2`→`matte-stone-2` (+ backdrop `stone-lowfreq.png`→`matte-stone-soft.png`).
  FRAMES: `basic-panel-a`→`plain-dark-1`,
  `basic-panel-b`→`plain-dark-2`, `page-frame`→`ruled-gold-1`. `debug-r*`/`none` kept (functional states).
  Also `.poe-search`→`.poe-input`; PoeInput stories `Ornate`+`Plain`→one `Gallery`; PoeSegmentBar `Variants`→`Gallery`;
  fixed `LayerContract` invalid `surface:'stone'`→`cracked-stone-1`. PNGs `git mv`'d; tools/masks/* names left as-is.
- 2026-06-21: NAMING CLEANUP pt.2 — structure + components. (1) DIRS: moved non-panel art OUT of `panels/`
  → `assets/inputs/frame.png` (was `input-frame.png`), `assets/segment-bar/` (was
  `panels/progress-bar-blue`/`segment-blue`), `assets/buttons/ornate.png` (dropped redundant `button-`
  prefix). All PoePanel debug scaffolding now lives in ONE dir `panels/debug/` (folded the old top-level
  `assets/debug/` `debug-surface`/`debug-accent` in, under the owning component). (2) SEGMENT BAR: kept
  `variant:'blue'|'green'` but `green` is now its OWN baked asset (`fill-green.png` = blue fill via sharp
  `modulate{hue:-105,saturation:1.35}`); rail shared. No runtime recolour/hue prop. (3) BUTTON: variant
  system kept (`variant:'ornate'`, the one implemented; `.poe-button--ornate`); dropped dead
  `compact`/string-`variant` props; PoeButton stories → `Gallery`+`Playground` (click play-tests dropped,
  covered by Gallery). (4) BACKDROP dropdown renamed toolbar `Background`→`Backdrop` and Storybook's
  built-in Backgrounds disabled (`parameters.backgrounds.disable`) so there's a single control; items mirror
  the surface names + all surfaces present (incl. `smooth-slate-1`) + a `None` option; dropped the bogus flat
  `stone` colour. (5) MASKS left at their freeform semantic names (basic-panel-*, page-frame, big-input,
  progress-bar-big-blue-segmented, buttons/list/text-labels) — they carry valuable tokens (`blue`=variant,
  `panel`/`page`). (6) OUTPUT PATHS now stored IN each mask as an `out` field (string, or a contour-name→path
  map), read by all four cutters (cut-panel/assemble-frame/cut-mask/make-bg-tiles; `--out`/`--out-dir` still
  override, legacy `panel-<name>` is the fallback). Prefilled to the renamed assets: basic-panel-a→plain-dark-1
  (+integration), basic-panel-b→plain-dark-2 (added `build:assemble`), page-frame→ruled-gold-1, big-input→
  inputs/frame.png, buttons→buttons/ornate.png, progress-bar `frame`→segment-bar/rail.png + `segment 1`→
  fill-blue.png, backgrounds `basic panel background`→solid-black-1.png. cut-panel also derives the
  `[data-frame='…']` CSS-patch id from the frame's `out` basename.
- 2026-07-05: PAGE HEADER reconstruction (first full element brought to fidelity). Rebuilt to the
  reference's two-row header: full-height avatar (frame ring + inset image) on the left; top row =
  name/subtitle · centered search · notification cluster (bell/mail/user panel); bottom row = level orb +
  XP bar sharing the nav-tab rail. MEASUREMENT, not eyeballing: user authored
  `inspiration/ref-header-elements.mask.json` (normalized element boxes); `tools/dom-boxes.mjs` dumps the
  rendered DOM boxes normalized to the same 1680×945 master, diffed in px (all header elements within
  ~1–2px of the mask). `tools/shoot.mjs` = one-shot Storybook screenshot helper. Reduced permission
  prompts via gitignored `.claude/settings.local.json` (allow node/python3). TYPOGRAPHY: added a
  `subtitle` role (`--poe-fs-subtitle:18px` + `.poe-text-subtitle`, IM Fell serif, neutral default) so the
  header epithet decouples from the mis-scaled `meta` (11px) role — purely additive, nothing shared
  touched. Deferred as a separate slice: rename `meta`→`caption`, `display`→`title`, and make the
  Foundations catalog show true sizes. TEXT-vs-CONTROL boundary set: author-placed content = PoeText roles
  (title/subtitle/…); control-internal labels (nav tabs, level orb, XP bar, user menu) are
  **component-owned** typography, NOT PoeText (like PoeButton). Until those components exist they're stood
  in via a local `ctrl()` helper in the story. Still placeholder (raster out of scope this session): the
  avatar/orb/tab/bar frames and bell/mail icons.
- 2026-07-07: PoeInput (big search bar) brought to fidelity + integration wired. INTERNALS tuned to the
  reference "Search or jump to…" bar (measured off reference-1680.png): placeholder is an UPRIGHT neutral
  GREY serif (#92958f, was gold italic), soft dark text halo, warm-dark interior gradient (#17140d→#0d0b07,
  ref ≈ #14110a), warm gold search glyph (#b0905a), search icon 16→20, bar widened 460→560. FRAME 1:1 FIX:
  the raster's bronze band is only ~5px thick but the border-image sliced 12px — dragging the frame's
  TRANSPARENT interior cut into the border so the page showed through as an "ugly black strip"; now slice
  6 / 6px (strictly 1:1, repeat) with the padding-box fill starting exactly at the bronze inner edge.
  INTEGRATION: user traced an `op:integration` outline; switched build `mask`→`panel` (cut-panel emits
  frame + integration halo), out keys `frame`/`integration`. Rendered as a `::before` 9-slice behind the
  frame (inset:-8px to match the 8px spill, slice 14/14px 1:1) → seats the bar into the stone. NAMING
  CLARIFIED (user): integration is the soft transition halo = shadow AND/OR highlight, NOT only a "contact
  shadow"; renamed the tool default output `-integration-shadow.png`→`.integration.png` (cut-panel.mjs +
  build-mask.mjs) and rewrote the comments. PoePanel's two-layer `--src-integration-shadow`/`-specular`
  split kept (those names denote blend role — darken vs screen — legitimately); a fuller PoePanel var
  rename is available if wanted. AWAITING user judgment.
- 2026-07-07 (pt.2): Removed the never-implemented SPECULAR (highlight) integration layer + collapsed the
  remaining single layer's name to neutral "integration". Rationale (user): the shadow/specular split was
  a two-blend-mode design (darken + screen) but NO real specular raster ever existed (only debug
  placeholders); all real frames had `--src-integration-specular: none`. Easy to re-add later (isolated).
  Changes: deleted the 4 `PoePanel.debug-r*.integration-specular.png` placeholders; `git mv`'d every
  `*.integration-shadow.png`→`*.integration.png` (frame rasters); global rename `integration-shadow`→
  `integration` across CSS vars (`--src-integration`), classes (`.poe-panel__integration`), url()s, mask
  `out.integration` paths, story layer-lists; removed the `.poe-panel__integration-specular` div (tsx),
  its shared+display:none CSS selectors, and all `--src-integration-specular` decls; cut-panel.mjs/
  build-mask.mjs default output already neutral (`.integration.png`), comments rewritten (integration =
  the soft halo = shadow AND/OR highlight, never "shadow"). Reconstruction + PoePanel gallery verified
  (all frames+integration intact, zero console errors). NOTE on the INPUT integration: it renders but is
  near-imperceptible on the reconstruction's dark stone header (contact-shadow on dark ≈ no contrast);
  it's faithful — awaiting user call on whether to strengthen it for this backdrop.
- 2026-07-07 (pt.3): FIXED "integration invisible" — root cause was a LATENT BUG, not subtlety: the
  integration raster carries REFERENCE STONE pixels (measured RGB ≈ [25,19,11]) ≈ the page tone, and the
  runtime composited it with NORMAL blend (opacity 1) → same-tone-over-same-tone repaint = a no-op. The
  locked architecture had specified integration = a DARKEN layer, but the impl used normal blend. Fix:
  `mix-blend-mode: multiply` on the integration layer (PoeInput `::before` + PoePanel `.poe-panel__integration`)
  so the halo DARKENS the surface into a real contact shadow that reads on ANY backdrop. Now every panel
  visibly seats into the stone (contact-shadow recess) and the search bar reads as inset. User re-traced a
  slightly larger input integration outline (rebuilt: frame 569×41, integration 585×57, spill 8px). Verified
  across PoePanel gallery + PoeInput gallery + reconstruction: visible seating, zero console errors. If a
  future frame needs a HIGHLIGHT (screen) half, re-add a second integration layer with mix-blend-mode:screen
  (the removed specular slot) — the multiply layer is the shadow half.
- 2026-07-07 (pt.4): Input integration STILL invisible after multiply — real cause found via a red-halo
  probe: the `::before` was at `z-index:-1`, which buries it under the field's own opaque background
  (only a faint sliver of an 8px spill survived). Pseudo-element also wasn't a findable DOM node (user
  couldn't locate it). FIX: restructured ornate PoeInput to PoePanel's LAYER MODEL — real sibling spans
  `.poe-input__integration` (z1, multiply) and `.poe-input__frame` (z3), content raised to z2; the frame
  moved off the element border onto its own layer; wrapper kept as a NON-stacking-context (position:
  relative only, no z-index/isolation) so the multiply halo blends with the PAGE, not just the field fill.
  Result: with/without diff jumped 14.6k→27.3k changed px (max Δ 49→79) — a clearly perceptible contact
  shadow seating the bar into the stone; integration is now a real inspectable element. Plain variant
  untouched (no layers). Zero console errors.
- 2026-07-07 (pt.5): PoC — BACKGROUND-NEUTRAL integration via inpainting. To store the light-transfer
  (attenuation/highlight) instead of the reference stone pixels (which mismatch off-stone): LaMa-inpaint
  the input/panel OUT of the reference → flat baseline; re-cut integration from the clean plate (same
  code path ⇒ pixel-aligned); factor = observed/clean; write two neutral 9-slice maps — `*.integration-
  neutral.png` (black, α=darken, multiply) + `*.integration-highlight.png` (white, α=lighten, screen).
  Frame footprint excluded (bronze/stone read as false highlight) via the cut frame's alpha. Tool:
  `tools/integration-neutral.py <mask>`. Generated for PoeInput.big-input + PoePanel.slim-dark-1/2/4/5.
  Runtime: re-added the highlight layer (`--src-integration-highlight`, screen) to PoePanel + PoeInput;
  integration source is var-overridable per instance (old stone default; new = neutral via inline vars).
  STORY `PoC/Integration (neutral vs raster) › Compare`: each component × {old stone, new neutral} across
  5 backgrounds (page stone / warm / blue / green / parchment). Result: new preserves the backdrop hue,
  old bakes the stone — clearest on blue/green/parchment. Highlight component is real (α up to ~250 pre-
  exclusion) — validates the two-layer split. NOT yet the default; awaiting user judgment to productionize
  (swap each frame's `--src-integration` to the neutral map + set the highlight, re-cut). Caveats: minor
  LaMa noise in the maps (blurred); slim-dark-1 cell overlaps slightly in the story (cosmetic).
- 2026-07-07 (pt.6): Integration compare story reworked + convention fix (user feedback). (1) The "broken
  layout" was ONLY the story using frameScale=0.45 — that scales the raster off 1:1 AND drifts the ring
  (overhang scales, --integration-spill doesn't). Rebuilt at native 1:1 (frameScale 1): frame + integration
  now lock together. Verified committed panels were already consistent (rasters byte-identical to HEAD,
  spills 18/12/8 = raster-derived) and the reconstruction is untouched — no real panel bug. (2) Story now:
  7 backgrounds (repo textures matte-stone-1 / cracked-stone-1 / worn-leather-1 / smooth-slate-1 + solid
  blue/green/parchment), each COMPONENT as one ROW of three cells: old · stone raster | new · neutral |
  none. Parchment makes the win obvious: old bakes a dark border, new preserves the sheet. (3) CONVENTION
  FIX (user: empty `out` is intentional): build-mask default output now COLOCATES next to the mask
  (<mask-dir>/<name>.png) instead of repo root — so masks without `out` build correctly; reverted the `out`
  I'd added to slim-dark-5. Open aesthetic notes for productionization: neutral highlight (screen) rim is a
  touch strong on light backdrops; residual LaMa noise in the maps (blurred, not fully gone).
- 2026-07-07 (pt.7): PoC iteration on user feedback. (1) INPAINT REVIEW: integration-neutral.py now writes
  a sanity crop (plate on top, LaMa-clean below) to asset-review/integration-neutral/<name>.inpaint-check.png
  so the flat baseline is inspectable. Confirms LaMa removes the frame+shadow and fills plausible stone
  (faint interior ghosting, but that region is excluded). (2) BACKGROUNDS: added the reconstruction contexts
  to the compare story — solid-black-1 (panel surface), matte-stone-1/2, cracked-stone-2 — plus the existing
  textures + solids (10 total). solid-black-1 shows the integration is genuinely subtle on the near-black
  panel surface (as in the dashboard). (3) HIGHLIGHT "too bright" FIX: was normalising to white×alpha (blew
  out on light bg). Now EXTRACTS the actual added light delta = clip(observed−clean) — real intensity + hue —
  applied by screen (self-limits on bright backdrops). Widened frame-edge exclusion (MaxFilter 5→11) to drop
  bronze fringe hotspots. Parchment no longer washes; reads as a soft shadow with the sheet preserved.
  Knob: `--hi <k>` scales highlight strength. Remaining: residual LaMa noise in halos (tunable via blur).
- 2026-07-07 (pt.8): FOCUS ON INPUT (user: panels inpaint poorly — the reference UI is too dense to
  reconstruct a flat baseline between neighbours; the input inpaints near-flawlessly so it's the proof case).
  New diagnostic `tools/integration-viz.py <mask>` → asset-review/integration-neutral/<name>.pipeline.png:
  a labelled, spatially-aligned montage of EVERY step so the pipeline is eyeball-able: 1 reference crop ·
  2 traced contours (frame/hole/integration) · 3 frame cut · 4 integration observed (stone+coverage) ·
  5 inpaint mask · 6 LaMa clean plate · 8 factor=observed/clean (blue=shadow/red=highlight) · 9 surface mask
  (frame excluded) · 10 shadow α=1−factor · 11 highlight=delta×coverage · 12 result OLD|NEW|none over
  stone/blue/parchment (with frame). Reveals the input's integration is a genuinely subtle signal — factor≈1
  except a thin contact-shadow line at the bottom + a faint rim; inpaint baseline is clean for the input.
- 2026-07-07 (pt.9): Pipeline levers + separate-frame viz (input-focused). (1) PRECISE FRAME CUT: coverage
  = traced integration MINUS the frame footprint (was an approximate dilated raster) — exact & safe since
  the frame is a separate top layer. (2) NOISE LEVER `--pre-blur` (default 2.5): the shadow/highlight is a
  low-frequency field, but LaMa fill texture ≠ reference texture so the raw ratio is noisy — blurring both
  before dividing smooths the maps. Baked into integration-neutral.py + integration-viz.py. (3) Explained
  "step 8 only bottom": new RAW unmasked observed−clean frame (07) shows the bar is lit from above, so the
  only surface DARKENING is the bottom contact shadow; top/sides have ~no shadow (and the trace hugs the
  frame there) — physically correct, not a bug. (4) integration-viz.py now emits a SET of uniformly-sized,
  registered PNGs (asset-review/integration-neutral/pipeline-<name>/NN-*.png, 14 frames) to flip through
  for spatial checking, instead of one montage. LaMa panels still deferred (dense UI can't be flattened).
- 2026-07-07 (pt.10): Fixed pipeline-viz bugs found by user. (1) MAJOR alignment: the observed/clean crops
  were placed from the POLYGON frame bbox (570×42) while the raster is 569×41 → a 1px shift that both
  displaced step 4 AND misregistered the factor (dividing 1px-off images = noise). Now template-match the
  integration raster back into the reference (SAD 0.00, exact origin) and centre the frame within it.
  (2) Step 4 now shows INTEGRATION ONLY — the frame raster alpha is cut out (frame is a separate top layer),
  so you see just the halo (a thin bottom contact-shadow strip). (3) INPAINT MASK shrunk: was integration
  outline +6px (looked oversized); now +2px via `--mask-grow` (default 2), in both viz + generator.
  (4) Clearer labels + a RAW unmasked diff (07) that explains steps 8-11. Registration fix also cleaned up
  the factor/shadow noticeably. Input-only focus retained.
- 2026-07-07 (pt.11): ROUND-TRIP RECONSTRUCTION validation (user idea) + fixes. integration-viz.py now
  reconstructs the reference back — baseline → ×shadow(multiply) → +highlight(screen) → +frame — and diffs
  vs the reference (steps 15-20, each a separate registered file; metric excludes the interior search
  field, which is component content not part of this decomposition). Result: with the EXACT decomposition
  (pre-blur 0, frame-dilate 0) mean|diff| = **0.48/255** — essentially perfect; the only visible diff is the
  interior text/icon. So positioning + shadow/highlight math are correct. FIXES from what the test exposed:
  (1) the "miscut / doesn't stick to the frame" was `frame-dilate` gapping the halo off the frame — sweep
  showed error rising 0.48→1.39→1.67 per +2px; default now **0** in viz + integration-neutral.py (halo
  meets the frame exactly). (2) pre-blur is a noise/fidelity knob: 0.48(exact)→2.33(blur 2.5); the extra
  "diff" is the high-freq texture/noise we intentionally drop from the shadow. Input shadow α_max now 44
  (halo reaches the frame). Metric printed each run: `RECONSTRUCTION mean|diff| ...`.
- 2026-07-08 (pt.12): Two fixes from user review. (1) RECON DIFF now over INTEGRATION PIXELS ONLY
  (coverage-weighted; frame 20 masks the diff to the halo) — interior/frame excluded. Honest metric:
  0.72/255 exact vs 6.78/255 at pre-blur 2.5 (whole-image avg had diluted it to 2.33). The 6.78 sits at the
  shadow edge = the high-freq the blur softens; so pre-blur is now a clearly-measurable fidelity knob.
  (2) SPILL INTO OPENING fixed: was excluding only the frame BAND (transparent centre leaks the halo into
  the inner opening). Now exclude the ENTIRE frame interior — traced frame outer outline (viz) / binary_fill_holes
  on the band (generator). Coverage is a clean ring, opening stays empty. Input maps regen (shadow α 44).
  Open decision: pre-blur value for the input (0 = pixel-exact/noisier, ~2.5 = smooth/6.78 halo error).
- 2026-07-08 (pt.13): User caught a real measurement flaw + the "lightens on dark bg" bug. (1) The
  reconstruction-on-clean metric is NEAR-TRIVIAL — clean×(obs/clean)=obs reproduces the reference whether a
  halo is encoded as shadow or highlight — so 0.82/255 did NOT prove background-neutrality. Also the metric
  was coverage-WEIGHTED (diluting edge error); fixed to a binary integration-mask straight accumulation
  (prints pixels/accumulated|err|/mean/max). (2) Added a BACKGROUND-NEUTRALITY measurement: apply the
  integration to dark/mid/light bgs, report net luma (want <=0 for a shadow), brightest spot, and % of
  pixels that lighten. It exposes the bug: WITH highlight, on a dark bg 14% of halo px LIGHTEN, brightest
  spot +22 — LaMa baseline noise (obs>clean spots) becomes a `screen` highlight, and screen lightens hard
  on dark backgrounds → the visible bright specks. Measured halo balance: mean obs 11.2 vs clean 13.8 →
  genuinely a SHADOW (69% shadow / 30% noise-highlight px). FIX: input integration is now SHADOW-ONLY
  (--hi 0). Shadow-only → net darkens on all bgs, brightest spot +0.0, 0% lighten. Committed input maps
  regenerated shadow-only (pre-blur 1). Likely implication: highlight should be OPT-IN (only a verified lit
  rim), not default — screen-on-dark + LaMa noise makes it a net liability otherwise.
- 2026-07-08 (pt.14): Added SIGNED diff map (frame 20: red=recon too light, blue=too dark) — user was right,
  it showed a red ring hugging the frame = shadow UNDER-applied at its darkest point (recon too light).
  Two causes found + fixed: (a) PRE-BLUR bled the bright frame bronze into the halo → inflated obs/clean →
  weak shadow at the frame edge. Fix (viz + generator): replace the frame footprint with clean stone BEFORE
  blurring. Dropped mean 2.85→2.22. (b) residual ring is the blur itself softening the sharp contact-shadow
  onset — at pre-blur=0 the diff is essentially flat (mean 0.94, ring gone). Also switched the frame mask to
  a HARD exact footprint (binary_fill_holes) so darken isn't multiplied down next to the frame. Committed
  input maps regenerated shadow-only + pre-blur 0 (accurate). Net on dark/mid/light bg = -2.9/-11.8/-42.6,
  0% pixels lighten. Remaining tension: pre-blur denoises but softens the shadow edge (ring); pre-blur 0 is
  exact but keeps LaMa texture noise. Sharp-edge-preserving denoise (edge-aware) is the next lever if needed.
- 2026-07-08 (pt.15): Corrected my shadow-only mistake (user caught it). The "highlight" is NOT noise —
  it's a REAL lit rim at the BOTTOM (the frame's illuminated bottom edge spilling light onto the stone
  below; obs>clean there). Per-region measure: below-frame highlight max +18 (37% px) vs above-frame +3
  (22%) — highlights genuinely live at the bottom. Shadow-only left that rim TOO DARK (the 22% too-dark /
  min -18 I'd earlier dismissed). RESTORED shadow+highlight, NO blur: reconstruction mean 0.94→**0.37/255,
  max 5** — best yet, because the bottom rim now reproduces. On dark bg the rim correctly lightens ~8% of
  px (up to +16.8) — that IS the reference's lit bottom edge, not an artifact. Committed input maps: shadow
  + highlight, pre-blur 0. Also fixed the diff colormap (was pink/purple; now gray=0, pure RED=too light,
  pure BLUE=too dark). Earlier "no blur" note stands: the user wants no blur; pre-blur 0 is the config.
- 2026-07-08 (pt.16): Applied the full pipeline to PANELS (slim-dark-1/2/4/5): shadow+highlight, no blur.
  Fixed the viz to register/reconstruct against the INPAINTED PLATE (panels were cut from it, not the raw
  ref) — registration SAD 0.00 for all. Reconstruction on integration mask: slim-dark-1 mean 1.47/max 30,
  slim-dark-2 2.58/56, slim-dark-5 6.60/118 (worse = LaMa on dense UI + `screen` under-reconstructing bright
  highlights). Compare story (re-rendered): NEW panels preserve the backdrop well — on parchment OLD bakes a
  dark stone box, NEW keeps the sheet + a soft contact shadow; on solid-black-1 clean, no dominant specks.
  CAVEAT: panel highlights are much brighter than the input's (rgb 190-226 vs 32) — likely LaMa artifacts
  from the dense UI; neutrality flags bright spots on dark bg (+45, 19% px) though they don't dominate
  visually. slim-dark-5 is the weakest. Committed panel maps regenerated. AWAITING user's story review.
- 2026-07-08 (pt.17): Per-mask integration method (user: keep panels as-is, input=neutral, minimal debt).
  Added optional mask field `integration: "neutral"` (absent ⇒ legacy stone raster). build-mask.mjs: after
  the normal frame+raster build, if integration==neutral it also runs integration-neutral.py. Runtime source
  is chosen in the component CSS (single, obvious place): PoeInput.css now references the neutral maps
  (shadow neutral + highlight), panels keep referencing their stone `*.integration.png`. Neutral generator
  default pre-blur 2.5→0 (no blur, user-chosen). Verified: input renders the neutral halo at runtime (subtle
  contact shadow + bottom rim), panels unchanged, zero console errors. NOTE: the panel *.integration-neutral/
  *.integration-highlight maps from pt.16 are now PoC-only (compare story), not runtime — candidates for
  cleanup if we trim the compare story to input-only.
- 2026-07-08 (pt.18): Wired input to neutral at runtime + additive highlight + PoC cleanup. (1) Dashboard
  input was still on the legacy stone raster (non-composable) while the gallery matched — root cause: the
  runtime source is the component CSS, and I'd only switched it in the compare story. Fixed: PoeInput.css
  now references the neutral maps by default → dashboard + gallery identical. (2) HIGHLIGHT blend screen→
  ADD (mix-blend-mode: plus-lighter) in PoeInput + PoePanel: the map stores literal added light (obs−clean),
  so base+delta reproduces the reference exactly (recon 0.37→0.35). (3) CLEANUP of PoC garbage: deleted the
  IntegrationCompare story, the panel *.integration-neutral/-highlight maps (panels stay raster), and the
  11M asset-review/integration-neutral diagnostics. KEPT: tools/integration-neutral.py + integration-viz.py,
  the input's runtime neutral maps, the composable highlight layer in PoePanel (infra for future neutral
  frames), and the `integration: neutral` mask field. Zero console errors across dashboard/input/panel.
- 2026-07-08 (pt.19): FIXED "big dark box around dashboard input" (user was right — real bug, panel nesting).
  Cause: the additive highlight uses mix-blend-mode: plus-lighter, which is only defined INSIDE an isolated
  group. PoeInput was deliberately NON-isolated (pt.4, so its multiply reaches the page) — fine standalone
  (gallery), but nested in the panel's isolated context the plus-lighter layer painted a dark rectangle the
  size of its group. Wiring probes all read correct (neutral map, multiply+plus-lighter, stone png never
  fetched) because the sources/blends WERE right — the defect was purely plus-lighter compositing without
  isolation. FIX: isolation:isolate on .poe-input--ornate. Toggling the highlight layer off removed the box
  (confirming culprit); isolate-input also removed it while keeping the shadow. Verified: dashboard box gone,
  gallery unchanged, shadow/rim still seat the input, zero console errors. Lesson: plus-lighter/plus-darker
  REQUIRE isolation — if PoePanel ever emits a neutral highlight, its highlight layer needs the same.
- 2026-07-08 (pt.20): Reverted the isolation mistake + robust highlight blend + naming cleanup (user).
  (1) plus-lighter (pt.18) was the real cause of the dashboard dark box — it's only defined inside an
  isolated group and rendered as a dark rectangle when the input (deliberately non-isolated) was nested in
  a panel; isolation:isolate (pt.19) then broke the shadow (over-dark) and lost the rim. FIX: dropped
  isolation, highlight blend plus-lighter→SCREEN. screen is a standard separable blend that works in ANY
  nesting context and browser (no isolation needed) — removes the box robustly. Trade-off vs additive:
  screen slightly under-adds very bright rims, negligible for the input's subtle rim. (2) NAMING (user:
  shadow layer was unlabelled + file said "neutral"): renamed the shadow LAYER/var/file to say SHADOW
  everywhere — .poe-{input,panel}__integration-shadow (multiply) + __integration-highlight (screen);
  --src-integration-shadow + --src-integration-highlight; input maps *.integration-shadow.png +
  *.integration-highlight.png (was the confusing -neutral). Panels' shadow layer now points at their legacy
  stone *.integration.png via --src-integration-shadow. Verified: dashboard box gone, panels/gallery render,
  zero console errors. NOTE for user: hard-refresh — the box likely persisted in your browser because
  plus-lighter is browser-fragile; screen is universal.
- 2026-07-08 (pt.21): ROOT-CAUSE fix for the dashboard integration (user chose NORMAL-composite). CSS
  mix-blend-mode only reaches the backdrop within its own stacking context, so nested in the panel the
  input's halo could never blend with the stone surface → shadow survived (black multiply == plain
  composite) but the rim (screen/add) vanished ("dark, no highlights"). FIX: drop mix-blend-mode on the
  input's halo layers — plain NORMAL composite works through any nesting. Shadow = black-α map (darkens by
  1−α, still background-neutral, identical look). Rim = BAKED warm-white [215,200,170] with α = rim-
  brightness/185 (generator write_gray) — reproduces the reference rim AND lifts a brighter dashboard stone
  (the reference's own lit-stone colour is darker than matte-stone-2 and would have darkened it). Verified:
  dashboard == gallery now (shadow + subtle rim, no box), zero console errors. Also: the stone
  integration.png had gone missing (broke the generator's `observed`); build-mask recreated it. Note: panels
  keep multiply (their stone map isn't black, so multiply≠normal there). Trade-off accepted: the baked rim
  is warm/fixed, so on a wildly different backdrop it tints slightly — fine for the input's stone home.
- 2026-07-08 (pt.22): Consolidated input integration to ONE layer + ONE map (user Qs). (1) The three files
  were: integration.png (stone raster WITH the frame — a build INTERMEDIATE, the generator's observed
  reference, not used at runtime) + integration-shadow.png + integration-highlight.png. (2) One layer is
  enough: per pixel the surface is EITHER darker (shadow) OR lighter (rim), never both, so a single RGBA
  relight map (black-α where it darkens, warm-α where it lifts) normal-composited does both. Collapsed the
  two-layer split (it only existed when shadow=multiply/rim=screen; both are normal now). Generator now cuts
  the OBSERVED crop to scratch (not the committed png) so integration.png can BE the single output — no
  stone intermediate committed. Runtime input files: PoeInput.big-input.png (frame) + .integration.png
  (combined relight). Reverted the -shadow/-highlight names → one .poe-{input,panel}__integration layer +
  --src-integration; removed the highlight layer/var/spans from PoeInput + PoePanel. Panels keep multiply +
  their stone integration.png. Verified: dashboard + gallery consistent, panels unaffected, zero console errors.
- 2026-07-08 (pt.23): Fixed the corrupted/"bigger lighter rim" from pt.22's consolidation. Bug: the combined
  map put black (shadow) and warm (rim) in one RGBA and blurred them TOGETHER — the shadow's black bled into
  the rim's warm, smearing + enlarging the rim (a warm glow hugging the frame, unlike the reference). The old
  two-layer blurred each map on its own, avoiding this. Fix: blur darken (ds) and hi_alpha (dh) SEPARATELY,
  then combine algebraically so one normal layer == "shadow then rim" exactly: α = ds+dh−ds·dh, rgb =
  warm·dh/α  (⇒ out = bg·(1−ds)(1−dh)+warm·dh). Reconstruction on the halo: mean|diff| 4.83→1.63, max
  42.9→6.8. Still ONE layer + ONE map; render now matches the reference (dark clean surround + subtle bottom
  rim) on both dashboard and gallery, zero console errors.
- 2026-07-08 (pt.24): Follow-ups after the commit. (Q1 blur) Blur is only a denoise for a NOISY LaMa
  baseline — the input's inpaint is clean, so blur=0 is now the default (reconstruction on the halo
  0.96 vs 1.63 at blur=0.6, visually identical); --blur=N stays as an opt-in knob. (Q2 frame-in-map) The
  panel integration map baked in the frame's own pixels (looked like a duplicate frame); cut-panel now
  subtracts the frame footprint so the map is only the surface halo. Both committed.
- 2026-07-08 (pt.25): PoC for NEUTRAL panel integration, isolated in a story (no live components touched).
  "Neutral" = store only the light-transfer (black shadow + warm rim), not the reference stone pixels, so
  the halo darkens/lifts ANY surface without dragging stone colour/texture. Only panels with a traced
  op:integration contour can go through the pipeline (slim-dark-1/2/4/5); slim-dark-3 (assembled, no contour)
  and debug-r* (no mask) can't until one is traced. New: src/stories/PanelIntegrationNeutralPoC.stories.tsx
  + src/stories/neutral-poc/*.neutral.png (generated at --blur=1.5). Story compares legacy stone×multiply vs
  neutral×normal across 6 backgrounds. Findings: (1) mechanism works — neutral map is a drop-in for the same
  9-slice geometry, wants NORMAL composite (going live = opt-in --integration-blend per frame). (2) Panels
  need blur (~1–1.5) — their LaMa baseline is noisier than the input's (blur=0 was speckly). (3) Neutrality
  confirmed: off-stone the legacy halo tints brown, the neutral stays a clean colour-neutral shadow. To
  polish before going live: blur value (crisp↔smooth) and --strength (neutral reads a touch weak vs legacy).
- 2026-07-08 (pt.26): PoC iteration (user eyeballing). (a) 3-way comparison on the REAL reconstruction
  surfaces (cracked-stone-2/matte-stone-2/solid-black-1) + foreign colours: old×multiply, old×normal,
  new×normal. Finding: old×normal is NOT identical to old×multiply (differs at the strong inner ring, mean
  1.9 light bg / 7.1 dark bg) — it paints stone opaquely off-stone, so the old map stays locked to multiply;
  the target is new×normal. (b) Fixed the neutral map's missing CONTACT ring ("1px transparent border at
  the frame"): the pipeline BINARISED the frame footprint (alpha>40 → hard exclude), so the frame's soft AA
  edge fully cut the darkest contact shadow. Now masks by the SOFT frame alpha (hard-fill the inner opening
  only) — matches cut-panel's `× (1−frameFill/255)`. Inner ring recovered (row-18 alpha 5→40, visible
  contact row-17 stays 241). (c) Full pipeline breakdown emitted to asset-review/…/pipeline-<name>/ (20
  stages) for eyeballing. Remaining polish: contact still a touch weaker than the stone map + a LaMa
  factor-noise dip — the crisp(blur 0)↔smooth tension. Live components still untouched.
- 2026-07-08 (pt.27): LaMa alternative — BG-BASELINE clean source (user idea: LaMa can't reconstruct clean
  stone under the dense reference, but we KNOW the surface we render). New `--baseline=<png>` in
  integration-neutral.py: tile OUR surface texture, tone-match per-channel to the observed's unshadowed
  stone, use as the clean baseline (skip LaMa). factor = obs/clean then isolates the shadow/highlight. The
  two stone TEXTURES differ, so pair with --pre-blur (used 3) to cancel them. PoC story now compares 3:
  legacy stone×multiply · neutral(LaMa) · neutral(bg baseline). Result: bg-baseline is noticeably CLEANER/
  smoother than LaMa (no reconstruction speckle), especially on foreign backgrounds. Maps:
  src/stories/neutral-poc/*.bgneutral.png (cracked-stone-2 baseline). Live components untouched. Knob to
  tune: --pre-blur (texture-cancel vs crispness). NOTE: the committed live input predates pt.26's soft-frame
  fix, so a future regen would slightly strengthen its contact ring (left as-is until approved).
- 2026-07-09 (pt.28): Three directives (user). (1) LIVE: panels' integration multiply → NORMAL — measured
  indistinguishable on the dark stone they sit on (reconstruction mean diff 0.29, 1.2% of px changed >8),
  and it drops the LAST mix-blend-mode in the system (everything is normal composite now → robust under
  nesting, matches PoeInput). (2) Dropped LaMa for panels entirely (can't reconstruct clean stone under the
  dense reference) — removed the LaMa PoC maps + variant. (3) bg-baseline was TOO blurred at pre-blur=3 →
  regenerated at pre-blur=1 (crisper contact, still cancels the texture mismatch, stays neutral off-stone).
  PoC story now a 2-way: legacy stone map vs bg-baseline neutral, both normal. Live reconstruction verified
  unchanged.
- 2026-07-09 (pt.29): Fixed bg-baseline blur (user: "still blurred" + "expected the BASELINE blurred, not
  obs"). Root cause explained: --pre-blur blurred BOTH observed and baseline; blurring the OBSERVED is what
  softened the shadow. The LaMa baseline was never blurred — LaMa rebuilt the MATCHING texture so it
  cancelled cleanly. Our surface is a DIFFERENT texture, so it can't cancel sharp; instead blur ONLY the
  baseline to a smooth ambient tone (new --base-blur, default 8) and keep the observed SHARP → factor =
  sharp obs / smooth tone = a CRISP shadow, no mismatch noise. Confirmed via a blur-both/baseline-only/
  neither comparison. PoC regenerated (base-blur=8, pre-blur=0): crisp neutral contact on every surface,
  clean off-stone. Also confirmed the INPUT pipeline is untouched (still LaMa; map unmodified since 6faba9a).
- 2026-07-09 (pt.30): Clarified + de-blurred (user). The bg pipeline IS the LaMa pipeline with ONE stage
  swapped — clean baseline = premade cracked-stone-2 instead of a LaMa inpaint (plus a tone-match, since
  LaMa's fill already comes out at the reference's tone). "factor" (obs/clean) is the SAME step in both
  (LaMa breakdown stage 08); it was only mislabeled as novel. Turned blur OFF: --base-blur default 0 (kept
  as an opt-in for when the surface's non-matching detail — e.g. cracked-stone-2's cracks — shows as noise;
  it didn't here). PoC regenerated with no blur: crisp clean neutral halo on every surface.
