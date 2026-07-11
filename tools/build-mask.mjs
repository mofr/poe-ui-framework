// Single entry point to (re)build a mask's asset with the CORRECT tool — recorded in the mask's GLOBAL
// `build` field — so regeneration can never pick the wrong tool and regress.
//   node tools/build-mask.mjs <maskName>
//
// build values (each names the artifact produced):
//   'frame'           → tools/cut-panel.mjs     (frame cut whole from keep contours + integration halo)
//   'frame-assembled' → tools/cut-panel.mjs     (frame tiled gapless from edge+corner contours + halo)
//   'sprite'          → tools/cut-mask.mjs      (trimmed cutout; several keep contours → one PNG per contour)
//   'tile'            → tools/make-bg-tiles.mjs (seamless texture tile per keep region)
//
// OUTPUT CONVENTION (fixed — no per-mask paths): every asset lands next to its mask,
//   <mask-dir>/<name>.png   (+ <name>.integration.png for frames; <name>.<contour>.png per multi-sprite region)
// and the mask's internal `name` equals its file basename, so mask, JSON and PNG always share one name.
//
// If the mask has any op:'inpaint' contours, the cleaned plate is produced FIRST (LaMa) and passed as
// --src to the build tool, so painted-over obstacles are reconstructed before cutting.
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fullName = process.argv[2];
if (!fullName) { console.error('usage: node tools/build-mask.mjs <maskName>'); process.exit(1); }
const name = fullName.split('/').pop();    // accept path-ish input; the basename IS the mask name

const TOOLS = { frame: 'cut-panel.mjs', 'frame-assembled': 'cut-panel.mjs', sprite: 'cut-mask.mjs', tile: 'make-bg-tiles.mjs' };

const mask = JSON.parse(await readFile(await findMaskPath(name), 'utf8'));
const build = mask.build;
if (!build || !TOOLS[build]) {
  console.error(`mask "${name}" has no valid global "build" field. Set one of: ${Object.keys(TOOLS).join(', ')}.\n` +
                `(This is what makes regeneration reliable — the tool is recorded WITH the mask.)`);
  process.exit(1);
}

const run = (script, args) => { console.log(`$ node tools/${script} ${args.join(' ')}`); execFileSync('node', [resolve(ROOT, 'tools', script), ...args], { stdio: 'inherit' }); };

// Inpaint first if the mask reconstructs obstacles, then build FROM the cleaned plate.
const hasInpaint = (mask.contours || []).some(c => c.op === 'inpaint');
const args = [name];
if (hasInpaint) {
  run('inpaint-mask.mjs', [name]);
  const plate = `assets-staging/sources/${name}-inpainted.png`;
  if (!existsSync(resolve(ROOT, plate))) { console.error(`expected cleaned plate ${plate} not found`); process.exit(1); }
  args.push(`--src=${plate}`);
}
if (build === 'frame' || build === 'frame-assembled') {
  if (mask.fade != null) args.push(`--fade=${mask.fade}`);
} else if (build === 'sprite') {
  const keeps = (mask.contours || []).filter(c => (c.op || 'keep') === 'keep');
  if (keeps.length > 1) args.push('--each');
}
run(TOOLS[build], args);
console.log(`\n✓ built "${name}" via ${build}${hasInpaint ? ' (inpaint → ' + build + ')' : ''}`);

// INTEGRATION METHOD (opt-in per mask). Default (field absent) = the legacy stone raster produced above.
// `integration: "neutral"` ALSO derives background-agnostic shadow+highlight maps (LaMa baseline). The
// component's CSS chooses which asset to reference; this only governs regeneration. Panels omit the field.
if (mask.integration === 'neutral') {
  const py = resolve(ROOT, 'tools', 'integration-neutral.py');
  console.log(`$ python3 tools/integration-neutral.py ${name}`);
  execFileSync('python3', [py, name], { stdio: 'inherit' });
  console.log(`✓ + neutral integration maps for "${name}"`);
}
