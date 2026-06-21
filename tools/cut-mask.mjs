// Recut a stored mask onto a source image at ANY resolution — the reuse win:
// author the boundary ONCE (normalised), recut crisp at every target size.
//   node tools/cut-mask.mjs <maskName> [--src=path] [--width=N] [--feather=sigma] [--out=path]
//   node tools/cut-mask.mjs <maskName> --each [--out=dir]   ← one trimmed PNG per KEEP contour
// Defaults: src = the image the mask was drawn over; width = source's native width;
//           out = asset-review/cut-<name>.png  (or, with --each, the dir asset-review/<name>/).
// The mask's `out` overrides those: a string (single) or an object mapping contour name → path (--each).
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/cut-mask.mjs <maskName> [--src=] [--width=] [--feather=] [--out=] [--each]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const mask = JSON.parse(await readFile(resolve(ROOT, 'tools/masks', `${name}.json`), 'utf8'));
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

// `out` from the mask: a per-contour map (object) for --each, or a single path (string).
const outMap = (mask.out && typeof mask.out === 'object') ? mask.out : null;

if ('each' in opt) {                       // one trimmed PNG per keep contour (multi-region masks)
  const keeps = all.filter(c => (c.op || 'keep') === 'keep');
  const dir = resolve(ROOT, opt.out || `asset-review/${name}`);
  for (let i = 0; i < keeps.length; i++) {
    // route by contour name → out[name] when mapped, else the slugged file in the default dir
    const mapped = outMap && outMap[keeps[i].name];
    const dest = mapped ? resolve(ROOT, mapped) : resolve(dir, `${slug(keeps[i].name, i)}.png`);
    await mkdir(dirname(dest), { recursive: true });
    await cut([keeps[i]], dest, true);
    console.log(`  ${dest.replace(ROOT + '/', '')}`);
  }
  console.log(`cut ${keeps.length} region(s) of ${name} @ ${W}x${H}`);
} else {
  const out = resolve(ROOT, opt.out || (typeof mask.out === 'string' ? mask.out : '') || `asset-review/cut-${name}.png`);
  await mkdir(dirname(out), { recursive: true });
  await cut(all.filter(c => (c.op || 'keep') === 'keep'), out, false);
  console.log(`cut ${name}: ${W}x${H} from ${opt.src || mask.image}${feather ? ` feather ${feather}` : ''} -> ${out.replace(ROOT + '/', '')}`);
}
