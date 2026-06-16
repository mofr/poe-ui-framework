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

// Key out the light, desaturated checkerboard → alpha 0. Dark stone / saturated
// gold / blue trim are kept. opaque[i] = 1 means "part of a component".
const opaque = new Uint8Array(w * h);
for (let i = 0; i < w * h; i++) {
  const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2];
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  const isChecker = mn > 200 && mx - mn < 24; // light + desaturated
  opaque[i] = isChecker ? 0 : 1;
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

// Build a keyed RGBA buffer (checker → transparent) once, then crop each region.
const keyed = Buffer.from(data);
for (let i = 0; i < w * h; i++) if (!opaque[i]) keyed[i * c + (c - 1)] = 0;

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
