#!/usr/bin/env python3
"""
Generate a 9-slice frame around any tileable texture.

The border is a quarter-ellipse 3D edge (depth=1 = quarter-circle).
Texture continues outward from the centre, wrapping at the tile boundary.
The arc length along the ellipse drives the UV compression; the optional
curve exponent remaps the darkening-falloff profile independently.

border / depth / curve are per-edge: pass a global (--border 64) and/or
override a single side (--border-top 96). The three shape knobs can differ
per edge; the noise knobs (jitter/wave/roughness/seed) stay global.

Usage:
  python framegen.py texture.png --output frame.png --border 64 --depth 1.5
  python framegen.py texture.png --border 48 --depth 2.0      --seed 42
  python framegen.py texture.png --border 64 --border-top 96 --curve-top 3.0
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
    with given depth ratio at planar position t. `depth` may be a scalar
    or a per-pixel array."""
    d2 = depth * depth
    return 1.0 - np.sqrt(np.clip(1.0 - t * t, 0.0, 1.0)) \
                / np.sqrt(np.clip(1.0 + (d2 - 1.0) * t * t, 1e-15, None))


def _edges4(val):
    """Expand a scalar to (top, right, bottom, left); pass a 4-seq through
    unchanged. None stays None (→ auto for border)."""
    if isinstance(val, (list, tuple)):
        return tuple(val)
    return (val, val, val, val)


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

    # ── Per-edge params (top, right, bottom, left) ───────────────────────
    # Each of border/depth/curve is a scalar (all four equal — back-compat)
    # or a 4-tuple. A border edge of None → auto ~10% of input. Equal values
    # on all four edges reproduce the original symmetric frame exactly.
    auto_b = max(48, min(128, int(N * 0.1)))
    bt, br, bb, bl = (auto_b if v is None else int(v) for v in _edges4(border_width))
    dt, dr, db, dl = (float(v) for v in _edges4(depth))
    ct, cr, cb, cl = (float(v) for v in _edges4(curve))

    out_h = N + bt + bb
    out_w = N + bl + br

    # ── Build result canvas (centre = original texture) ──────────────────
    result = np.zeros((out_h, out_w, 4), dtype=np.float32)
    result[..., 3] = 255
    result[bt:bt+N, bl:bl+N] = original

    # ── Wavy boundaries (clamped ≤0 so they never extend into centre). ───
    # Top/bottom run along width (len out_w); left/right along height (out_h).
    waves = {
        'top':    np.minimum(wavy_displacement(out_w, boundary_jitter, wave_freq, seed + 1, octaves), 0),
        'bottom': np.minimum(wavy_displacement(out_w, boundary_jitter, wave_freq, seed + 2, octaves), 0),
        'left':   np.minimum(wavy_displacement(out_h, boundary_jitter, wave_freq, seed + 3, octaves), 0),
        'right':  np.minimum(wavy_displacement(out_h, boundary_jitter, wave_freq, seed + 4, octaves), 0),
    }

    # ── Coordinate arrays ────────────────────────────────────────────────
    x_arr = np.tile(np.arange(out_w), (out_h, 1))
    y_arr = np.tile(np.arange(out_h).reshape(-1, 1), (1, out_w))

    d_top    = y_arr
    d_bottom = (out_h - 1) - y_arr
    d_left   = x_arr
    d_right  = (out_w - 1) - x_arr

    # Each edge uses its OWN border width. A width of 0 means NO border on that
    # edge — a clean sharp cut at the texture edge, no bevel/attenuation (t≡0).
    def t_from_dist(dist, B):
        if B <= 0:
            return np.zeros_like(dist, dtype=np.float64)
        return np.where(dist < B, 1.0 - dist / B, 0.0)

    t_top    = t_from_dist(d_top,    bt)
    t_bottom = t_from_dist(d_bottom, bb)
    t_left   = t_from_dist(d_left,   bl)
    t_right  = t_from_dist(d_right,  br)

    # Wavy-boundary displacement (wave ≤ 0 pushes the inner edge outward).
    # Skip zero-width edges — they have no border to displace.
    if bt > 0: t_top    = np.clip(t_top    + waves['top'][np.newaxis, :] / bt,    0.0, 1.0)
    if bb > 0: t_bottom = np.clip(t_bottom + waves['bottom'][np.newaxis, :] / bb, 0.0, 1.0)
    if bl > 0: t_left   = np.clip(t_left   + waves['left'][:, np.newaxis] / bl,   0.0, 1.0)
    if br > 0: t_right  = np.clip(t_right  + waves['right'][:, np.newaxis] / br,  0.0, 1.0)

    t_vert  = np.maximum(t_top, t_bottom)
    t_horiz = np.maximum(t_left, t_right)

    # Euclidean norm for circular corner contours (darkening only)
    t_comb = np.clip(np.sqrt(t_vert ** 2 + t_horiz ** 2), 0.0, 1.0)

    # ── Per-pixel depth/curve fields ─────────────────────────────────────
    # In an edge band the pixel takes that edge's depth/curve; in a corner
    # the two adjacent edges blend, weighted by how deep the pixel sits in
    # each (t_vert / t_horiz). Equal edges → constant field (= scalar case).
    depth_v = np.where(t_top > 0, dt, np.where(t_bottom > 0, db, dt))
    depth_h = np.where(t_left > 0, dl, np.where(t_right > 0, dr, dl))
    curve_v = np.where(t_top > 0, ct, np.where(t_bottom > 0, cb, ct))
    curve_h = np.where(t_left > 0, cl, np.where(t_right > 0, cr, cl))
    denom = t_vert + t_horiz
    safe = denom > 1e-8
    depth_eff = np.where(safe, (t_vert * depth_v + t_horiz * depth_h) / np.where(safe, denom, 1.0), dt)
    curve_base = np.where(safe, (t_vert * curve_v + t_horiz * curve_h) / np.where(safe, denom, 1.0), ct)

    # ── Curve jitter: per-pixel curve wobble along each edge (0 if unused) ─
    # Folded onto the per-edge base curve so jitter and per-edge params compose.
    j_top = j_bottom = j_left = j_right = None
    if curve_jitter > 0:
        j_top    = wavy_displacement(out_w, curve_jitter, wave_freq, seed + 21, octaves)[np.newaxis, :]
        j_bottom = wavy_displacement(out_w, curve_jitter, wave_freq, seed + 22, octaves)[np.newaxis, :]
        j_left   = wavy_displacement(out_h, curve_jitter, wave_freq, seed + 23, octaves)[:, np.newaxis]
        j_right  = wavy_displacement(out_h, curve_jitter, wave_freq, seed + 24, octaves)[:, np.newaxis]
        # Corner-average the two edge families, matching the original blend.
        c_h_field = np.where(t_top > 0, j_top, np.where(t_bottom > 0, j_bottom, 0.0))
        c_v_field = np.where(t_left > 0, j_left, np.where(t_right > 0, j_right, 0.0))
        count = ((t_top > 0) | (t_bottom > 0)).astype(float) + ((t_left > 0) | (t_right > 0)).astype(float)
        jitter_blend = np.where(count > 0, (c_h_field + c_v_field) / np.where(count > 0, count, 1.0), 0.0)
        curve_dark = np.maximum(curve_base + jitter_blend, 0.01)
    else:
        curve_dark = curve_base

    # ── Darkening mask ────────────────────────────────────────────────────
    t_comb_r = np.where(t_comb > 1e-8, t_comb ** (2.0 / curve_dark), 0.0)
    mask = ellipse_mask(t_comb_r, depth_eff)

    # ── Curve roughness: modulate mask along each edge ───────────────────
    if curve_roughness > 0:
        r_top    = wavy_displacement(out_w, curve_roughness, wave_freq, seed + 11, octaves)[np.newaxis, :]
        r_bottom = wavy_displacement(out_w, curve_roughness, wave_freq, seed + 12, octaves)[np.newaxis, :]
        r_left   = wavy_displacement(out_h, curve_roughness, wave_freq, seed + 13, octaves)[:, np.newaxis]
        r_right  = wavy_displacement(out_h, curve_roughness, wave_freq, seed + 14, octaves)[:, np.newaxis]
        r_mod = np.where(t_top > 0,    r_top,
                np.where(t_bottom > 0, r_bottom,
                np.where(t_left > 0,   r_left,
                np.where(t_right > 0,  r_right, 0.0))))
        mask = np.clip(mask + r_mod, 0.0, 1.0)

    # ── Arc-length source coordinates ─────────────────────────────────────
    # Process all non-centre pixels (including those beyond the wavy edge).
    border_region = (y_arr < bt) | (y_arr >= bt + N) | (x_arr < bl) | (x_arr >= bl + N)
    if np.any(border_region):
        # One arc-length LUT per edge (arc length depends on that edge's B/depth).
        t_lut = np.linspace(0, 1, 1000)
        L_top    = ellipse_arc_length(t_lut, bt, dt)
        L_bottom = ellipse_arc_length(t_lut, bb, db)
        L_left   = ellipse_arc_length(t_lut, bl, dl)
        L_right  = ellipse_arc_length(t_lut, br, dr)

        # Effective UV curve per edge = that edge's curve (+ jitter, if any).
        cuv_top    = np.maximum(ct + (j_top    if j_top    is not None else 0.0), 0.01)
        cuv_bottom = np.maximum(cb + (j_bottom if j_bottom is not None else 0.0), 0.01)
        cuv_left   = np.maximum(cl + (j_left   if j_left   is not None else 0.0), 0.01)
        cuv_right  = np.maximum(cr + (j_right  if j_right  is not None else 0.0), 0.01)

        def arc(t_edge, cuv, L):
            q = np.where(t_edge > 1e-8, t_edge ** (2.0 / cuv), 0.0)
            return np.interp(q, t_lut, L)

        arc_vert  = np.where(t_top > 0,  arc(t_top,  cuv_top,  L_top),
                    np.where(t_bottom > 0, arc(t_bottom, cuv_bottom, L_bottom), 0.0))
        arc_horiz = np.where(t_left > 0, arc(t_left, cuv_left, L_left),
                    np.where(t_right > 0,  arc(t_right,  cuv_right,  L_right),  0.0))

        # Source coordinate relative to centre edge. For top/bottom, x is
        # source-relative (x-bl); for left/right, y is source-relative (y-bt).
        src_yf = np.where(t_top > 0,         -arc_vert,
                 np.where(t_bottom > 0, N-1 + arc_vert, y_arr - bt))
        src_xf = np.where(t_left > 0,         -arc_horiz,
                 np.where(t_right > 0, N-1 + arc_horiz, x_arr - bl))

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
    mask[bt:bt+N, bl:bl+N] = 0.0

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
    rgb[bt:bt+N, bl:bl+N] = original[..., :3]

    if center_transparent:
        alpha = np.ones((out_h, out_w), dtype=np.float32) * 255
        alpha[bt:bt+N, bl:bl+N] = 0
        canvas = np.dstack([rgb, alpha])
    else:
        canvas = np.dstack([rgb, result[..., 3:4]])

    canvas = np.clip(canvas, 0, 255).astype(np.uint8)
    Image.fromarray(canvas).save(output_path, "PNG")
    print(f"Saved → {output_path}  ({out_w}×{out_h})  borders T{bt} R{br} B{bb} L{bl}")


