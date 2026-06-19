#!/usr/bin/env python3
"""Style-preserving super-resolution via Real-ESRGAN (loaded with spandrel).

Sharpens / deblurs without repainting style — unlike generative img2img. Runs on CUDA if available.
Tiles large inputs so they fit in VRAM.

Usage:
  python3 tools/upscale.py <model.pth> <in.png> <out.png> [native_width]

If native_width is given, the SR result is downscaled back to that width (Lanczos) — the
"deblur at native scale" trick: 4x up then back down packs recovered detail into a crisp small image.
"""
import sys
import numpy as np
import torch
from PIL import Image
from spandrel import ModelLoader

TILE = 384      # input-space tile size; auto-used when the image is large
OVERLAP = 24    # context padding per tile to hide seams


def upscale(model, t, scale, dev):
    B, C, H, W = t.shape
    if max(H, W) <= 768:
        with torch.no_grad():
            return model(t)
    out = torch.zeros((B, C, H * scale, W * scale), dtype=t.dtype, device=dev)
    for y in range(0, H, TILE):
        for x in range(0, W, TILE):
            y0, x0 = max(0, y - OVERLAP), max(0, x - OVERLAP)
            y1, x1 = min(H, y + TILE + OVERLAP), min(W, x + TILE + OVERLAP)
            with torch.no_grad():
                op = model(t[:, :, y0:y1, x0:x1])
            ty, tx = y - y0, x - x0
            th, tw = min(TILE, H - y), min(TILE, W - x)
            out[:, :, y * scale:(y + th) * scale, x * scale:(x + tw) * scale] = \
                op[:, :, ty * scale:(ty + th) * scale, tx * scale:(tx + tw) * scale]
    return out


def main():
    model_path, in_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    native_w = int(sys.argv[4]) if len(sys.argv) > 4 else None

    dev = "cuda" if torch.cuda.is_available() else "cpu"
    desc = ModelLoader().load_from_file(model_path)
    model, scale = desc.to(dev).eval(), desc.scale

    img = Image.open(in_path).convert("RGB")
    arr = np.asarray(img).astype(np.float32) / 255.0
    t = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0).to(dev)
    out = upscale(model, t, scale, dev)
    out = out.squeeze(0).permute(1, 2, 0).clamp(0, 1).cpu().numpy()
    out_img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))

    if native_w:
        h = round(out_img.height * native_w / out_img.width)
        out_img = out_img.resize((native_w, h), Image.LANCZOS)

    out_img.save(out_path)
    print(f"saved {out_path} {out_img.size}  (device={dev}, scale={scale})")


if __name__ == "__main__":
    main()
