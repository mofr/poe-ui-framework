// Cut a PANEL mask into two layers locked together: the FRAME and the INTEGRATION halo.
// Two modes:
//   panel   — frame from keep contours via SVG rasterisation (single continuous shape).
//   assemble — frame from separate edge+corner contours, assembled gapless via tiling.
// Both modes share the same integration (op:integration) rendering pipeline.
//
// Integration (op:integration) — the soft TRANSITION HALO that blends the frame into the surface it
// sits on. NOT just a "contact shadow": whatever the reference painted around the frame is what gets
// carried, which is commonly a darkening (contact shadow) BUT just as often a lit rim / specular
// HIGHLIGHT (or both). Name it "integration", never "shadow", so the layer isn't misread as darken-only.
// The FRAME defines all geometry; the integration is cut to the frame box grown by its own
// outward overshoot, then rendered with the SAME slice/band but a larger outset (overhang + spill).
// Integration is NOT clipped by the frame — overlap is intentional (frame draws over it at runtime;
// the integration is made semi-transparent so they mix).
//   node tools/cut-panel.mjs <maskName> [--src=plate] [--fade=N] [--out-frame=] [--out-integration=]
// Output paths: --out-frame / --out-integration CLI args, then mask's `out` object
// (out.frame / out.integration), then <name>.png / <name>.integration.png at repo root.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildPathD } from './mask-editor/path.mjs';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/cut-panel.mjs <maskName> [--src=] [--fade=N] [--out-frame=] [--out-integration=]'); process.exit(1); }
const opt = Object.fromEntries(process.argv.slice(3).map(a => a.replace(/^--/, '').split('=')));

const mask = JSON.parse(await readFile(await findMaskPath(name), 'utf8'));
const srcPath = resolve(ROOT, opt.src || mask.image);
const { width: W, height: H } = await sharp(srcPath).metadata();
const all = mask.contours || [];
const fade = Number(opt.fade ?? 2);
const maskOut = (mask.out && typeof mask.out === 'object') ? mask.out : {};

const has = op => all.some(c => (c.op || 'keep') === op);

// ── Shared helpers ────────────────────────────────────────────

// 1-channel alpha for a set of contours. outerFade softens ONLY the outer edge via
// max(solid, blur). cutHoles punches op:hole contours (interior opening).
async function alphaOf(contours, outerFade, cutHoles = true) {
  const dKeep = buildPathD(contours, W, H);
  if (!dKeep) return null;
  const dHole = cutHoles ? buildPathD(all.filter(c => c.op === 'hole'), W, H) : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${dKeep}" fill="#fff"/>${dHole ? `<path d="${dHole}" fill="#000"/>` : ''}</svg>`;
  const solid = await sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w').raw().toBuffer();
  if (outerFade <= 0) return solid;
   const blurred = await sharp(solid, { raw: { width: W, height: H, channels: 1 } }).blur(outerFade).toColourspace('b-w').raw().toBuffer();
  const out = Buffer.alloc(W * H);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(solid[i], blurred[i]);
  return out;
}

function bboxOf(th, ...alphas) {
  let l = W, t = H, r = 0, b = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (alphas.some(a => a && a[y * W + x] > th)) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
  }
  return { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}

const edges = a => { const b = bboxOf(20, a); return { left: b.left, top: b.top, right: b.left + b.width - 1, bottom: b.top + b.height - 1 }; };

async function writeLayer(alpha, box, dest) {
  const buf = await sharp(srcPath).resize(W, H).ensureAlpha()
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .extract(box).png().toBuffer();
  await mkdir(dirname(dest), { recursive: true });
  await sharp(buf).toFile(dest);
}

// ── Integration halo output (shared by both modes) ──────────

