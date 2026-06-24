#!/usr/bin/env python3
"""
Generate a 9-slice frame around any tileable texture.

The border is a quarter-ellipse 3D edge (depth=1 = quarter-circle).
Texture continues outward from the centre, wrapping at the tile boundary.
The arc length along the ellipse drives the UV compression; the optional
curve exponent remaps the darkening-falloff profile independently.

Usage:
  python framegen.py texture.png --output frame.png --border 64 --depth 1.5
  python framegen.py texture.png --border 48 --depth 2.0      --seed 42
"""

import numpy as np
from PIL import Image
import argparse
import math
import random


def wavy_displacement(length, amplitude, frequency, seed, octaves=4):
    """Return array of wavy offsets along an edge, range ≈ ±amplitude."""
    rng = random.Random(seed)
    result = np.zeros(length)
    for i in range(octaves):
        freq = frequency * (1.5 ** i)
        amp = amplitude / (1.3 ** i)
        phase = rng.uniform(0, 2 * math.pi)
        t = np.linspace(0, 2 * math.pi * freq, length, endpoint=False)
        result += amp * np.sin(t + phase)
    rng2 = random.Random(seed + 100)
    result += np.array([rng2.uniform(-0.3, 0.3) for _ in range(length)]) * amplitude
    return result


def ellipse_arc_length(t_vals, B, depth, num_samples=2048):
    """Map t ∈ [0,1] to arc length along quarter-ellipse of width B and
    depth = depth·B, using numerical integration.

    Excludes the endpoint t=1 where the integrand has a (removable)
    singularity — it only affects extreme outer-edge UV which is masked
    to black anyway.
    """
    samples = np.linspace(0, 1, num_samples + 1)[:-1]   # 0 … 1-1/num_samples
    dt = 1.0 / num_samples
    d2 = depth * depth
    integrand = B * np.sqrt(1.0 + (d2 - 1.0) * samples ** 2) \
                  / np.sqrt(np.maximum(1.0 - samples ** 2, 1e-15))
    L = np.zeros(num_samples)
    L[1:] = np.cumsum(integrand[1:]) * dt
    L[0] = 0.0
    # Clamp t_vals to [0, 1-dt] so interp never hits the missing endpoint
    clamped = np.clip(t_vals, 0.0, 1.0 - dt)
    return np.interp(clamped, samples, L)


def ellipse_mask(t, depth):
    """mask = 1 − cos(θ) where θ is the surface angle of an ellipse
    with given depth ratio at planar position t."""
    d2 = depth * depth
    return 1.0 - np.sqrt(np.clip(1.0 - t * t, 0.0, 1.0)) \
                / np.sqrt(np.clip(1.0 + (d2 - 1.0) * t * t, 1e-15, None))


