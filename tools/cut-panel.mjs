// Cut a PANEL mask into two layers locked together: the FRAME (op:keep minus op:hole) and the INTEGRATION
// (op:integration — a decorative contact shadow that SPILLS past the frame). The FRAME defines all geometry;
// the integration is cut to the frame box grown by its own outward overshoot, then rendered with the SAME
// slice/band but a larger outset (overhang + spill) so it stays locked to the frame while spilling outward.
// Integration is NOT clipped by the frame — overlap is intentional (frame draws over it at runtime; the
// integration is made semi-transparent so they mix).
//   node tools/cut-panel.mjs <maskName> [--src=cleaned-plate] [--feather=N] [--out-dir=src/assets/panels]
// Output paths come from the mask's `out` object: { "frame": "...", "integration": "..." } (repo-relative).
// Falls back to the legacy panel-<name>.png convention in --out-dir when `out` is absent.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/cut-panel.mjs <maskName> [--src=] [--feather=] [--out-dir=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const mask = JSON.parse(await readFile(await findMaskPath(name), 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const { width: W, height: H } = await sharp(srcPath).metadata();
const all = mask.contours || [];
const fade = Number(opt.fade ?? 2);   // integration OUTER-edge fade distance (source px); interior stays solid
const outDir = resolve(ROOT, opt['out-dir'] || 'src/assets/panels');
const out = (mask.out && typeof mask.out === 'object') ? mask.out : {};

const has = op => all.some(c => (c.op || 'keep') === op);

// 1-channel alpha for a set of contours. `outerFade` softens ONLY the outer edge (interior stays fully
// solid) via max(solid, blur) — a symmetric blur would thin the solid core, which we don't want. `cutHoles`
// punches op:hole (the interior opening). BOTH frame and integration punch it: the frame is a border, and
// the integration is the RING between the frame's outer border and its traced outline — its inner boundary
// IS the frame, so subtracting the interior keeps the ring (which still sits under the frame band) and drops
// the panel content. The user only traces the OUTER path; the inner edge comes from the frame for free.
async function alphaOf(contours, outerFade, cutHoles = true) {
  const dKeep = buildPathD(contours, W, H);
  if (!dKeep) return null;
  const dHole = cutHoles ? buildPathD(all.filter(c => c.op === 'hole'), W, H) : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${dKeep}" fill="#fff"/>${dHole ? `<path d="${dHole}" fill="#000"/>` : ''}</svg>`;
  const solid = await sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w').raw().toBuffer();
  if (outerFade <= 0) return solid;
  const blurred = await sharp(solid, { raw: { width: W, height: H, channels: 1 } }).blur(outerFade).raw().toBuffer();
  const out = Buffer.alloc(W * H);                  // max(solid, blur): keep the interior, fade only outward
  for (let i = 0; i < out.length; i++) out[i] = Math.max(solid[i], blurred[i]);
  return out;
}

const frameA = await alphaOf(all.filter(c => (c.op || 'keep') === 'keep'), 0);
// integration: the ring from the frame's outer border out to the traced outline — punch the interior hole
// so it's just the ring (not the panel content), solid near the frame + soft OUTER fade (--fade). It still
// extends under the frame band, so the frame draws over that overlap at runtime.
const integA = has('integration') ? await alphaOf(all.filter(c => c.op === 'integration'), fade) : null;

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
// FRAME BOX = the frame alone. The frame defines ALL geometry (slice/band/overhang/padding); integration
// never touches it. The integration is a SEPARATE decorative layer that visually SPILLS past the frame:
// it's cut to the frame box grown by its own outward overshoot (so the spill survives the crop) and is
// rendered with the same slice/band but a larger outset (= overhang + spill). Same slice/band + a uniform
// outset offset keeps it locked to the frame — it can't drift, and the frame's numbers don't change.
const frameBox = bboxOf(127, frameA);
const edges = a => { const b = bboxOf(20, a); return { left: b.left, top: b.top, right: b.left + b.width - 1, bottom: b.top + b.height - 1 }; };
const fe = { left: frameBox.left, top: frameBox.top, right: frameBox.left + frameBox.width - 1, bottom: frameBox.top + frameBox.height - 1 };
let integBox = null, spill = 0;
if (integA) {
  const ie = edges(integA);                          // how far integration reaches past the frame, any side
  spill = Math.max(0, fe.left - ie.left, fe.top - ie.top, ie.right - fe.right, ie.bottom - fe.bottom);
  const l = Math.max(0, fe.left - spill), t = Math.max(0, fe.top - spill);
  const r = Math.min(W - 1, fe.right + spill), b = Math.min(H - 1, fe.bottom + spill);
  integBox = { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}

async function writeLayer(alpha, box, dest) {
  const buf = await sharp(srcPath).resize(W, H).ensureAlpha()
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .extract(box).png().toBuffer();
  await mkdir(dirname(dest), { recursive: true });
  await sharp(buf).toFile(dest);
}

// Output paths: the mask's explicit `out.frame`/`out.integration`, else the legacy panel-<name>.png in
// --out-dir.
const framePath = out.frame ? resolve(ROOT, out.frame) : resolve(outDir, `panel-${name}.png`);
const integPath = out.integration ? resolve(ROOT, out.integration) : resolve(outDir, `panel-${name}-integration-shadow.png`);
const rel = p => p.replace(ROOT + '/', '');

await writeLayer(frameA, frameBox, framePath);
console.log(`frame  -> ${rel(framePath)}  ${frameBox.width}x${frameBox.height}`);
if (integA) {
  await writeLayer(integA, integBox, integPath);
  console.log(`integ. -> ${rel(integPath)}  ${integBox.width}x${integBox.height} (fade ${fade})`);
  // Write the derived spill straight into the frame's COLOCATED per-frame CSS (the frame raster path with
  // .css) — no manual copy. Best-effort: only if that file already declares --integration-spill (one rule
  // per file, so a bare match is unambiguous).
  const cssPath = framePath.replace(/\.png$/, '.css');
  if (existsSync(cssPath)) {
    const css = await readFile(cssPath, 'utf8');
    const re = /(--integration-spill:\s*)\d+px/;
    if (re.test(css)) {
      await writeFile(cssPath, css.replace(re, `$1${spill}px`));
      console.log(`         --integration-spill: ${spill}px → patched into ${rel(cssPath)}`);
    } else {
      console.log(`         spill ${spill}px → add --integration-spill: ${spill}px to ${rel(cssPath)}`);
    }
  } else {
    console.log(`         spill ${spill}px → add --integration-spill: ${spill}px to the frame's colocated CSS`);
  }
}
