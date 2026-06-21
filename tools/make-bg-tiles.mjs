// Turn each KEEP region of a backgrounds-style mask into a SEAMLESS tileable texture.
// Samples the LARGEST axis-aligned rectangle INSCRIBED IN THE POLYGON (so it stays inside the
// traced clean material — never the bbox, which can spill into neighbouring UI), then mirror-tiles
// (2×2 reflect) so it repeats with no seam. Output → src/assets/backgrounds/tile-<slug>.png.
//   node tools/make-bg-tiles.mjs <maskName> [--src=clean-plate] [--inset=0.06] [--out=src/assets/backgrounds]
// The mask's `out` (object: contour name → path, repo-relative) routes each region; unmapped regions
// fall back to tile-<slug>.png in --out.
import { readFile, mkdir } from 'node:fs/promises';
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
const inset = Number(opt.inset ?? 0.06);
const outDir = resolve(ROOT, opt.out || 'src/assets/backgrounds');
const outMap = (mask.out && typeof mask.out === 'object') ? mask.out : null;
const slug = s => (s || 'region').replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '');

// largest all-inside axis-aligned rectangle of a binary mask (histogram method)
function maxRect(m) {
  const ht = new Int32Array(W); let best = { area: 0, l: 0, r: 0, t: 0, b: 0 };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) ht[x] = m[y * W + x] > 127 ? ht[x] + 1 : 0;
    const st = [];
    for (let x = 0; x <= W; x++) {
      const h = x < W ? ht[x] : 0; let start = x;
      while (st.length && st[st.length - 1].h > h) {
        const top = st.pop(); const area = top.h * (x - top.x);
        if (area > best.area) best = { area, l: top.x, r: x - 1, t: y - top.h + 1, b: y };
        start = top.x;
      }
      st.push({ x: start, h });
    }
  }
  return best;
}

for (const c of (mask.contours || []).filter(c => (c.op || 'keep') === 'keep')) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${buildPathD([c], W, H)}" fill="#fff"/></svg>`;
  const m = await sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w').raw().toBuffer();
  const rect = maxRect(m);
  const iw = (rect.r - rect.l) * inset, ih = (rect.b - rect.t) * inset;
  const box = { left: Math.round(rect.l + iw), top: Math.round(rect.t + ih), width: Math.max(2, Math.round(rect.r - rect.l - 2 * iw)), height: Math.max(2, Math.round(rect.b - rect.t - 2 * ih)) };
  // FLATTEN the low-frequency lighting gradient (the page's light falloff) so mirror-tiling doesn't
  // create contrast bands and samples from different locations match in tone. = crop − blur + mean
  // (high-pass + DC). Lighting is re-applied at the page level (CSS gradient), not baked in the tile.
  const cw = box.width, ch = box.height, n = cw * ch;
  const raw = await sharp(srcPath).extract(box).removeAlpha().raw().toBuffer();
  const blur = await sharp(raw, { raw: { width: cw, height: ch, channels: 3 } }).blur(Math.max(8, Math.max(cw, ch) / 3)).raw().toBuffer();
  const mean = [0, 0, 0];
  for (let i = 0; i < n; i++) { mean[0] += blur[i * 3]; mean[1] += blur[i * 3 + 1]; mean[2] += blur[i * 3 + 2]; }
  mean.forEach((_, k) => mean[k] /= n);
  const flat = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { const v = raw[i * 3 + k] - blur[i * 3 + k] + mean[k]; flat[i * 3 + k] = v < 0 ? 0 : v > 255 ? 255 : v; }
  const crop = await sharp(flat, { raw: { width: cw, height: ch, channels: 3 } }).png().toBuffer();
  const tile = await sharp({ create: { width: cw * 2, height: ch * 2, channels: 3, background: '#000' } })
    .composite([
      { input: crop, left: 0, top: 0 },
      { input: await sharp(crop).flop().toBuffer(), left: cw, top: 0 },
      { input: await sharp(crop).flip().toBuffer(), left: 0, top: ch },
      { input: await sharp(crop).flip().flop().toBuffer(), left: cw, top: ch },
    ]).png().toBuffer();
  const dest = (outMap && outMap[c.name]) ? resolve(ROOT, outMap[c.name]) : resolve(outDir, `tile-${slug(c.name)}.png`);
  await mkdir(dirname(dest), { recursive: true });
  await sharp(tile).toFile(dest);
  console.log(`${dest.replace(ROOT + '/', '')}  ${cw * 2}x${ch * 2}  (inscribed ${box.width}x${box.height})`);
}
