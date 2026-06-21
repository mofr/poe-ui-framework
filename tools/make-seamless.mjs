// Make a texture tile seamless by OFFSET + INPAINT: circularly shift it by half (so the tiling seam moves to
// the centre, where the new edges are now continuous), then let LaMa INPAINT a band along that central cross.
// LaMa synthesises plausible matching texture across the seam — so detail is preserved (not blurred) and the
// two sides actually connect (no brightness ramp, no visible "healing edge"). Edges stay seamless: the mask
// only covers the centre, so the (already-continuous) borders are untouched.
//   node tools/make-seamless.mjs <in.png> <out.png> [--band=28]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { unlink } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png> [--band=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '').split('=')));
const band = Number(opt.band ?? 28);     // half-width of the inpainted band along the seam cross (px)

const src = sharp(resolve(ROOT, inArg)).removeAlpha();
const { width: W, height: H } = await src.metadata();
const base = await src.png().toBuffer();

// circular shift by (W/2, H/2): tile 2×2, then extract the centre at the half-offset. NOTE: the extract MUST
// be a separate sharp() call — chaining .composite().extract() leaves extract a no-op.
const tiled = await sharp({ create: { width: 2 * W, height: 2 * H, channels: 3, background: '#000' } })
  .composite([{ input: base, left: 0, top: 0 }, { input: base, left: W, top: 0 },
              { input: base, left: 0, top: H }, { input: base, left: W, top: H }])
  .png().toBuffer();
const shifted = await sharp(tiled)
  .extract({ left: Math.round(W / 2), top: Math.round(H / 2), width: W, height: H }).png().toBuffer();

// inpaint mask: white cross band along the central seam (vertical at W/2, horizontal at H/2), black elsewhere.
const mask = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>`
  + `<rect x="${(W >> 1) - band}" y="0" width="${2 * band}" height="${H}" fill="#fff"/>`
  + `<rect x="0" y="${(H >> 1) - band}" width="${W}" height="${2 * band}" fill="#fff"/></svg>`)).png().toBuffer();

const tmp = tmpdir(), tag = `seamless-${process.pid}`;
const shiftedPath = resolve(tmp, `${tag}-img.png`), maskPath = resolve(tmp, `${tag}-mask.png`), lamaPath = resolve(tmp, `${tag}-out.png`);
await sharp(shifted).toFile(shiftedPath);
await sharp(mask).toFile(maskPath);
execFileSync('python3', [resolve(ROOT, 'tools/inpaint.py'), shiftedPath, maskPath, lamaPath], { stdio: 'inherit' });

// LaMa pads to a multiple of 8 — crop back to W×H (top-left aligned, so the seamless borders are preserved).
await sharp(lamaPath).extract({ left: 0, top: 0, width: W, height: H }).png().toFile(resolve(ROOT, outArg));
await Promise.all([shiftedPath, maskPath, lamaPath].map(p => unlink(p).catch(() => {})));
console.log(`seamless ${W}x${H} (offset + LaMa inpaint, band ±${band}) -> ${outArg}`);
