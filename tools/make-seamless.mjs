// Make a texture tile seamless by OFFSET + DE-STEP: circularly shift it by half (so the tiling seam moves
// to the centre, where the new edges are now continuous), then cancel ONLY the brightness STEP along that
// central cross with a smooth additive ramp. Texture detail is left untouched — no blur — so nothing is
// lost in the healed area; just the slow brightness mismatch between the two sides is removed.
//   node tools/make-seamless.mjs <in.png> <out.png> [--span=80] [--smooth=30]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png> [--span=] [--smooth=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '').split('=')));
const span = Number(opt.span ?? 80);     // how far the correction ramp reaches each side of the seam (px) — wide is fine, it's only brightness
const smoothSig = Number(opt.smooth ?? 30); // smoothing of the per-row/col step so only the consistent seam offset is cancelled, not texture

const src = sharp(resolve(ROOT, inArg)).removeAlpha();
const { width: W, height: H } = await src.metadata();
const base = await src.png().toBuffer();

// circular shift by (W/2, H/2): tile 2×2, then extract the centre WxH at the half-offset. NOTE: the
// extract MUST be a separate sharp() call — chaining .composite().extract() leaves extract a no-op.
const tiled = await sharp({ create: { width: 2 * W, height: 2 * H, channels: 3, background: '#000' } })
  .composite([{ input: base, left: 0, top: 0 }, { input: base, left: W, top: 0 },
              { input: base, left: 0, top: H }, { input: base, left: W, top: H }])
  .png().toBuffer();
const shifted = await sharp(tiled)
  .extract({ left: Math.round(W / 2), top: Math.round(H / 2), width: W, height: H })
  .png().toBuffer();

const buf = Buffer.from(await sharp(shifted).removeAlpha().raw().toBuffer());   // mutable RGB
const cx = W >> 1, cy = H >> 1;                                                 // seam sits between cx-1|cx and cy-1|cy
const clamp = v => v < 0 ? 0 : v > 255 ? 255 : v;
const ramp = d => 0.5 * (1 + Math.cos(Math.PI * d / span));                     // 1 at the seam → 0 at span, flat ends (no kink)

// 1-D gaussian smoothing — keeps the CONSISTENT seam offset, drops per-pixel texture variation.
function smooth(arr) {
  const r = Math.ceil(smoothSig * 2), k = [];
  let ks = 0; for (let i = -r; i <= r; i++) { const v = Math.exp(-i * i / (2 * smoothSig * smoothSig)); k.push(v); ks += v; }
  const out = new Float64Array(arr.length);
  for (let i = 0; i < arr.length; i++) { let s = 0; for (let j = -r; j <= r; j++) s += arr[Math.min(arr.length - 1, Math.max(0, i + j))] * k[j + r]; out[i] = s / ks; }
  return out;
}

// Cancel the step at a seam by adding +offset/2 (decaying) to the low side and −offset/2 to the high side,
// so the two columns/rows meet, while the smooth ramp leaves all texture detail intact.
for (let c = 0; c < 3; c++) {
  // vertical seam at column cx
  const jv = new Float64Array(H);
  for (let y = 0; y < H; y++) jv[y] = buf[(y * W + cx) * 3 + c] - buf[(y * W + cx - 1) * 3 + c];
  const sv = smooth(jv);
  for (let y = 0; y < H; y++) for (let d = 0; d < span; d++) {
    const w = 0.5 * sv[y] * ramp(d);
    const xl = cx - 1 - d, xr = cx + d;
    if (xl >= 0) { const i = (y * W + xl) * 3 + c; buf[i] = clamp(buf[i] + w); }
    if (xr < W) { const i = (y * W + xr) * 3 + c; buf[i] = clamp(buf[i] - w); }
  }
  // horizontal seam at row cy
  const jh = new Float64Array(W);
  for (let x = 0; x < W; x++) jh[x] = buf[(cy * W + x) * 3 + c] - buf[((cy - 1) * W + x) * 3 + c];
  const sh = smooth(jh);
  for (let x = 0; x < W; x++) for (let d = 0; d < span; d++) {
    const w = 0.5 * sh[x] * ramp(d);
    const yt = cy - 1 - d, yb = cy + d;
    if (yt >= 0) { const i = (yt * W + x) * 3 + c; buf[i] = clamp(buf[i] + w); }
    if (yb < H) { const i = (yb * W + x) * 3 + c; buf[i] = clamp(buf[i] - w); }
  }
}

await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toFile(resolve(ROOT, outArg));
console.log(`seamless ${W}x${H} (span ${span}, smooth ${smoothSig}, no blur — detail preserved) -> ${outArg}`);
