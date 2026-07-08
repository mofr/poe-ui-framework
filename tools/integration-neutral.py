#!/usr/bin/env python3
"""PoC: derive BACKGROUND-NEUTRAL integration maps (attenuation + highlight) for a mask.

The committed `*.integration.png` stores the reference STONE pixels under the halo, so multiply-
compositing it drags that stone's colour+texture onto whatever background it sits on (visible mismatch
off-stone). This tool instead stores only the LIGHT-TRANSFER FACTOR — how much the frame darkens /
lightens the surface — which is background-neutral.

Method (uses LaMa, which we already have wired):
  1. inpaint the integration region OUT of the source plate  -> clean flat stone baseline
  2. re-run cut-panel with --src=clean  -> a clean integration crop, pixel-aligned to the real one
  3. factor = observed / clean   (per-pixel; <1 = shadow, >1 = highlight)
  4. write ONE combined relight map at the integration dims: black-α where the frame DARKENS the surface,
     warm-α where it LIFTS it (rim). Normal-composited, one layer does both -> <name>.integration.png

Usage: python3 tools/integration-neutral.py <maskName>   [--strength=1.0] [--blur=0 (denoise, off by default)]
"""
import sys, os, json, subprocess, glob
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = os.environ.get('SCRATCH', '/tmp/integration-neutral')
os.makedirs(SCRATCH, exist_ok=True)

name = sys.argv[1]
opt = dict(a[2:].split('=') for a in sys.argv[2:] if a.startswith('--'))
strength = float(opt.get('strength', 1.0))
# blur=0 by default: the map is the literal light-transfer, which reconstructs the reference best. --blur=N
# is an optional denoise for a NOISY LaMa baseline (smooths speckle in the darken/rim fields at a small
# fidelity cost); the input's inpaint is clean enough not to need it.
blur = float(opt.get('blur', 0))

mask_path = glob.glob(os.path.join(ROOT, 'src/**', name + '.mask.json'), recursive=True)[0]
mask = json.load(open(mask_path))
W, H = Image.open(os.path.join(ROOT, mask['image'])).size

integ = next(c for c in mask['contours'] if c.get('op') == 'integration')
# observed integration crop: mask.out.integration if present, else the colocated <name>.integration.png
if isinstance(mask.get('out'), dict) and mask['out'].get('integration'):
    observed_path = os.path.join(ROOT, mask['out']['integration'])
else:
    observed_path = glob.glob(os.path.join(ROOT, 'src/**', name + '.integration.png'), recursive=True)[0]

# ── plate: the inpainted source if the mask reconstructs obstacles, else the raw reference ──
plate = os.path.join(ROOT, f'assets-staging/sources/{name}-inpainted.png')
if not os.path.exists(plate):
    plate = os.path.join(ROOT, mask['image'])

# ── 1. inpaint the integration region out of the plate → clean flat baseline ──
pts = [(p['x'] * W, p['y'] * H) for p in integ['points']]
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).polygon(pts, fill=255)
mask_grow = int(opt.get('mask-grow', 2))                     # grow the inpaint mask past the integration
if mask_grow: m = m.filter(ImageFilter.MaxFilter(mask_grow*2+1))   # outline just enough for the soft edge
inpaint_mask = f'{SCRATCH}/{name}.inpaint-mask.png'
clean_full = f'{SCRATCH}/{name}.clean.png'
m.save(inpaint_mask)
subprocess.run(['python3', os.path.join(ROOT, 'tools/inpaint.py'),
                plate, inpaint_mask, clean_full], check=True)

# ── 2. cut BOTH the observed crop (from the plate) and the clean crop (from the LaMa fill) to scratch, via
#    the same code path ⇒ pixel-aligned. Cutting observed here (rather than reading the committed
#    integration.png) lets that file BE our single output — no separate stone intermediate to commit. ──
clean_integ = f'{SCRATCH}/{name}.clean-integration.png'
observed_scratch = f'{SCRATCH}/{name}.observed-integration.png'
for src, out in [(clean_full, clean_integ), (plate, observed_scratch)]:
    subprocess.run(['node', os.path.join(ROOT, 'tools/cut-panel.mjs'), name,
                    f'--src={src}',
                    f'--out-frame={SCRATCH}/{name}.throwaway-frame.png',
                    f'--out-integration={out}',
                    f"--fade={mask.get('fade', 2)}"], check=True, cwd=ROOT)

# inpaint sanity crop (element+halo region: plate on top, LaMa-clean below) → asset-review for eyeballing
ar = os.path.join(ROOT, 'asset-review/integration-neutral'); os.makedirs(ar, exist_ok=True)
xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; pad = 22
cl, ct, cr, cb = int(min(xs)) - pad, int(min(ys)) - pad, int(max(xs)) + pad, int(max(ys)) + pad
P = Image.open(plate).convert('RGB').crop((cl, ct, cr, cb))
Cl = Image.open(clean_full).convert('RGB').crop((cl, ct, cr, cb))
chk = Image.new('RGB', (P.width, P.height * 2 + 6), (70, 70, 70)); chk.paste(P, (0, 0)); chk.paste(Cl, (0, P.height + 6))
chk.save(os.path.join(ar, f'{name}.inpaint-check.png'))

