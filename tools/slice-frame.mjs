// Decompose a frame PNG into separately-layerable sprites so we never stretch and
// never repeat an ornament:
//   corners (tl/tr/bl/br)   — rich, overlap body+edges, drawn on top
//   edge tiles (et/eb/el/er) — PLAIN molding only (between corner & centre), repeated
//   centre pimps (pt/pb/pl/pr) — the single per-edge ornament, drawn once on top
// Sizes scale to the frame's border thickness (from src/assets/asset-meta.json).
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2] || 'panel-frame';
const meta = JSON.parse(readFileSync(resolve(ROOT, 'src/assets/asset-meta.json'), 'utf8')).find((m) => m.name === name);
const SRC = resolve(ROOT, 'src/assets/frames', `${name}.png`);
const { width: w, height: h, slice: s } = meta;
const b = Math.max(s.top, s.right, s.bottom, s.left); // nominal border thickness

const C = Math.round(b * 2.4);     // corner sprite box (generous so the ornament isn't cropped)
const TILE = Math.round(b * 2.6);  // plain-edge tile length (bigger ⇒ less obvious repeat)
const PLEN = Math.round(b * 1.5);  // centre-ornament extent along its edge
const OVER = Math.round(b * 0.3);  // px the ornament/edge reaches inward past the molding band
const cx = Math.round(w / 2), cy = Math.round(h / 2);

const cuts = {
  tl: [0, 0, C, C], tr: [w - C, 0, C, C], bl: [0, h - C, C, C], br: [w - C, h - C, C, C],
  // plain edge tiles, taken just past the corner (clean molding band only, no ornament)
  et: [C + 16, 0, TILE, s.top], eb: [C + 16, h - s.bottom, TILE, s.bottom],
  el: [0, C + 16, s.left, TILE], er: [w - s.right, C + 16, s.right, TILE],
  // centre ornaments on every edge, reaching inward
  pt: [cx - PLEN / 2, 0, PLEN, s.top + OVER], pb: [cx - PLEN / 2, h - s.bottom - OVER, PLEN, s.bottom + OVER],
  pl: [0, cy - PLEN / 2, s.left + OVER, PLEN], pr: [w - s.right - OVER, cy - PLEN / 2, s.right + OVER, PLEN],
};

for (const [k, [left, top, width, height]] of Object.entries(cuts)) {
  await sharp(SRC).extract({ left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) })
    .toFile(resolve(ROOT, 'src/assets/frames', `${name}-${k}.png`));
  console.log(`${name}-${k}.png  ${Math.round(width)}x${Math.round(height)}  @${Math.round(left)},${Math.round(top)}`);
}
console.log(`\nedge tile=${TILE}px  corner=${C}px  pimp=${PLEN}px  over=${OVER}px`);
