// Assemble a gapless frame from SEPARATELY-traced corner + edge contours, when the reference line is
// broken by unrelated elements (so a single cut has gaps). Corners are kept as real pixels at their
// positions; each edge is rebuilt by taking the CLEANEST 1-px cross-section of its line and stretching
// it across the edge's span at the same offset → a continuous line, no gap. Then trim + 9-slice as usual.
//   node tools/assemble-frame.mjs <maskName> [--src=plate] [--out=src/assets/panels/panel-<name>.png]
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));
const mask = JSON.parse(await readFile(resolve(ROOT, 'tools/masks', `${name}.json`), 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const { width: W, height: H } = await sharp(srcPath).metadata();
const src = await sharp(srcPath).ensureAlpha().raw().toBuffer();   // RGBA

async function alphaOf(c) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${buildPathD([c], W, H)}" fill="#fff"/></svg>`;
  return sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w').raw().toBuffer();
}
const bboxOf = a => { let l = W, t = H, r = 0, b = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[y * W + x] > 30) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; } return { l, t, r, b }; };

const out = Buffer.alloc(W * H * 4);                 // transparent RGBA canvas
const put = (x, y, r, g, b, a) => { const i = (y * W + x) * 4; if (a > out[i + 3]) { out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = a; } };

const keeps = (mask.contours || []).filter(c => (c.op || 'keep') === 'keep');
// PASS 1 — edges: stretch the cleanest cross-section across the FULL side (overwriting any gap region
// where unrelated reference content broke the line), so the line reaches corner-to-corner.
for (const c of keeps.filter(c => !/^corner/i.test(c.name || ''))) {
  const a = await alphaOf(c); const bb = bboxOf(a); if (bb.r < bb.l) continue;
  const horizontal = (bb.r - bb.l) >= (bb.b - bb.t);
  // longest CLEAN run (a real, gap-free segment of the line) → tiled across the side: real pixels, no stretch.
  const longestRun = (lo, hi, hasInk) => { let bs = lo, be = lo - 1, cs = lo, run = 0; for (let i = lo; i <= hi; i++) { if (hasInk(i)) { if (run === 0) cs = i; run++; if (run > be - bs + 1) { bs = cs; be = i; } } else run = 0; } return [bs, be]; };
  if (horizontal) {
    const [ra, rb] = longestRun(bb.l, bb.r, x => { for (let y = bb.t; y <= bb.b; y++) if (a[y * W + x] > 30) return true; return false; });
    const len = rb - ra + 1;
    for (let x = 0; x < W; x++) { const sx = ra + (((x - ra) % len) + len) % len; for (let y = bb.t; y <= bb.b; y++) { const al = a[y * W + sx]; if (al > 30) { const i = (y * W + sx) * 4; put(x, y, src[i], src[i + 1], src[i + 2], al); } } }
  } else {
    const [ra, rb] = longestRun(bb.t, bb.b, y => { for (let x = bb.l; x <= bb.r; x++) if (a[y * W + x] > 30) return true; return false; });
    const len = rb - ra + 1;
    for (let y = 0; y < H; y++) { const sy = ra + (((y - ra) % len) + len) % len; for (let x = bb.l; x <= bb.r; x++) { const al = a[sy * W + x]; if (al > 30) { const i = (sy * W + x) * 4; put(x, y, src[i], src[i + 1], src[i + 2], al); } } }
  }
}
// PASS 2 — corners on top, real pixels in place (overwrite the line crossings at the corners).
for (const c of keeps.filter(c => /^corner/i.test(c.name || ''))) {
  const a = await alphaOf(c); const bb = bboxOf(a); if (bb.r < bb.l) continue;
  for (let y = bb.t; y <= bb.b; y++) for (let x = bb.l; x <= bb.r; x++) { const al = a[y * W + x]; if (al > 30) { const i = (y * W + x) * 4; const j = (y * W + x) * 4; out[j] = src[i]; out[j + 1] = src[i + 1]; out[j + 2] = src[i + 2]; out[j + 3] = Math.max(out[j + 3], al); } }
}

const outPath = resolve(ROOT, opt.out || `src/assets/panels/panel-${name}.png`);
const buf = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
await sharp(buf).trim().toFile(outPath);
const m = await sharp(outPath).metadata();
console.log(`assembled ${name} -> ${outPath.replace(ROOT + '/', '')}  ${m.width}x${m.height} (gapless: edges = stretched clean cross-section)`);
