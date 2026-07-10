// Reconstruct behind op:'inpaint' contours of a mask — LaMa fills them in (keeps real pixels,
// no restyle) so an obstacle on the frame (a button, text…) is REMOVED, not left as a hole.
// Produces a cleaned source plate; then cut the frame from it:
//   node tools/inpaint-mask.mjs <maskName> [--src=path] [--grow=px] [--out=path]
//   node tools/cut-mask.mjs <maskName> --src=<the cleaned plate>
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/inpaint-mask.mjs <maskName> [--src=] [--grow=px] [--out=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const mask = JSON.parse(await readFile(await findMaskPath(name), 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const { width: W, height: H } = await sharp(srcPath).metadata();
const inpaint = (mask.contours || []).filter(c => c.op === 'inpaint');
if (!inpaint.length) { console.error(`no op:'inpaint' contours in ${name} — nothing to reconstruct`); process.exit(1); }

// white = remove, black = keep (LaMa convention). Grow a few px so anti-aliased edges are fully covered.
const grow = Number(opt.grow ?? 4);
const d = buildPathD(inpaint, W, H);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="#fff"/></svg>`;
let m = sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w');
if (grow > 0) m = m.blur(grow).threshold(1);    // dilate the white region by ~grow px (blur tail: real reach ≈ 3× grow)
// PROTECT the mask's kept art (keep − hole): the dilation must never bleed LaMa onto pixels the cut
// will keep (e.g. an ornament right above an inpainted label). An inpaint region still wins where it
// is EXPLICITLY drawn over kept art — that's the point of drawing it there.
const keeps = (mask.contours || []).filter(c => (c.op || 'keep') === 'keep');
if (keeps.length) {
  const dHole = buildPathD((mask.contours || []).filter(c => c.op === 'hole'), W, H);
  const psvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`
    + `<path d="${buildPathD(keeps, W, H)}" fill="#fff"/>`
    + (dHole ? `<path d="${dHole}" fill="#000"/>` : '')
    + `<path d="${d}" fill="#000"/></svg>`;
  const notProtected = await sharp(Buffer.from(psvg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w')
    .negate().png().toBuffer();
  m = sharp(await m.png().toBuffer()).boolean(notProtected, 'and');
}
const maskPath = resolve(ROOT, `assets-staging/sources/${name}-inpaint-mask.png`);
await m.png().toFile(maskPath);

const out = resolve(ROOT, opt.out || `assets-staging/sources/${name}-inpainted.png`);
console.log(`inpainting ${inpaint.length} region(s) of ${name} (grow ${grow}px) via LaMa…`);
execFileSync('python3', [resolve(ROOT, 'tools/inpaint.py'), srcPath, maskPath, out], { stdio: 'inherit' });
// LaMa pads up to a multiple of 8 — crop back to the source size so normalised coords still align.
const om = await sharp(out).metadata();
if (om.width !== W || om.height !== H) {
  const buf = await sharp(out).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();
  await writeFile(out, buf);
}
console.log(`cleaned plate -> ${out.replace(ROOT + '/', '')} (${W}x${H})\nnow: node tools/cut-mask.mjs ${name} --src=${out.replace(ROOT + '/', '')}`);
