#!/usr/bin/env python3
"""Defocus deblur via FFT Richardson-Lucy deconvolution with a disk PSF.

Undoes optical out-of-focus blur (circle of confusion), which sharpeners/SR can't.
The one knob to tune is RADIUS = the blur circle's radius in pixels: too small does
nothing, too big over-rings. Iterations trade detail vs. noise/ringing.

Usage: python3 tools/defocus.py <in> <out> [radius] [iters]
"""
import sys
import numpy as np
from PIL import Image

in_path, out_path = sys.argv[1], sys.argv[2]
radius = float(sys.argv[3]) if len(sys.argv) > 3 else 4.0
iters = int(sys.argv[4]) if len(sys.argv) > 4 else 30

img = Image.open(in_path).convert("RGB")
arr = np.asarray(img).astype(np.float64) / 255.0

# reflect-pad to suppress FFT wraparound ringing at the borders
pad = int(np.ceil(radius)) + 16
arr = np.pad(arr, ((pad, pad), (pad, pad), (0, 0)), mode="reflect")
H, W, _ = arr.shape

# disk PSF (defocus = uniform circle), centered then shifted to FFT origin
yy, xx = np.mgrid[:H, :W]
cy, cx = H / 2.0, W / 2.0
disk = ((yy - cy) ** 2 + (xx - cx) ** 2) <= radius ** 2
psf = disk.astype(np.float64)
psf /= psf.sum()
K = np.fft.fft2(np.fft.ifftshift(psf))
Kc = np.conj(K)

eps = 1e-7
out = np.empty_like(arr)
for c in range(3):
    obs = arr[..., c]
    est = obs.copy()
    for _ in range(iters):
        blur = np.real(np.fft.ifft2(np.fft.fft2(est) * K))
        rel = obs / np.maximum(blur, eps)
        est *= np.real(np.fft.ifft2(np.fft.fft2(rel) * Kc))
        np.clip(est, 0.0, 1.0, out=est)
    out[..., c] = est

out = out[pad:-pad, pad:-pad]
Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(out_path)
print(f"saved {out_path} {out.shape[1]}x{out.shape[0]}  radius={radius} iters={iters}")
