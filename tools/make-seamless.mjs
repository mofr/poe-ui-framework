// Make a texture tile seamless. OFFSET the tile by half (seam → centre, borders continuous), then heal the
// central cross by COMBINING two cues so we get the best of each:
//   • LaMa inpaint over the seam band  → continuous TEXTURE across the seam (fixes the pattern mismatch),
//     but LaMa invents a slight colour/hue cast.
//   • a 1-D membrane step-cancel        → a seamless, correctly-coloured field (no hue cast), but it can't
//     reconnect texture on its own.
// Final band = LaMa's HIGH-frequency detail + the membrane's LOW-frequency colour. So: matching texture,
// true stone colour, no blur, no ramp edge. Borders stay seamless — the combine only touches the centre.
//   node tools/make-seamless.mjs <in.png> <out.png> [--band=28] [--split=24]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { unlink } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png> [--band=] [--split=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '').split('=')));
const band = Number(opt.band ?? 28);     // half-width of the seam cross we inpaint + recolour (px)
const split = Number(opt.split ?? 24);   // blur sigma separating LaMa texture (high) from membrane colour (low)
const SPAN = 80, SMOOTH = 30;            // membrane: ramp reach + step-smoothing

const src = sharp(resolve(ROOT, inArg)).removeAlpha();
const { width: W, height: H } = await src.metadata();
const base = await src.png().toBuffer();
const raw = b => sharp(b).removeAlpha().raw().toBuffer();
const clamp = v => v < 0 ? 0 : v > 255 ? 255 : v;

// 1) circular shift by half (separate extract — chaining .composite().extract() is a no-op).
const tiled = await sharp({ create: { width: 2 * W, height: 2 * H, channels: 3, background: '#000' } })
  .composite([{ input: base, left: 0, top: 0 }, { input: base, left: W, top: 0 },
              { input: base, left: 0, top: H }, { input: base, left: W, top: H }]).png().toBuffer();
const shifted = await sharp(tiled).extract({ left: Math.round(W / 2), top: Math.round(H / 2), width: W, height: H }).png().toBuffer();

// 2) LaMa inpaint a band along the seam cross → texture-continuous (but hue-shifted) result.
const mask = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>`
  + `<rect x="${(W >> 1) - band}" y="0" width="${2 * band}" height="${H}" fill="#fff"/>`
  + `<rect x="0" y="${(H >> 1) - band}" width="${W}" height="${2 * band}" fill="#fff"/></svg>`)).png().toBuffer();
const tmp = tmpdir(), tag = `seamless-${process.pid}`;
const p = n => resolve(tmp, `${tag}-${n}.png`);
await sharp(shifted).toFile(p('img')); await sharp(mask).toFile(p('mask'));
execFileSync('python3', [resolve(ROOT, 'tools/inpaint.py'), p('img'), p('mask'), p('out')], { stdio: 'inherit' });
const lama = await sharp(p('out')).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();  // crop LaMa's mult-of-8 pad

// 3) membrane colour reference: cancel the per-row/col brightness+colour STEP with a smooth additive ramp.
const ref = Buffer.from(await raw(shifted));
const cx = W >> 1, cy = H >> 1;
const rampW = d => 0.5 * (1 + Math.cos(Math.PI * d / SPAN));
const smooth = arr => { const r = Math.ceil(SMOOTH * 2), k = []; let ks = 0; for (let i = -r; i <= r; i++) { const v = Math.exp(-i * i / (2 * SMOOTH * SMOOTH)); k.push(v); ks += v; } const o = new Float64Array(arr.length); for (let i = 0; i < arr.length; i++) { let s = 0; for (let j = -r; j <= r; j++) s += arr[Math.min(arr.length - 1, Math.max(0, i + j))] * k[j + r]; o[i] = s / ks; } return o; };
for (let c = 0; c < 3; c++) {
  const jv = new Float64Array(H); for (let y = 0; y < H; y++) jv[y] = ref[(y * W + cx) * 3 + c] - ref[(y * W + cx - 1) * 3 + c];
  const sv = smooth(jv);
  for (let y = 0; y < H; y++) for (let d = 0; d < SPAN; d++) { const w = 0.5 * sv[y] * rampW(d); const xl = cx - 1 - d, xr = cx + d; if (xl >= 0) { const i = (y * W + xl) * 3 + c; ref[i] = clamp(ref[i] + w); } if (xr < W) { const i = (y * W + xr) * 3 + c; ref[i] = clamp(ref[i] - w); } }
  const jh = new Float64Array(W); for (let x = 0; x < W; x++) jh[x] = ref[(cy * W + x) * 3 + c] - ref[((cy - 1) * W + x) * 3 + c];
  const sh = smooth(jh);
  for (let x = 0; x < W; x++) for (let d = 0; d < SPAN; d++) { const w = 0.5 * sh[x] * rampW(d); const yt = cy - 1 - d, yb = cy + d; if (yt >= 0) { const i = (yt * W + x) * 3 + c; ref[i] = clamp(ref[i] + w); } if (yb < H) { const i = (yb * W + x) * 3 + c; ref[i] = clamp(ref[i] - w); } }
}

// 4) combine in the (feathered) seam band: LaMa high-freq + membrane low-freq colour; keep shifted elsewhere
//    so the seamless borders are never touched by the (non-wrapping) blur.
const sBuf = await raw(shifted), lBuf = await raw(lama);
const lLow = await raw(await sharp(lama).blur(split).png().toBuffer());        // LaMa's colour (hue-shifted)
const rLow = await raw(await sharp(ref, { raw: { width: W, height: H, channels: 3 } }).blur(split).png().toBuffer()); // true colour
const feather = band;                                                         // smoothstep over ±band beyond the cross
const wAt = (v, c) => { const d = Math.abs(v - c); return d <= band ? 1 : d >= band + feather ? 0 : 0.5 * (1 + Math.cos(Math.PI * (d - band) / feather)); };
const out = Buffer.from(sBuf);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const m = Math.max(wAt(x, cx), wAt(y, cy)); if (m === 0) continue;
  for (let c = 0; c < 3; c++) { const i = (y * W + x) * 3 + c; const combo = clamp(lBuf[i] - lLow[i] + rLow[i]); out[i] = Math.round(sBuf[i] * (1 - m) + combo * m); }
}
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(resolve(ROOT, outArg));
await Promise.all(['img', 'mask', 'out'].map(n => unlink(p(n)).catch(() => {})));
console.log(`seamless ${W}x${H} (offset + LaMa texture + membrane colour, band ±${band}, split ${split}) -> ${outArg}`);
