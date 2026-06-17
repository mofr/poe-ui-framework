// Decompose a frame PNG into separately-layerable sprites so we never stretch and
// never repeat an ornament:
//   corners (tl/tr/bl/br)  — rich, overlap body+edges, drawn on top
//   edge tiles (et/eb/el/er) — PLAIN molding only (from between corner & centre), repeated
//   centre pimps (pt/pb)    — the single per-edge ornament, drawn once on top
// Reads geometry from src/assets/asset-meta.json. Output → src/assets/frames/<name>-*.png
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2] || 'panel-frame';
const meta = JSON.parse(readFileSync(resolve(ROOT, 'src/assets/asset-meta.json'), 'utf8')).find((m) => m.name === name);
const SRC = resolve(ROOT, 'src/assets/frames', `${name}.png`);
const { width: w, height: h, slice: s } = meta;

const C = 150;              // corner sprite box
const TILE = 60;            // plain-edge tile length
const PIMP_W = 96;          // top/bottom centre ornament width
const PIMP_OVER = 20;       // extra px the pimp reaches inward past the molding band

const cuts = {
  tl: [0, 0, C, C],
  tr: [w - C, 0, C, C],
  bl: [0, h - C, C, C],
  br: [w - C, h - C, C, C],
  // plain edge tiles, taken just past the corner (clean molding, no ornament)
  et: [C + 20, 0, TILE, s.top],
  eb: [C + 20, h - s.bottom, TILE, s.bottom],
  el: [0, Math.round(h / 2) - TILE / 2, s.left, TILE],
  er: [w - s.right, Math.round(h / 2) - TILE / 2, s.right, TILE],
  // centre ornaments (top/bottom for this frame), reaching inward
  pt: [Math.round(w / 2) - PIMP_W / 2, 0, PIMP_W, s.top + PIMP_OVER],
  pb: [Math.round(w / 2) - PIMP_W / 2, h - s.bottom - PIMP_OVER, PIMP_W, s.bottom + PIMP_OVER],
};

for (const [k, [left, top, width, height]] of Object.entries(cuts)) {
  await sharp(SRC).extract({ left, top, width, height }).toFile(resolve(ROOT, 'src/assets/frames', `${name}-${k}.png`));
  console.log(`${name}-${k}.png  ${width}x${height}  @${left},${top}`);
}