def make_frame(input_path, output_path, border_width=None,
               depth=1.0, curve=2.0,
               boundary_jitter=0.0, wave_freq=2.0, octaves=4,
               curve_roughness=0.0, curve_jitter=0.0,
               seed=0,
               center_transparent=False, dark_color=None):
    if dark_color is None:
        dark_color = np.array([0, 0, 0, 255], dtype=np.float32)
    else:
        dark_color = np.asarray(dark_color, dtype=np.float32)

    tex_pil = Image.open(input_path).convert("RGBA")
    tex = np.array(tex_pil, dtype=np.float32)
    original = tex.copy()
    N = tex.shape[0]

    if border_width is None:
        border_width = max(48, min(128, int(N * 0.1)))
    B = border_width
    out_size = N + 2 * B

    # ── Build result canvas ──────────────────────────────────────────────
    result = np.zeros((out_size, out_size, 4), dtype=np.float32)
    result[..., 3] = 255
    result[B:B+N, B:B+N] = original

    # ── Wavy boundaries (clamped ≤0 so they never extend into centre) ────
    waves = {
        'top':    np.minimum(wavy_displacement(out_size, boundary_jitter, wave_freq, seed + 1, octaves), 0),
        'bottom': np.minimum(wavy_displacement(out_size, boundary_jitter, wave_freq, seed + 2, octaves), 0),
        'left':   np.minimum(wavy_displacement(out_size, boundary_jitter, wave_freq, seed + 3, octaves), 0),
        'right':  np.minimum(wavy_displacement(out_size, boundary_jitter, wave_freq, seed + 4, octaves), 0),
    }

    # ── Coordinate arrays ────────────────────────────────────────────────
    x_arr = np.tile(np.arange(out_size), (out_size, 1))
    y_arr = np.tile(np.arange(out_size).reshape(-1, 1), (1, out_size))

    d_top    = y_arr
    d_bottom = (out_size - 1) - y_arr
    d_left   = x_arr
    d_right  = (out_size - 1) - x_arr

    # Always use the full border width B. The wavy boundary is folded into
    # the t-value to shift the effective inner edge position (waves ≤ 0).
    def t_from_dist(dist):
        inside = dist < B
        return np.where(inside, 1.0 - dist / B, 0.0)

    t_top    = t_from_dist(d_top)
    t_bottom = t_from_dist(d_bottom)
    t_left   = t_from_dist(d_left)
    t_right  = t_from_dist(d_right)

    # Wavy-boundary displacement: wave ≤ 0 pushes the inner edge outward,
    # so the effective t is shifted: t_eff = t + wave/B  (≤0 → smaller t,
    # clamped to 0 for pixels that fall outside the wavy border).
    t_top    = np.clip(t_top    + waves['top'][np.newaxis, :] / B,     0.0, 1.0)
    t_bottom = np.clip(t_bottom + waves['bottom'][np.newaxis, :] / B,  0.0, 1.0)
    t_left   = np.clip(t_left   + np.array(waves['left'])[:, np.newaxis] / B,   0.0, 1.0)
    t_right  = np.clip(t_right  + np.array(waves['right'])[:, np.newaxis] / B,  0.0, 1.0)

    t_vert  = np.maximum(t_top, t_bottom)
    t_horiz = np.maximum(t_left, t_right)

    # Euclidean norm for circular corner contours (darkening only)
    t_comb = np.clip(np.sqrt(t_vert ** 2 + t_horiz ** 2), 0.0, 1.0)

    # ── Curve remap (power-law profile shape) ────────────────────────────
    # t_eff = t^(2/curve).  curve=2 → identity (pure ellipse).
    # Higher curve → larger t_eff → longer arc → more compression.
    def curve_remap(tv):
        return np.where(tv > 1e-8, tv ** (2.0 / curve), 0.0)

    # ── Curve jitter: per-pixel curve exponent ──────────────────────────
    if curve_jitter > 0:
        c_top    = wavy_displacement(out_size, curve_jitter, wave_freq, seed + 21, octaves)
        c_bottom = wavy_displacement(out_size, curve_jitter, wave_freq, seed + 22, octaves)
        c_left   = wavy_displacement(out_size, curve_jitter, wave_freq, seed + 23, octaves)
        c_right  = wavy_displacement(out_size, curve_jitter, wave_freq, seed + 24, octaves)

    if curve_jitter > 0:
        has_h = (t_top > 0) | (t_bottom > 0)
        has_v = (t_left > 0) | (t_right > 0)
        c_h_field = np.where(t_top > 0,    c_top[np.newaxis, :],
                    np.where(t_bottom > 0, c_bottom[np.newaxis, :], 0.0))
        c_v_field = np.where(t_left > 0,   c_left[:, np.newaxis],
                    np.where(t_right > 0,  c_right[:, np.newaxis], 0.0))
        count = has_h.astype(float) + has_v.astype(float)
        curve_eff = np.full_like(t_comb, curve, dtype=np.float32)
        valid = count > 0
        curve_eff[valid] = curve + (c_h_field[valid] + c_v_field[valid]) / count[valid]
        curve_eff = np.maximum(curve_eff, 0.01)
        t_comb_r = np.where(t_comb > 1e-8, t_comb ** (2.0 / curve_eff), 0.0)
    else:
        t_comb_r = curve_remap(t_comb)

    # ── Darkening mask ────────────────────────────────────────────────────
    mask = ellipse_mask(t_comb_r, depth)

    # ── Curve roughness: modulate mask along each edge ───────────────────
    if curve_roughness > 0:
        r_top    = wavy_displacement(out_size, curve_roughness, wave_freq, seed + 11, octaves)
        r_bottom = wavy_displacement(out_size, curve_roughness, wave_freq, seed + 12, octaves)
        r_left   = wavy_displacement(out_size, curve_roughness, wave_freq, seed + 13, octaves)
        r_right  = wavy_displacement(out_size, curve_roughness, wave_freq, seed + 14, octaves)
        r_mod = np.where(t_top > 0,    r_top[np.newaxis, :],
                np.where(t_bottom > 0, r_bottom[np.newaxis, :],
                np.where(t_left > 0,   r_left[:, np.newaxis],
                np.where(t_right > 0,  r_right[:, np.newaxis], 0.0))))
        mask = np.clip(mask + r_mod, 0.0, 1.0)

    # ── Arc-length source coordinates ─────────────────────────────────────
    # Process all non-centre pixels (including those beyond the wavy edge)
    border_region = (y_arr < B) | (y_arr >= B + N) | (x_arr < B) | (x_arr >= B + N)
    if np.any(border_region):
        t_vert_mag  = np.maximum(t_top, t_bottom)
        t_horiz_mag = np.maximum(t_left, t_right)

        # LUT: arc length at 1000 sample t values (curve affects UV too)
        t_lut = np.linspace(0, 1, 1000)
        L_lut = ellipse_arc_length(t_lut, B, depth)

        if curve_jitter > 0:
            c_uv_v = curve + np.where(t_top > 0, c_top[np.newaxis, :],
                              np.where(t_bottom > 0, c_bottom[np.newaxis, :], 0.0))
            c_uv_h = curve + np.where(t_left > 0, c_left[:, np.newaxis],
                              np.where(t_right > 0, c_right[:, np.newaxis], 0.0))
            c_uv_v = np.maximum(c_uv_v, 0.01)
            c_uv_h = np.maximum(c_uv_h, 0.01)
            t_vert_r  = np.where(t_vert_mag > 1e-8, t_vert_mag ** (2.0 / c_uv_v), 0.0)
            t_horiz_r = np.where(t_horiz_mag > 1e-8, t_horiz_mag ** (2.0 / c_uv_h), 0.0)
            arc_vert  = np.interp(t_vert_r,  t_lut, L_lut)
            arc_horiz = np.interp(t_horiz_r, t_lut, L_lut)
        else:
            arc_vert  = np.interp(curve_remap(t_vert_mag),  t_lut, L_lut)
            arc_horiz = np.interp(curve_remap(t_horiz_mag), t_lut, L_lut)

        # Source coordinate relative to centre edge
        # For top/bottom edges, horizontal coord is source-relative (x-B).
        # For left/right  edges, vertical   coord is source-relative (y-B).
        src_yf = np.where(t_top > 0,         -arc_vert,
                 np.where(t_bottom > 0, N-1 + arc_vert, y_arr - B))
        src_xf = np.where(t_left > 0,         -arc_horiz,
                 np.where(t_right > 0, N-1 + arc_horiz, x_arr - B))

        src_yf = np.mod(src_yf, N)
        src_xf = np.mod(src_xf, N)

        # Bilinear interpolation
        src_y0 = np.floor(src_yf).astype(np.int32)
        src_x0 = np.floor(src_xf).astype(np.int32)
        src_y1 = np.mod(src_y0 + 1, N)
        src_x1 = np.mod(src_x0 + 1, N)
        fy = (src_yf - src_y0)[:, :, np.newaxis]
        fx = (src_xf - src_x0)[:, :, np.newaxis]

        c00 = original[src_y0, src_x0, :3]
        c01 = original[src_y0, src_x1, :3]
        c10 = original[src_y1, src_x0, :3]
        c11 = original[src_y1, src_x1, :3]
        interpolated = (c00 * (1 - fy) * (1 - fx) +
                        c01 * (1 - fy) * fx +
                        c10 * fy * (1 - fx) +
                        c11 * fy * fx)

        result[:, :, :3][border_region] = interpolated[border_region]

    # ── Ensure centre is untouched ───────────────────────────────────────
    mask[B:B+N, B:B+N] = 0.0

    # ── Compose in linear sRGB ───────────────────────────────────────────
    dark_rgb = dark_color[:3]

    def srgb_to_linear(c):
        c = c / 255.0
        return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

    def linear_to_srgb(c):
        c = np.clip(c, 0.0, 1.0)
        return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1.0 / 2.4) - 0.055)

    tex_linear = srgb_to_linear(result[..., :3])
    dark_linear = srgb_to_linear(dark_rgb)
    m = mask[:, :, np.newaxis]
    blended_linear = tex_linear * (1.0 - m) + dark_linear * m
    blended_srgb = linear_to_srgb(blended_linear)
    rgb = np.clip(blended_srgb * 255.0, 0, 255)
    rgb[B:B+N, B:B+N] = original[..., :3]

    if center_transparent:
        alpha = np.ones((out_size, out_size), dtype=np.float32) * 255
        alpha[B:B+N, B:B+N] = 0
        canvas = np.dstack([rgb, alpha])
    else:
        canvas = np.dstack([rgb, result[..., 3:4]])

    canvas = np.clip(canvas, 0, 255).astype(np.uint8)
    Image.fromarray(canvas).save(output_path, "PNG")
    print(f"Saved → {output_path}  ({out_size}×{out_size})")


