// Make a texture tile seamless by OFFSET + HEAL: circularly shift it by half (so the tiling seam moves to
// the centre, where the new edges are now continuous), then dissolve the central cross with a masked blur.
// For low-frequency materials (stone/clay) the heal is invisible. Edges then wrap perfectly.
//   node tools/make-seamless.mjs <in.png> <out.png> [--heal=40] [--blur=12]
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png> [--heal=] [--blur=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '').split('=')));
const heal = Number(opt.heal ?? 50);   // half-width of the healed band along the central cross (px)
const blur = Number(opt.blur ?? 28);   // blur sigma used to dissolve the seam

const src = sharp(resolve(ROOT, inArg)).removeAlpha();
const { width: W, height: H } = await src.metadata();
const base = await src.png().toBuffer();

// circular shift by (W/2, H/2): tile 2×2, then extract the centre WxH at the half-offset. NOTE: the
// extract MUST be a separate sharp() call — chaining .composite().extract() leaves extract a no-op.
const tiled = await sharp({ create: { width: 2 * W, height: 2 * H, channels: 3, background: '#000' } })
  .composite([{ input: base, left: 0, top: 0 }, { input: base, left: W, top: 0 },
              { input: base, left: 0, top: H }, { input: base, left: W, top: H }])
  .png().toBuffer();
const shifted = await sharp(tiled)
  .extract({ left: Math.round(W / 2), top: Math.round(H / 2), width: W, height: H })
  .png().toBuffer();

// feathered cross mask: white along the central vertical + horizontal bands, then blurred for a soft edge.
const mask = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`
  + `<rect x="${W / 2 - heal}" y="0" width="${2 * heal}" height="${H}" fill="#fff"/>`
  + `<rect x="0" y="${H / 2 - heal}" width="${W}" height="${2 * heal}" fill="#fff"/></svg>`))
  .blur(heal / 2).greyscale().toColourspace('b-w').raw().toBuffer();

// healed = blurred copy showing only through the cross mask (mask = the alpha channel), over the shifted tile.
const blurred = await sharp(shifted).blur(blur).png().toBuffer();
const healed = await sharp(blurred).joinChannel(mask, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
await sharp(shifted).composite([{ input: healed }]).png().toFile(resolve(ROOT, outArg));
console.log(`seamless ${W}x${H} (heal ${heal}, blur ${blur}) -> ${outArg}`);
