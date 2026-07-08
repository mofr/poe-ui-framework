#!/usr/bin/env python3
"""Visualise EVERY step of the neutral-integration pipeline for one mask as a SET of uniformly-sized,
spatially-registered PNGs (flip through them to check step-to-step alignment).

Usage: SCRATCH=/path python3 tools/integration-viz.py PoeInput.big-input [--pre-blur=2.5] [--frame-dilate=4] [--mask-grow=2]
Output: asset-review/integration-neutral/pipeline-<name>/NN-*.png  (all identical size, registered)
"""
import sys, os, json, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = os.environ.get('SCRATCH', '/tmp/integration-viz'); os.makedirs(SCRATCH, exist_ok=True)
name = sys.argv[1]
opt = dict(a[2:].split('=') for a in sys.argv[2:] if a.startswith('--'))
PRE_BLUR = float(opt.get('pre-blur', 2.5))       # low-pass observed+clean before the ratio (kills texture noise)
FRAME_DILATE = int(opt.get('frame-dilate', 0))   # px to grow the frame CUT past its edge; 0 = halo sticks to
                                                 # the frame exactly (dilating gaps it off — raises recon error)
MASK_GROW = int(opt.get('mask-grow', 2))         # px to grow the INPAINT mask past the integration outline
HI = float(opt.get('hi', 1.0))                   # highlight strength; 0 = shadow-only (screen can't add bright
                                                 # spots on dark backgrounds, which LaMa baseline noise causes)
Z, MARGIN = 3, 30

maskp = subprocess.run(['node', '-e', "import('./tools/find-mask.mjs').then(m=>m.findMaskPath(process.argv[1])).then(p=>console.log(p))", name],
                       cwd=ROOT, capture_output=True, text=True).stdout.strip()
mask = json.load(open(maskp))
# Panels with op:inpaint were cut from the INPAINTED PLATE (their button removed), not the raw reference —
# so register/reconstruct against that plate, else the crops won't match.
ref_path = os.path.join(ROOT, f'assets-staging/sources/{name}-inpainted.png')
if not os.path.exists(ref_path): ref_path = os.path.join(ROOT, mask['image'])
W, H = Image.open(ref_path).size
ref = Image.open(ref_path).convert('RGB'); refA = np.array(ref).astype(np.float32)
poly = lambda op: [[(p['x']*W, p['y']*H) for p in c['points']] for c in mask['contours'] if c.get('op', 'keep') == op]
frame_polys, hole_polys, integ_polys = poly('keep'), poly('hole'), poly('integration')

def fill(polys, size=(W, H), off=(0, 0)):
    im = Image.new('L', size, 0); d = ImageDraw.Draw(im)
    for p in polys: d.polygon([(x-off[0], y-off[1]) for x, y in p], fill=255)
    return im

observed = Image.open(os.path.join(ROOT, (mask.get('out') or {}).get('integration') or f"src/components/primitives/{name}.integration.png")).convert('RGBA')
frame_png = Image.open(os.path.join(ROOT, (mask.get('out') or {}).get('frame') or f"src/components/primitives/{name}.png")).convert('RGBA')
iw, ih = observed.size; fw, fh = frame_png.size

# ── EXACT registration: the integration raster is a verbatim reference crop, so template-match it back
#    (avoids the polygon-vs-raster off-by-one that shifted every derived step). ──
fa = np.array(fill(frame_polys)); ha = np.array(fill(hole_polys)); frameA = np.clip(fa-ha, 0, 255)
ys, xs = np.where(frameA > 127); il0 = xs.min() - (iw-(xs.max()-xs.min()+1))//2; it0 = ys.min() - (ih-(ys.max()-ys.min()+1))//2
obsRGB = np.array(observed.convert('RGB')).astype(np.float32)
best = (1e18, il0, it0)
for dy in range(it0-10, it0+11):
    for dx in range(il0-10, il0+11):
        c = refA[dy:dy+ih, dx:dx+iw]
        if c.shape[:2] == (ih, iw):
            s = np.abs(c - obsRGB).mean()
            if s < best[0]: best = (s, dx, dy)
