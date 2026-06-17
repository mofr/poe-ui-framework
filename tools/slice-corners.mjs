// Extract the 4 corner ornaments from a frame PNG as separate sprites, sized
// GENEROUSLY (bigger than the 9-slice border) so they can be layered on top of the
// edges and overlap inward over the panel body — which border-image corners cannot do.
//   node tools/slice-corners.mjs [cornerSize]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRAME = resolve(ROOT, 'src/assets/frames/panel-frame.png');
const C = Number(process.argv[2] || 140);

const { width: w, height: h } = await sharp(FRAME).metadata();
const corners = { tl: [0, 0], tr: [w - C, 0], bl: [0, h - C], br: [w - C, h - C] };
for (const [k, [left, top]] of Object.entries(corners)) {
  await sharp(FRAME).extract({ left, top, width: C, height: C })
    .toFile(resolve(ROOT, `src/assets/frames/panel-frame-${k}.png`));
  console.log(`panel-frame-${k}.png  ${C}x${C}  (from ${left},${top})`);
}