def main():
    p = argparse.ArgumentParser(
        description="Generate a 9-slice frame from any tileable texture")
    p.add_argument("input", help="Input tileable texture")
    p.add_argument("--output", default="frame.png",
                   help="Output PNG path (default: frame.png)")
    # ── Shape knobs: global default + optional per-edge override ──────────
    p.add_argument("--border", type=int, default=None,
                   help="Frame width in px, all edges (default: auto ~10% of input)")
    p.add_argument("--depth", type=float, default=1.0,
                   help="Ellipse depth ratio; 1=quarter-circle, >1=deeper (default: 1.0)")
    p.add_argument("--curve", type=float, default=2.0,
                   help="Darkening-profile shape; 2=identity (default), <2=gradual, >2=steeper")
    for edge in ("top", "right", "bottom", "left"):
        p.add_argument(f"--border-{edge}", type=int, default=None,
                       help=f"Override border width on the {edge} edge")
        p.add_argument(f"--depth-{edge}", type=float, default=None,
                       help=f"Override ellipse depth on the {edge} edge")
        p.add_argument(f"--curve-{edge}", type=float, default=None,
                       help=f"Override darkening curve on the {edge} edge")
    # ── Noise knobs (global — same on every edge) ────────────────────────
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

    # Resolve each edge: per-edge override if given, else the global value.
    def per_edge(glob, name):
        return tuple(getattr(args, f"{name}_{e}") if getattr(args, f"{name}_{e}") is not None
                     else glob for e in ("top", "right", "bottom", "left"))

    make_frame(
        input_path=args.input,
        output_path=args.output,
        border_width=per_edge(args.border, "border"),
        depth=per_edge(args.depth, "depth"),
        curve=per_edge(args.curve, "curve"),
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
