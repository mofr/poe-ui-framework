# Reference Frame Extraction Plan

Date: 2026-06-19

## Goal

Produce one PNG raster frame asset for `PoePanel`, using only the existing reference raster:

`/home/mofr/poe-ui-framework/inspiration/reference-1680.png`

The target frame is the most common panel frame style visible on the reference, used by panels such as Quest Log, Activity Feed, Pinned Repositories, Combat Log, and similar dashboard panels.

## Hard Constraints

- Use `reference-1680.png` as the only raster input.
- Do not use prior cleaned/generated candidates from `asset-review/` as inputs.
- Do not use AI generation, external asset packs, or synthetic replacement art for the first pass.
- Keep the asset at the reference/native UI resolution.
- Output format: PNG.
- Target platform: web/desktop.
- Integrate with the existing `PoePanel` CSS `border-image` model.

## Recommended Approach

Use direct extraction from one clean instance of the common frame.

1. Inspect `reference-1680.png` and identify candidate instances of the common panel frame.
2. Prefer the clearest panel crop with the least contamination from title text, buttons, icons, adjacent panels, or busy content.
3. Start with a single-panel extraction rather than compositing multiple panels.
4. If the first panel is too contaminated, compare the other common panels and choose a cleaner source panel.
5. Avoid cross-panel compositing unless direct extraction clearly fails, because compositing increases seam and lighting-direction risk.

## Expected Outputs

- A candidate frame PNG in `src/assets/panels/`.
- A `PoePanel` frame option in `src/components/primitives/PoePanel.tsx` and `src/styles/poe-panel.css`, likely named something like `frame-reference-common`.
- A Storybook preview showing the frame at native UI scale.
- A review image or visual companion screen comparing:
  - the source panel crop from `reference-1680.png`;
  - the extracted frame rendered via `PoePanel`;
  - a normal content-filled `PoePanel` instance using the new frame.

## Extraction Notes

- The existing `PoePanel` contract uses 9-sliced PNG frame art through CSS `border-image`.
- Measure the source frame's native border/corner inset and set matching CSS values:
  - `--band`
  - `--slice`
  - `--content-pad`
  - `--overhang`
  - `--edge-repeat`
- Preserve real pixels where possible.
- Remove or mask only the panel interior and baked content that should not be part of reusable frame art.
- Keep the result honest: a first pass can be a candidate for user rating, not a declared final-quality asset.

## Verification

- Confirm generated files derive only from `inspiration/reference-1680.png`.
- Run the project's relevant checks after integration, likely:
  - `npm run build`
  - Storybook render/manual visual review, if available in the restarted session.
- Present the rendered candidate to the user for a 1-5 visual rating, following `docs/FRAME-FIDELITY.md`: user judges fidelity; the assistant does not declare reference-grade quality.

## Current Decision

The approved first-pass design is:

- single raster input: `reference-1680.png`;
- direct extraction from the clearest common panel frame;
- PNG output for `PoePanel`;
- no AI generation or prior candidate reuse;
- visual review before further refinement.