# ── 3. factor = observed / clean, but ONLY on the surface (exclude the frame footprint) ──
obs = np.array(Image.open(observed_scratch).convert('RGBA')).astype(np.float32)
cln = np.array(Image.open(clean_integ).convert('RGBA').resize(
        (obs.shape[1], obs.shape[0]))).astype(np.float32)
cov = obs[:, :, 3] / 255.0                                   # traced coverage (shape + fade)
# The integration crop is the frame box grown by `spill` on every side; the frame raster tells us
# exactly where the opaque ornament sits (its factor is meaningless — bronze/stone reads as a false
# highlight). Zero the factor there so the maps carry only the surrounding HALO.
fr = Image.open(f'{SCRATCH}/{name}.throwaway-frame.png').convert('RGBA')
sx = (obs.shape[1] - fr.width) // 2
sy = (obs.shape[0] - fr.height) // 2
frame_a = Image.new('L', (obs.shape[1], obs.shape[0]), 0)
frame_a.paste(fr.split()[3], (sx, sy))
# Exclude the ENTIRE frame interior (band + inner opening), not just the opaque band — else the halo
# spills into the opening. Fill the band's interior holes to get the whole footprint.
from scipy import ndimage
frame_area = ndimage.binary_fill_holes(np.array(frame_a) > 40).astype(np.float32)
# frame-dilate=0 (default): the halo sticks to the frame exactly. Dilating gaps it off — a round-trip
# reconstruction (baseline+shadow+highlight+frame vs reference) shows the error rising with every px.
frame_dilate = int(opt.get('frame-dilate', 0))
if frame_dilate:
    frame_area = np.array(Image.fromarray((frame_area*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(frame_dilate*2+1))).astype(np.float32)/255.0
surface = 1.0 - frame_area
cov = cov * surface
# PRE-BLUR: the shadow/highlight is a LOW-FREQUENCY field; high-freq stone texture differs between the
# reference and the LaMa fill, so the raw ratio is noisy. Blur both before dividing → smoother maps.
pre_blur = float(opt.get('pre-blur', 0))   # no blur: keeps the sharp contact-shadow edge (user-chosen)
def _blur(a): return np.array(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(pre_blur))).astype(np.float32)
# Replace the frame footprint with clean stone BEFORE blurring, else the bright bronze bleeds into the
# halo and under-applies the shadow next to the frame (a red ring in the reconstruction diff).
footprint = frame_area > 0.5
obs_src = obs[:, :, :3].copy(); obs_src[footprint] = cln[:, :, :3][footprint]
obs_b = obs_src if pre_blur <= 0 else _blur(obs_src)
cln_b = cln[:, :, :3] if pre_blur <= 0 else _blur(cln[:, :, :3])
lum = lambda a: 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
# SHADOW = multiplicative attenuation (ratio), background-neutral: darken toward black by (1 − obs/clean).
factor = lum(obs_b) / np.clip(lum(cln_b), 1.0, None)
darken = np.clip((1.0 - factor) * strength, 0, 1) * cov
# HIGHLIGHT (lit rim) — BAKED for NORMAL composite, so it survives panel nesting (add/screen blends can't
# reach the surface through a nested stacking context). Paint the observed lit-rim COLOUR with alpha ~ how
# much brighter it is than the clean baseline. On the stone surface this reproduces the rim; on very
# different backdrops it tints mildly (accepted trade-off for robustness). The shadow stays neutral (black).
hi_strength = float(opt.get('hi', 1.0))
delta_lum = np.clip(lum(obs_b) - lum(cln_b), 0, None)
# Paint a BRIGHT warm-white (not the reference's own lit-stone colour, which is darker than other stones
# and would darken them). alpha = brightness / (HI_lum − baseline) so a normal composite lifts the surface
# by ≈ the reference's added light: reproduces the rim on the reference AND lifts a brighter dashboard stone.
HI_COLOR = (215, 200, 170)
hi_alpha = np.clip(delta_lum / 185.0, 0, 1) * cov * hi_strength

# ── 4. combine SHADOW (black, α=darken) + RIM (warm, α=hi_alpha) into ONE normal-composited map. Blur each
#    field SEPARATELY first (the rim colour must NOT be blurred against the shadow's black, or the black
#    bleeds into the warm and smears/enlarges the rim). Then one normal layer == "shadow then rim":
#      out = bg·(1−ds)(1−dh) + warm·dh   ⇒   α = ds+dh−ds·dh,   rgb = warm·dh/α
#    which reproduces the two-layer composite exactly, in a single asset. ──
def _blur01(x):
    return np.array(Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8))
                    .filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255.0
ds = _blur01(darken)
dh = _blur01(hi_alpha)
alpha = ds + dh - ds * dh
warm = np.array(HI_COLOR, np.float32)
rgb = np.zeros((*alpha.shape, 3), np.float32)
nz = alpha > 1e-4
rgb[nz] = warm[None, :] * (dh[nz] / alpha[nz])[:, None]     # black where shadow dominates, warm where rim does
arr = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 1) * 255]).astype(np.uint8)
Image.fromarray(arr, 'RGBA').save(observed_path)            # already blurred per-field; do NOT blur again
print(f'{name}: integration (shadow+rim in 1 map) α_max={int(alpha.max()*255)} -> {os.path.relpath(observed_path, ROOT)}')
