// Cut a PANEL mask into ALIGNED layers: the FRAME (op:keep, minus op:hole) and the INTEGRATION
// (op:integration — contact shadow/specular). Both are cropped to the SAME union bbox so they line
// up as PoePanel's shared 9-slice layers (--src-frame / --src-integration-shadow).
//   node tools/cut-panel.mjs <maskName> [--src=cleaned-plate] [--feather=6] [--out-dir=src/assets/panels]
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/cut-panel.mjs <maskName> [--src=] [--feather=] [--out-dir=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const mask = JSON.parse(await readFile(resolve(ROOT, 'tools/masks', `${name}.json`), 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const { width: W, height: H } = await sharp(srcPath).metadata();
const all = mask.contours || [];
const feather = Number(opt.feather ?? 6);
const outDir = resolve(ROOT, opt['out-dir'] || 'src/assets/panels');

const has = op => all.some(c => (c.op || 'keep') === op);

// 1-channel alpha buffer for a set of contours (minus holes), optionally feathered.
async function alphaOf(contours, blur) {
  const dKeep = buildPathD(contours, W, H);
  if (!dKeep) return null;
  const dHole = buildPathD(all.filter(c => c.op === 'hole'), W, H);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${dKeep}" fill="#fff"/>${dHole ? `<path d="${dHole}" fill="#000"/>` : ''}</svg>`;
  let m = sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w');
  if (blur > 0) m = m.blur(blur);
  return m.raw().toBuffer();
}

const frameA = await alphaOf(all.filter(c => (c.op || 'keep') === 'keep'), 0);
const integA = has('integration') ? await alphaOf(all.filter(c => c.op === 'integration'), feather) : null;

// `th` = min alpha (0–255) for a pixel to count as INSIDE the crop. A contour edge rarely lands on a pixel
// boundary, so the boundary pixel is antialiased; th picks where we cut. 127 ≈ 50% coverage = round to the
// NEAREST pixel edge (symmetric, crisp, no AA fringe). A LOW th keeps a feathered layer's faint soft tail.
function bboxOf(th, ...alphas) {
  let l = W, t = H, r = 0, b = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (alphas.some(a => a && a[y * W + x] > th)) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
  }
  return { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}
// FRAME = its own extent at the 50% contour → crisp 9-slice edge (no 1–2px AA fringe), stable overhang.
const frameBox = bboxOf(127, frameA);
// INTEGRATION = union of frame+integration, kept at a LOW threshold so the FEATHERED contact shadow retains
// its soft tail (a 50% crop would harden the fade). Shares the frame's top/left/width, extends lower.
const integBox = integA ? bboxOf(20, frameA, integA) : null;

async function writeLayer(alpha, box, file) {
  const buf = await sharp(srcPath).resize(W, H).ensureAlpha()
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .extract(box).png().toBuffer();
  await sharp(buf).toFile(resolve(outDir, file));
}

await writeLayer(frameA, frameBox, `panel-${name}.png`);
console.log(`frame  -> panels/panel-${name}.png  ${frameBox.width}x${frameBox.height}`);
if (integA) {
  await writeLayer(integA, integBox, `panel-${name}-integration-shadow.png`);
  console.log(`integ. -> panels/panel-${name}-integration-shadow.png  ${integBox.width}x${integBox.height} (feather ${feather})`);
}
