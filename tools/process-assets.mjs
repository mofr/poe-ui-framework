// Post-process staged raster assets into src/assets/ and derive 9-slice insets.
//  - Trims the transparent margin so border-image-slice maps to the real art.
//  - For frames, scans the alpha along the center row/col to find where the
//    ornate border band ends (the hollow center begins) → border-image-slice.
//  - Writes src/assets/<category>/<name>.png + src/assets/asset-meta.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STAGING = resolve(ROOT, 'assets-staging');
const OUT = resolve(ROOT, 'src/assets');

const { assets } = JSON.parse(readFileSync(resolve(ROOT, 'tools/asset-prompts.json'), 'utf8'));

// Find the first transparent "run" scanning inward from an edge → border thickness.
function borderThickness(alphaAt, length, run, thr = 40) {
  let c = 0;
  for (let i = 0; i < length; i++) {
    if (alphaAt(i) < thr) { c++; if (c >= run) return i - run + 1; } else c = 0;
  }
  return Math.round(length * 0.2); // fallback if no hollow detected
}

async function process(asset) {
  const inPath = resolve(STAGING, `${asset.name}.png`);
  if (!existsSync(inPath)) { console.log(`• ${asset.name}: not staged, skipping`); return null; }

  // Trim fully-transparent margins.
  const trimmed = await sharp(inPath).trim({ threshold: 10 }).png().toBuffer();
  const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  const a = (x, y) => data[(y * w + x) * channels + (channels - 1)];

  const meta = { name: asset.name, category: asset.category, file: `${asset.category}/${asset.name}.png`, width: w, height: h };

  if (asset.category === 'frames') {
    const midY = h >> 1, midX = w >> 1;
    const run = Math.max(12, Math.round(Math.min(w, h) * 0.03));
    meta.slice = {
      left: borderThickness((i) => a(i, midY), w, run),
      right: borderThickness((i) => a(w - 1 - i, midY), w, run),
      top: borderThickness((i) => a(midX, i), h, run),
      bottom: borderThickness((i) => a(midX, h - 1 - i), h, run),
    };
  }

  const outDir = resolve(OUT, asset.category);
  mkdirSync(outDir, { recursive: true });
  await sharp(trimmed).toFile(resolve(outDir, `${asset.name}.png`));
  console.log(`✓ ${asset.name}: ${w}x${h}${meta.slice ? `  slice=${JSON.stringify(meta.slice)}` : ''}`);
  return meta;
}

const staged = existsSync(STAGING) ? readdirSync(STAGING).filter((f) => f.endsWith('.png')).map((f) => f.replace('.png', '')) : [];
const todo = assets.filter((a) => staged.includes(a.name));
if (!todo.length) { console.error('Nothing staged to process. Run gen-assets.mjs first.'); process.exit(1); }

const metas = [];
for (const a of todo) { const m = await process(a); if (m) metas.push(m); }
writeFileSync(resolve(OUT, 'asset-meta.json'), JSON.stringify(metas, null, 2) + '\n');
console.log(`\nWrote src/assets/asset-meta.json (${metas.length} assets)`);