_, il, it = best                                            # exact integration-crop origin in reference px
fx, fy = il + (iw-fw)//2, it + (ih-fh)//2                   # frame origin (frame is centred in the integ crop)
cl, ct = il-MARGIN, it-MARGIN; cw, ch = iw+2*MARGIN, ih+2*MARGIN
print(f'registered origin ({il},{it}) SAD {best[0]:.2f}; frame at ({fx},{fy})')

# ── clean plate (LaMa) — mask = integration outline grown by MASK_GROW px; cache keyed by grow ──
clean_full = f'{SCRATCH}/{name}.clean-g{MASK_GROW}.png'
inpaint_mask_img = fill(integ_polys)
if MASK_GROW: inpaint_mask_img = inpaint_mask_img.filter(ImageFilter.MaxFilter(MASK_GROW*2+1))
if not os.path.exists(clean_full):
    mp = f'{SCRATCH}/{name}.inpaint-mask.png'; inpaint_mask_img.save(mp)
    plate = os.path.join(ROOT, f'assets-staging/sources/{name}-inpainted.png')
    if not os.path.exists(plate): plate = os.path.join(ROOT, mask['image'])
    subprocess.run(['python3', os.path.join(ROOT, 'tools/inpaint.py'), plate, mp, clean_full], check=True)
clean = Image.open(clean_full).convert('RGB').crop((0, 0, W, H))

