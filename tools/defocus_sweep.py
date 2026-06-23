#!/usr/bin/env python3
"""Sweep defocus-deblur radii and build a labeled contact sheet to pick from.

Saves each full-res result as defocus_r<R>.png plus a montage defocus_sweep.png
(thumbnails, labeled) for quick side-by-side judging. Pick a radius, then re-run
tools/defocus.py at that radius for the keeper.

Usage: python3 tools/defocus_sweep.py <in> [iters] [r1 r2 r3 ...]
"""
import sys
import numpy as np
from PIL import Image, ImageDraw

in_path = sys.argv[1]
iters = int(sys.argv[2]) if len(sys.argv) > 2 else 30
radii = [float(x) for x in sys.argv[3:]] or [2, 3, 4, 5, 6, 8, 10]

base = Image.open(in_path).convert("RGB")
src = np.asarray(base).astype(np.float64) / 255.0


def deblur(arr, radius, iters):
    pad = int(np.ceil(radius)) + 16
    a = np.pad(arr, ((pad, pad), (pad, pad), (0, 0)), mode="reflect")
    H, W, _ = a.shape
    yy, xx = np.mgrid[:H, :W]
    disk = ((yy - H / 2.0) ** 2 + (xx - W / 2.0) ** 2) <= radius ** 2
    psf = disk.astype(np.float64)
    psf /= psf.sum()
    K = np.fft.fft2(np.fft.ifftshift(psf))
    Kc = np.conj(K)
    out = np.empty_like(a)
    for c in range(3):
        obs = a[..., c]
        est = obs.copy()
        for _ in range(iters):
            blur = np.real(np.fft.ifft2(np.fft.fft2(est) * K))
            rel = obs / np.maximum(blur, 1e-7)
            est *= np.real(np.fft.ifft2(np.fft.fft2(rel) * Kc))
            np.clip(est, 0.0, 1.0, out=est)
        out[..., c] = est
    return out[pad:-pad, pad:-pad]


# label includes the untouched original as the reference cell
cells = [("original", base)]
for r in radii:
    res = deblur(src, r, iters)
    im = Image.fromarray((np.clip(res, 0, 1) * 255 + 0.5).astype(np.uint8))
    fn = f"defocus_r{r:g}.png"
    im.save(fn)
    cells.append((f"r={r:g}", im))
    print(f"saved {fn}")

# montage: fixed thumb width, label bar above each cell
TW = 360
BAR = 26
COLS = 4
thumbs = [(lbl, im.resize((TW, round(im.height * TW / im.width)))) for lbl, im in cells]
cw = TW
ch = max(t.height for _, t in thumbs) + BAR
rows = (len(thumbs) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * cw, rows * ch), (24, 24, 28))
d = ImageDraw.Draw(sheet)
for i, (lbl, t) in enumerate(thumbs):
    x, y = (i % COLS) * cw, (i // COLS) * ch
    d.rectangle([x, y, x + cw, y + BAR], fill=(45, 45, 52))
    d.text((x + 6, y + 7), lbl, fill=(235, 235, 240))
    sheet.paste(t, (x, y + BAR))
sheet.save("defocus_sweep.png")
print(f"saved defocus_sweep.png ({sheet.width}x{sheet.height})  iters={iters}")
