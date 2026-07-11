// Recut a stored mask onto a source image at ANY resolution — the reuse win:
// author the boundary ONCE (normalised), recut crisp at every target size.
//   node tools/cut-mask.mjs <maskName> [--src=path] [--width=N] [--feather=sigma] [--out=path]
//   node tools/cut-mask.mjs <maskName> --each [--out=dir]   ← one trimmed PNG per KEEP contour
// Defaults: src = the image the mask was drawn over; width = source's native width;
//           out = colocated next to the mask: <maskdir>/<name>.png
//           (--each: <maskdir>/<name>.<contour>.png per keep contour).
// --out is an ad-hoc CLI override only; masks carry no output paths.
// --feather (CLI-only) blurs the WHOLE silhouette edge — distinct from the frame builds' --fade,
// which feathers only the integration halo's outer edge.
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/cut-mask.mjs <maskName> [--src=] [--width=] [--feather=] [--out=] [--each]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const maskPath = await findMaskPath(name);
const maskDir = dirname(maskPath);
const mask = JSON.parse(await readFile(maskPath, 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const meta = await sharp(srcPath).metadata();
const W = opt.width ? Number(opt.width) : meta.width;
const H = Math.round(W * meta.height / meta.width);
const feather = Number(opt.feather || 0);

const all = mask.contours || [];
// keep = solid; hole = punched; inpaint contours are reconstruction instructions (handled by
// inpaint-mask.mjs upstream) and don't shape the silhouette, so they're ignored here.
const holes = all.filter(c => c.op === 'hole');

async function cut(keepList, outPath, trim) {
  const dKeep = buildPathD(keepList, W, H);
  const dHole = buildPathD(holes, W, H);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`
    + `<path d="${dKeep}" fill="#fff"/>${dHole ? `<path d="${dHole}" fill="#000"/>` : ''}</svg>`;
  let m = sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w');
  if (feather > 0) m = m.blur(feather);
  const alpha = await m.raw().toBuffer();
  const img = sharp(srcPath).resize(W, H).ensureAlpha().joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } });
  if (trim) await sharp(await img.png().toBuffer()).trim().png().toFile(outPath);  // re-decode so trim sees the alpha border
  else await img.png().toFile(outPath);
}

const slug = (s, i) => (s || `region-${i}`).replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '') || `region-${i}`;

if ('each' in opt) {                       // one trimmed PNG per keep contour (multi-region masks)
  const keeps = all.filter(c => (c.op || 'keep') === 'keep');
  const dir = opt.out ? resolve(ROOT, opt.out) : maskDir;
  for (let i = 0; i < keeps.length; i++) {
    const dest = resolve(dir, `${name}.${slug(keeps[i].name, i)}.png`);
    await mkdir(dirname(dest), { recursive: true });
    await cut([keeps[i]], dest, true);
    console.log(`  ${dest.replace(ROOT + '/', '')}`);
  }
  console.log(`cut ${keeps.length} region(s) of ${name} @ ${W}x${H}`);
} else {
  const out = opt.out ? resolve(ROOT, opt.out) : resolve(maskDir, `${name}.png`);
  await mkdir(dirname(out), { recursive: true });
  await cut(all.filter(c => (c.op || 'keep') === 'keep'), out, true);  // trim → tight sprite, stretchable via background-size
  console.log(`cut ${name}: ${W}x${H} from ${opt.src || mask.image}${feather ? ` feather ${feather}` : ''} -> ${out.replace(ROOT + '/', '')}`);
}