# ── derive (all on the pixel-exact crop) ──
obs = np.array(observed).astype(np.float32)
cln = np.array(clean.crop((il, it, il+iw, it+ih))).astype(np.float32)
# Exclude the frame footprint (band + inner opening) with a HARD mask taken from the actual frame raster
# (fill its holes for the opening). Hard, not soft: a soft edge multiplies `darken` down to ~0 in the 1-2px
# next to the frame — under-applying the DARKEST part of the contact shadow (recon reads too light there).
from scipy import ndimage
fa_crop = Image.new('L', (iw, ih), 0); fa_crop.paste(frame_png.split()[3], ((iw-fw)//2, (ih-fh)//2))
footprint = ndimage.binary_fill_holes(np.array(fa_crop) > 40)
if FRAME_DILATE: footprint = ndimage.binary_dilation(footprint, iterations=FRAME_DILATE)
surface = (~footprint).astype(np.float32)
cov = (obs[:, :, 3]/255.0) * surface
def blur_rgb(a): return np.array(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(PRE_BLUR))).astype(np.float32)
# Before blurring, replace the frame footprint in `obs` with the clean stone — else the bright bronze
# bleeds into the halo and under-applies the shadow right next to the frame (a red ring in the diff).
obs_src = obs[:, :, :3].copy(); obs_src[footprint] = cln[footprint]
obs_b = obs_src if PRE_BLUR <= 0 else blur_rgb(obs_src)
cln_b = cln if PRE_BLUR <= 0 else blur_rgb(cln)
lum = lambda a: 0.2126*a[..., 0] + 0.7152*a[..., 1] + 0.0722*a[..., 2]
raw_diff = lum(obs[:, :, :3]) - lum(cln)
factor = lum(obs_b) / np.clip(lum(cln_b), 1.0, None)
darken = np.clip(1.0-factor, 0, 1) * cov
delta = np.clip(obs_b - cln_b, 0, 255) * cov[..., None] * HI

# ── frame writer ──
outdir = os.path.join(ROOT, f'asset-review/integration-neutral/pipeline-{name}')
shutil.rmtree(outdir, ignore_errors=True); os.makedirs(outdir)
CHK = Image.new('RGB', (cw, ch)); dc = ImageDraw.Draw(CHK)
for y in range(0, ch, 8):
    for x in range(0, cw, 8):
        dc.rectangle([x, y, x+7, y+7], fill=(70, 70, 70) if (x//8+y//8) % 2 else (48, 48, 48))
try: FONT = ImageFont.load_default(size=15)
except Exception: FONT = ImageFont.load_default()
ASCII = lambda s: s.replace('—', '-').replace('−', '-').replace('×', 'x').replace('→', '->').replace('α', 'a').replace('·', '|')

def ctx_of(full): return full.crop((cl, ct, cl+cw, ct+ch))
def place(small, at=(MARGIN, MARGIN)):
    b = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); b.paste(small, at); return b
def save(nn, short, title, ctx_img):
    if ctx_img.mode == 'RGBA':
        bg = Image.new('RGB', (cw, ch), (26, 26, 26)); bg.paste(ctx_img, (0, 0), ctx_img); ctx_img = bg
    big = ctx_img.resize((cw*Z, ch*Z), Image.NEAREST)
    bar = Image.new('RGB', (cw*Z, 24), (16, 16, 18)); ImageDraw.Draw(bar).text((8, 4), ASCII(title), font=FONT, fill=(224, 218, 202))
    im = Image.new('RGB', (cw*Z, ch*Z+24), (16, 16, 18)); im.paste(bar, (0, 0)); im.paste(big, (0, 24)); im.save(os.path.join(outdir, f'{nn}-{short}.png'))
def diverge(field, scale, mask01=None):    # gray=0, pure RED=positive, pure BLUE=negative
    t = np.clip(field/scale, -1, 1); img = np.zeros((*field.shape, 3), np.float32)
    img[..., 0] = 60 + t*195; img[..., 2] = 60 - t*195; img[..., 1] = 60 - np.abs(t)*60
    img = np.clip(img, 0, 255).astype(np.uint8)
    if mask01 is not None: img[mask01 < 0.05] = (28, 28, 28)
    return Image.fromarray(img).convert('RGBA')

# halo-only observed (frame CUT) — this is "just the integration"
halo = obs.copy(); halo[:, :, 3] = obs[:, :, 3] * surface
halo_img = Image.fromarray(halo.astype(np.uint8))

save('01', 'reference', '01 | reference crop (the search bar, in context)', ctx_of(ref))
c2 = ctx_of(ref).convert('RGB'); d = ImageDraw.Draw(c2)
for col, ps in [((90, 230, 90), frame_polys), ((230, 80, 80), hole_polys), ((90, 210, 230), integ_polys)]:
    for p in ps: d.line([(x-cl, y-ct) for x, y in p]+[(p[0][0]-cl, p[0][1]-ct)], fill=col, width=1)
save('02', 'contours', '02 | traced contours: frame(green) interior-hole(red) integration(cyan)', c2)
fb = place(frame_png, (fx-cl, fy-ct)); tmp = CHK.copy(); tmp.paste(fb, (0, 0), fb)
save('03', 'frame', '03 | FRAME cut (its own layer, drawn on top at runtime)', tmp.convert('RGBA'))
tmp = CHK.copy(); tmp.paste(place(halo_img), (0, 0), place(halo_img))
save('04', 'integration', '04 | INTEGRATION only (observed halo, frame cut out, interior hole)', tmp.convert('RGBA'))
save('05', 'inpaint-mask', f'05 | inpaint mask = integration outline +{MASK_GROW}px  (white=remove)', ctx_of(inpaint_mask_img).convert('RGB'))
save('06', 'clean', '06 | LaMa clean plate (frame+shadow removed -> flat stone baseline)', ctx_of(clean))
save('07', 'raw-diff', '07 | RAW observed-clean, UNMASKED (+-40): red=brighter blue=darker', place(diverge(raw_diff, 40)))
save('08', 'factor', '08 | factor = observed/clean on the SURFACE (blue<1 shadow | red>1 lit)', place(diverge(factor-1.0, 0.35, cov)))
save('09', 'coverage', '09 | coverage = integration halo with the frame footprint removed', place(Image.fromarray((cov*255).astype(np.uint8)).convert('RGBA')))
save('10', 'shadow', '10 | SHADOW map: how much to DARKEN (1-factor) -> black x multiply', place(Image.fromarray((darken*255).astype(np.uint8)).convert('RGBA')))
save('11', 'highlight', '11 | HIGHLIGHT map: light to ADD (obs-clean, +) -> screen (shown x3)', place(Image.fromarray(np.clip(delta*3, 0, 255).astype(np.uint8)).convert('RGBA')))
frame_rgba = np.array(frame_png).astype(np.float32)
def result(bg):
    base = np.zeros((ih, iw, 3), np.float32); base[:] = bg
    new = base*(1-darken[..., None]); new = new + delta
    out = new.clip(0, 255)
    fyi, fxi = (ih-fh)//2, (iw-fw)//2; reg = out[fyi:fyi+fh, fxi:fxi+fw]; a = frame_rgba[..., 3:4]/255.0
    reg[:] = reg*(1-a) + frame_rgba[..., :3]*a
    return Image.fromarray(out.astype(np.uint8)).convert('RGBA')
for nn, lbl, bg in [('12', 'stone', (20, 17, 10)), ('13', 'blue', (40, 70, 150)), ('14', 'parchment', (203, 189, 156))]:
    save(nn, f'result-{lbl}', f'{nn} | RESULT on {lbl}: shadow x multiply + highlight x screen + frame', place(result(bg)))

# ── ROUND-TRIP RECONSTRUCTION: baseline -> +shadow -> +highlight -> +frame, then diff vs reference.
#    If the decomposition + positioning are correct this reproduces the reference (except the interior
#    hole, which is the component's own surface, not part of this decomposition). ──
u8 = lambda a: Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')
recon = cln.copy()
save('15', 'recon-1-baseline', '15 | RECON 1: inpainted baseline', place(u8(recon)))
recon = recon * (1 - darken[..., None])
save('16', 'recon-2-shadow', '16 | RECON 2: + shadow (x multiply)', place(u8(recon)))
recon = recon + delta
save('17', 'recon-3-highlight', '17 | RECON 3: + highlight (screen)', place(u8(recon)))
fyi, fxi = (ih-fh)//2, (iw-fw)//2; reg = recon[fyi:fyi+fh, fxi:fxi+fw]; a = frame_rgba[..., 3:4]/255.0
reg[:] = reg*(1-a) + frame_rgba[..., :3]*a
save('18', 'recon-4-frame', '18 | RECON 4: + frame on top = FULL reconstruction', place(u8(recon)))
save('19', 'reference', '19 | reference (target to match)', place(u8(obs[:, :, :3])))
# Measure over the INTEGRATION MASK (binary: every pixel the halo touches), accumulating each pixel's
# error equally — no coverage weighting (which would dilute the very edge pixels that carry the error).
signed = lum(np.clip(recon, 0, 255)) - lum(obs[:, :, :3])       # + = recon too LIGHT, - = recon too DARK
diff = np.abs(signed)
imask = cov > 0.02                                              # integration mask
n = int(imask.sum()); total = float(diff[imask].sum())
mean = total / max(n, 1); mx = float(diff[imask].max()) if n else 0.0
save('20', 'recon-diff', f'20 | SIGNED recon-ref (+-15) on {n} px (red=too light, blue=too dark) mean {mean:.2f} max {mx:.0f}',
     place(diverge(signed*imask, 15)))
print(f'RECON on integration mask: pixels={n}  accumulated|err|={total:.0f}  mean={mean:.2f}/255  max={mx:.0f}'
      f'   (pre-blur {PRE_BLUR}, frame-dilate {FRAME_DILATE})')

# BACKGROUND-NEUTRALITY: reconstruct-on-clean is near-trivial (reproduces obs either way). The real test
# is applying the integration to OTHER backgrounds — a shadow must DARKEN consistently with no bright spots.
lum = lambda a: 0.2126*a[..., 0] + 0.7152*a[..., 1] + 0.0722*a[..., 2]
for bg, lbl in [((15, 13, 8), 'dark'), ((60, 52, 38), 'mid'), ((203, 189, 156), 'light')]:
    base = np.zeros((ih, iw, 3), np.float32); base[:] = bg
    out = base*(1-darken[..., None]) + delta
    dl = (lum(out)-lum(base))[imask]
    print(f'   on {lbl:5s} bg: net {dl.mean():+6.1f}  (want <=0)  |  brightest spot {dl.max():+5.1f}  '
          f'|  {100*(dl>2).mean():.0f}% of px lighten')

print('saved', os.path.relpath(outdir, ROOT), f'({len(os.listdir(outdir))} frames {cw*Z}x{ch*Z+24}; pre-blur {PRE_BLUR}, frame-dilate {FRAME_DILATE}, mask-grow {MASK_GROW})')
