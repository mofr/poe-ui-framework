#!/usr/bin/env python3
"""Object removal via LaMa (simple-lama-inpainting). Native-res, keeps unmasked pixels, no restyle.

Usage: python3 tools/inpaint.py <image.png> <mask.png> <out.png>
Mask: white (255) = remove/inpaint, black = keep.
"""
import sys
from PIL import Image
from simple_lama_inpainting import SimpleLama

img = Image.open(sys.argv[1]).convert("RGB")
mask = Image.open(sys.argv[2]).convert("L")
lama = SimpleLama()  # downloads big-lama on first run; uses CUDA if available
out = lama(img, mask)
out.save(sys.argv[3])
print(f"saved {sys.argv[3]} {out.size}")
