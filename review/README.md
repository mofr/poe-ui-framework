# Review images

All candidate/experiment images live here (tracked in git) so they're visible and never lost while
we're still converging. See `../docs/FRAME-FIDELITY.md` for the plan, methods ledger, and ratings.

Newest experiments appended; older kept for comparison. **User rates feel 1–5; Claude never declares.**

## Reference (target)
- `00-reference-full.jpg` — the full 1440×810 reference (Threads @d4m1n.max).
- `00-ref-panel-repo-overview.png` — the Repo Overview panel crop (our chosen frame target).
- `00-ref-corner-zoom8x.png` — react panel corner @8× (shows thin band + ~30px gold bracket + grime).

## Candidate A — OpenAI gpt-image-1.5 img2img (generation)
- `A-generated-img2img-3of5.png` — **user rated 3/5**: too goldish, 3 concentric frames (not elegant), some right bits.
- `A-generated-native360.png` — same, downscaled to native size: thinner but smoother (grit lost).

## Candidate B — extraction from the reference's own pixels
- `B-extracted-mirrored-rough.png` — v1, mirror-assembled tiles. User ≤3/5: good local crisp, but
  corner captured whole composition (shadows/neighbor) + rough "just cut" seams. Superseded by B2.
- `B2-real-panel-native.png` — the raw Repo Overview panel border (real reference, 1:1, unmodified).
- `B2-extracted-ring-native.png` — same with interior cut to transparent (the 9-slice ring).
- `B2-extracted-on-body-native.png` — ring over a dark body. CLEAN header+top-corners; bottom
  edges/corners bleed map (content fills to the thin frame). → motivates the HYBRID (see FRAME-FIDELITY.md).

All shown native 1:1 — no upscaling (pixel-perfect art).

## Candidate C — USER hand-cleaned frame (Quest Log panel) → routes
- `C-user-cleaned-quest-log.png` — the user's hand-isolated frame (interior blacked, leftovers: title,
  "?", bottom "View All Quests" button). 307×263, real reference pixels.
- `C-direct-on-body-native.png` — route (a): interior cut transparent over a body. Authentic grit +
  scale; leftovers remain (button overlaps bottom frame; title + "?" baked).
- `C-img2img-cleaned.png` — route (b): gpt-image-1.5 removed leftovers + hollow center, BUT 1024px
  upres smoothed the grit and warmed/genericized the border (lost feel).
- NEXT idea: native-res cloning cleanup (real pixels over button/title/?) to combine a's grit + b's clean.

## Candidate C — style-preserving super-resolution (Real-ESRGAN on RTX 4070)
- `C-sr-x4plus-native307.png` — Real-ESRGAN x4plus, downscaled back to native 307w (deblur-at-native).
- `C-sr-x4plus-4x.png` — full 4× (1228px). Same frame/style/grime as input, just sharper. NO restyle.
- Tool: `tools/upscale.py <model.pth> <in> <out> [native_w]`; weights in `assets-staging/sr-models/` (gitignored).
- Leftovers (title/?/button) still present — SR sharpens only; removal is a separate cleanup step.

## Candidate D — SR the FULL reference → sharp master to crop all frames from
- Master: `assets-staging/sources/ref-sr-x4.png` (5760×3240, gitignored, reproducible via tools/upscale.py).
- `D-cmp-orig-repoov-2x.png` vs `D-cmp-sr-repoov-2x.png` — same panel, same size: SR clearly crisper, style intact.
- `D-cmp-orig-corner.png` vs `D-cmp-sr-corner.png` — frame corner detail recovery.
- PROCESS: SR is a one-time pre-process; all frame extraction/cleaning/generation now works on the master.

## Candidate D — size sweep (find the crisp pixel-art native size)
- `sizes/ref-w0360.png` … `ref-w2400.png` — full SR master downscaled (lanczos) to many widths, NO crop.
- Goal: user picks the width where it reads crisp/pixel-art (high-res is smooth). That = target native size.
- Build components at high-res, finalize at the chosen size.

## Candidate E — LaMa-cleaned Quest Log frame (the breakthrough)
- Pipeline: SR full ref → 1680 master → crop panel (`assets-staging/sources/ql-panel.png`) → LaMa
  inpaint a removal mask (`ql-mask.png`) → `tools/inpaint.py`.
- `E-questlog-FRAME-clean-1680.png` — clean frame: REAL sharp gritty border/corners/header band;
  content (list/title/?/button) removed; interior = LaMa smooth fill (to be replaced by our body);
  bottom-frame center LaMa-reconstructed. First clean frame from the real reference at native size.
- `E-questlog-lama-cleaned.png` — latest working copy.