async function writeIntegration(frameBox) {
  const integA = await alphaOf(all.filter(c => c.op === 'integration'), fade);
  // Exclude the FRAME footprint → the integration is ONLY the surface halo (the ring around the frame),
  // never the frame itself. The frame layer draws over its own area at runtime, so its pixels in this map
  // were redundant and made the file read like a duplicate frame. The soft frame-fill edge keeps the halo
  // strongest right at the frame and fading outward (a proper contact halo). Mirrors the neutral pipeline.
  const frameFill = await alphaOf(all.filter(c => (c.op || 'keep') === 'keep'), 0, false);
  if (frameFill) for (let i = 0; i < integA.length; i++) integA[i] = Math.round(integA[i] * (255 - frameFill[i]) / 255);
  const fe = { left: frameBox.left, top: frameBox.top, right: frameBox.left + frameBox.width - 1, bottom: frameBox.top + frameBox.height - 1 };
  const ie = edges(integA);
  const spill = Math.max(0, fe.left - ie.left, fe.top - ie.top, ie.right - fe.right, ie.bottom - fe.bottom);
  const l = Math.max(0, fe.left - spill), t = Math.max(0, fe.top - spill);
  const r = Math.min(W - 1, fe.right + spill), b = Math.min(H - 1, fe.bottom + spill);
  const integBox = { left: l, top: t, width: r - l + 1, height: b - t + 1 };
  await writeLayer(integA, integBox, integPath);
  console.log(`integ. -> ${rel(integPath)}  ${integBox.width}x${integBox.height} (fade ${fade})`);
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

// ── Output paths ──────────────────────────────────────────────

const framePath = opt['out-frame'] ? resolve(ROOT, opt['out-frame'])
  : maskOut.frame ? resolve(ROOT, maskOut.frame)
  : resolve(ROOT, `${name}.png`);
const integPath = opt['out-integration'] ? resolve(ROOT, opt['out-integration'])
  : maskOut.integration ? resolve(ROOT, maskOut.integration)
  : resolve(ROOT, `${name}.integration.png`);   // neutral: integration = shadow AND/OR highlight, not "-shadow"
const rel = p => p.replace(ROOT + '/', '');

// ── Build mode dispatch ──────────────────────────────────────

if (mask.build === 'assemble') {
  // ──────── ASSEMBLE mode: frame from separate edge+corner contours ────────

  const src = await sharp(srcPath).ensureAlpha().raw().toBuffer();
  const assembled = Buffer.alloc(W * H * 4);
  const put = (x, y, r, g, b, a) => { const i = (y * W + x) * 4; if (a > assembled[i + 3]) { assembled[i] = r; assembled[i + 1] = g; assembled[i + 2] = b; assembled[i + 3] = a; } };

  const keeps = all.filter(c => (c.op || 'keep') === 'keep');

  async function alphaOfSingle(c) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${buildPathD([c], W, H)}" fill="#fff"/></svg>`;
    return sharp(Buffer.from(svg)).flatten({ background: '#000' }).greyscale().toColourspace('b-w').raw().toBuffer();
  }
  const bboxOfSingle = a => { let l = W, t = H, r = 0, b = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[y * W + x] > 30) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; } return { l, t, r, b }; };

  let FL = W, FT = H, FR = 0, FB = 0;
  for (const c of keeps) { const bb = bboxOfSingle(await alphaOfSingle(c)); if (bb.r < bb.l) continue; if (bb.l < FL) FL = bb.l; if (bb.t < FT) FT = bb.t; if (bb.r > FR) FR = bb.r; if (bb.b > FB) FB = bb.b; }

  const longestRun = (lo, hi, hasInk) => { let bs = lo, be = lo - 1, cs = lo, run = 0; for (let i = lo; i <= hi; i++) { if (hasInk(i)) { if (run === 0) cs = i; run++; if (run > be - bs + 1) { bs = cs; be = i; } } else run = 0; } return [bs, be]; };

  // PASS 0 — collect edge data and compute perpendicular edge thicknesses
  const edgeData = [];
  let topH = 0, bottomH = 0, leftW = 0, rightW = 0;
  for (const c of keeps.filter(c => !/^corner/i.test(c.name || ''))) {
    const a = await alphaOfSingle(c); const bb = bboxOfSingle(a); if (bb.r < bb.l) continue;
    const horizontal = (bb.r - bb.l) >= (bb.b - bb.t);
    edgeData.push({ a, bb, horizontal });
    if (horizontal) {
      const h = bb.b - bb.t + 1;
      if (bb.t - FT <= FB - bb.b) topH = Math.max(topH, h); else bottomH = Math.max(bottomH, h);
    } else {
      const w = bb.r - bb.l + 1;
      if (bb.l - FL <= FR - bb.r) leftW = Math.max(leftW, w); else rightW = Math.max(rightW, w);
    }
  }

  // PASS 1 — tile the cleanest cross-section across each side, offset from corners
  for (const { a, bb, horizontal } of edgeData) {
    let peak = 0; for (let y = bb.t; y <= bb.b; y++) for (let x = bb.l; x <= bb.r; x++) { const v = a[y * W + x]; if (v > peak) peak = v; }
    const SOLID = peak * 0.9;
    if (horizontal) {
      const [ra, rb] = longestRun(bb.l, bb.r, x => { for (let y = bb.t; y <= bb.b; y++) if (a[y * W + x] >= SOLID) return true; return false; });
      const len = rb - ra + 1;
      const xLo = FL + (leftW ? leftW - 1 : 0);
      const xHi = FR - (rightW ? rightW - 1 : 0);
      for (let x = xLo; x <= xHi; x++) { const sx = ra + (((x - ra) % len) + len) % len; for (let y = bb.t; y <= bb.b; y++) { const al = a[y * W + sx]; if (al > 30) { const i = (y * W + sx) * 4; put(x, y, src[i], src[i + 1], src[i + 2], al); } } }
    } else {
      const [ra, rb] = longestRun(bb.t, bb.b, y => { for (let x = bb.l; x <= bb.r; x++) if (a[y * W + x] >= SOLID) return true; return false; });
      const len = rb - ra + 1;
      const yLo = FT + (topH ? topH - 1 : 0);
      const yHi = FB - (bottomH ? bottomH - 1 : 0);
      for (let y = yLo; y <= yHi; y++) { const sy = ra + (((y - ra) % len) + len) % len; for (let x = bb.l; x <= bb.r; x++) { const al = a[sy * W + x]; if (al > 30) { const i = (sy * W + x) * 4; put(x, y, src[i], src[i + 1], src[i + 2], al); } } }
    }
  }

  // PASS 2 — corners on top, real pixels in place
  for (const c of keeps.filter(c => /^corner/i.test(c.name || ''))) {
    const a = await alphaOfSingle(c); const bb = bboxOfSingle(a); if (bb.r < bb.l) continue;
    for (let y = bb.t; y <= bb.b; y++) for (let x = bb.l; x <= bb.r; x++) { const al = a[y * W + x]; if (al > 30) { const i = (y * W + x) * 4; const j = (y * W + x) * 4; assembled[j] = src[i]; assembled[j + 1] = src[i + 1]; assembled[j + 2] = src[i + 2]; assembled[j + 3] = Math.max(assembled[j + 3], al); } }
  }

  const frameBox = { left: FL, top: FT, width: FR - FL + 1, height: FB - FT + 1 };

  await mkdir(dirname(framePath), { recursive: true });
  await sharp(assembled, { raw: { width: W, height: H, channels: 4 } }).extract(frameBox).png().toFile(framePath);
  console.log(`frame  -> ${rel(framePath)}  ${frameBox.width}x${frameBox.height} (assemble)`);

  if (has('integration')) await writeIntegration(frameBox);

} else {
  // ──────── PANEL mode: frame from keep contours via SVG rasterisation ────────

  const frameA = await alphaOf(all.filter(c => (c.op || 'keep') === 'keep'), 0);
  const frameBox = bboxOf(127, frameA);

  await writeLayer(frameA, frameBox, framePath);
  console.log(`frame  -> ${rel(framePath)}  ${frameBox.width}x${frameBox.height}`);

  if (has('integration')) await writeIntegration(frameBox);
}
