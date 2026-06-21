// Make a texture tileable by MIRRORING. Reflect the image into a 2×2 block (original + h-flip, v-flip,
// hv-flip) so every outer edge meets its own reflection — it then tiles with plain `repeat`, seamless BY
// CONSTRUCTION. No blur, no colour shift, no inpainting: the pixels are the original's. Ideal for
// low-contrast / non-directional materials (stone, paper, clay); the reflection symmetry is invisible there.
// The 2× mirror is resized back to the SOURCE dimensions so it's a drop-in replacement (texture then reads
// at half scale — fine for a soft background). Pass --keep2x to emit the full 2× tile at original scale.
//   node tools/make-seamless.mjs <in.png> <out.png> [--keep2x]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png> [--keep2x]'); process.exit(1); }
const keep2x = process.argv.includes('--keep2x');

const o = await sharp(resolve(ROOT, inArg)).removeAlpha().png().toBuffer();
const { width: W, height: H } = await sharp(o).metadata();
const fh = await sharp(o).flop().png().toBuffer();        // mirror X
const fv = await sharp(o).flip().png().toBuffer();        // mirror Y
const fb = await sharp(o).flip().flop().png().toBuffer(); // mirror both
let tile = sharp({ create: { width: 2 * W, height: 2 * H, channels: 3, background: '#000' } })
  .composite([{ input: o, left: 0, top: 0 }, { input: fh, left: W, top: 0 },
              { input: fv, left: 0, top: H }, { input: fb, left: W, top: H }]);
if (!keep2x) tile = sharp(await tile.png().toBuffer()).resize(W, H);   // back to source size (drop-in)
await tile.png().toFile(resolve(ROOT, outArg));
console.log(`mirror-tiled ${keep2x ? 2 * W + 'x' + 2 * H + ' (original scale)' : W + 'x' + H + ' (drop-in, half scale)'} (seamless, lossless) -> ${outArg}`);