def main():
    p = argparse.ArgumentParser(
        description="Generate a 9-slice frame from any tileable texture")
    p.add_argument("input", help="Input tileable texture")
    p.add_argument("--output", default="frame.png",
                   help="Output PNG path (default: frame.png)")
    p.add_argument("--border", type=int, default=None,
                   help="Frame width in px (default: auto ~10% of input)")
    p.add_argument("--depth", type=float, default=1.0,
                   help="Ellipse depth ratio; 1=quarter-circle, >1=deeper (default: 1.0)")
    p.add_argument("--curve", type=float, default=2.0,
                   help="Darkening-profile shape; 2=identity (default), <2=more gradual, >2=steeper")
    p.add_argument("--boundary-jitter", type=float, default=0.0,
                   help="Wavy edge amplitude in px (default: 0)")
    p.add_argument("--wave-freq", type=float, default=2.0,
                   help="Wave noise base frequency (cycles/edge, default: 2.0)")
    p.add_argument("--octaves", type=int, default=4,
                   help="Wave noise octaves (default: 4)")
    p.add_argument("--curve-roughness", type=float, default=0.0,
                   help="Mask roughness along edge (default: 0)")
    p.add_argument("--curve-jitter", type=float, default=0.0,
                   help="Per-pixel curve variation amplitude (default: 0)")
    p.add_argument("--seed", type=int, default=0,
                   help="RNG seed for reproducibility (default: 0)")
    p.add_argument("--center-transparent", action="store_true",
                   help="Make centre transparent (for CSS border-image)")
    args = p.parse_args()

    make_frame(
        input_path=args.input,
        output_path=args.output,
        border_width=args.border,
        depth=args.depth,
        curve=args.curve,
        boundary_jitter=args.boundary_jitter,
        wave_freq=args.wave_freq,
        octaves=args.octaves,
        curve_roughness=args.curve_roughness,
        curve_jitter=args.curve_jitter,
        seed=args.seed,
        center_transparent=args.center_transparent,
    )


if __name__ == "__main__":
    main()
