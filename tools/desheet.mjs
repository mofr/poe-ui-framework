// Recover real alpha from a checkerboard-flattened asset sheet, then auto-slice it
// into individual component PNGs via connected-component labelling on the alpha.
//   node tools/desheet.mjs assets-staging/sheets/sheet-frames.png frames
// Output: assets-staging/sliced/<tag>-<n>.png  (+ a printed index sorted by area)
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inPath, tag = 'piece'] = process.argv.slice(2);
if (!inPath) { console.error('usage: node tools/desheet.mjs <sheet.png> <tag>'); process.exit(1); }
const OUT = resolve(ROOT, 'assets-staging/sliced');
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(resolve(ROOT, inPath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;

// Auto-detect the background from the corner pixel: a MAGENTA chroma-key (clean, preferred)
// or the old light checkerboard. Build the keyed RGBA buffer here too.
const magentaBG = data[0] > 150 && data[2] > 140 && data[1] < 0.55 * Math.min(data[0], data[2]);
console.log(`  background: ${magentaBG ? 'magenta chroma-key (soft alpha + despill)' : 'light checkerboard'}`);

// Magenta soft key: spill = magenta-ness ((R+B)/2 - G). Low spill = real art (opaque),
// high spill = magenta (transparent), in-between = anti-aliased edge → FRACTIONAL alpha
// (so no hard halo). Despill pulls R,B back toward G to remove the residual pink tint.
const SPILL_LO = 24, SPILL_HI = 110;
const opaque = new Uint8Array(w * h);
const keyed = Buffer.from(data);
for (let i = 0; i < w * h; i++) {
  const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2];
  if (magentaBG) {
    const spill = (r + b) / 2 - g;
    const a = spill <= SPILL_LO ? 1 : spill >= SPILL_HI ? 0 : 1 - (spill - SPILL_LO) / (SPILL_HI - SPILL_LO);
    opaque[i] = a > 0.5 ? 1 : 0;
    keyed[i * c + (c - 1)] = Math.round(a * 255);
    if (spill > 0) { keyed[i * c] = Math.max(0, r - spill * 0.92); keyed[i * c + 2] = Math.max(0, b - spill * 0.92); }
  } else {
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    const bg = mn > 200 && mx - mn < 24;
    opaque[i] = bg ? 0 : 1;
    if (bg) keyed[i * c + (c - 1)] = 0;
  }
}

// Connected components (4-neighbour flood fill) → bounding boxes.
const seen = new Uint8Array(w * h);
const stack = new Int32Array(w * h);
const regions = [];
for (let s = 0; s < w * h; s++) {
  if (seen[s] || !opaque[s]) continue;
  let sp = 0; stack[sp++] = s; seen[s] = 1;
  let minX = w, minY = h, maxX = 0, maxY = 0, n = 0;
  while (sp) {
    const p = stack[--sp]; const x = p % w, y = (p / w) | 0; n++;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (x > 0 && !seen[p - 1] && opaque[p - 1]) { seen[p - 1] = 1; stack[sp++] = p - 1; }
    if (x < w - 1 && !seen[p + 1] && opaque[p + 1]) { seen[p + 1] = 1; stack[sp++] = p + 1; }
    if (y > 0 && !seen[p - w] && opaque[p - w]) { seen[p - w] = 1; stack[sp++] = p - w; }
    if (y < h - 1 && !seen[p + w] && opaque[p + w]) { seen[p + w] = 1; stack[sp++] = p + w; }
  }
  if (n > 2500) regions.push({ minX, minY, maxX, maxY, n });
}
regions.sort((a, b) => (b.maxX - b.minX) * (b.maxY - b.minY) - (a.maxX - a.minX) * (a.maxY - a.minY));

// (keyed RGBA buffer was built above during background detection)

let idx = 0;
for (const r of regions) {
  const pad = 6;
  const left = Math.max(0, r.minX - pad), top = Math.max(0, r.minY - pad);
  const rw = Math.min(w - left, r.maxX - r.minX + 1 + pad * 2);
  const rh = Math.min(h - top, r.maxY - r.minY + 1 + pad * 2);
  idx++;
  const name = `${tag}-${String(idx).padStart(2, '0')}.png`;
  await sharp(keyed, { raw: { width: w, height: h, channels: c } })
    .extract({ left, top, width: rw, height: rh }).png().toFile(resolve(OUT, name));
  console.log(`${name}  ${rw}x${rh}  (px=${r.n})`);
}
console.log(`\n${idx} pieces → assets-staging/sliced/`);
