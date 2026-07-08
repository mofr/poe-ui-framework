// Single entry point to (re)build a mask's asset with the CORRECT tool — recorded in the mask's GLOBAL
// `build` field — so regeneration can never pick the wrong tool and regress.
//   node tools/build-mask.mjs <maskName>             — short name; output defaults to <name>.png at repo root
//   node tools/build-mask.mjs <path/to/maskName>     — path preserved in default output
//
// build values:
//   'assemble' → tools/cut-panel.mjs  (frame from separate edge+corner contours + optional integration halo)
//   'panel'    → tools/cut-panel.mjs  (frame from keep contours + optional integration halo)
//   'mask'     → tools/cut-mask.mjs   (single silhouette / --each regions)
//   'bg'       → tools/make-bg-tiles.mjs (seamless tileable texture per keep region)
// If the mask has any op:'inpaint' contours, the cleaned plate is produced FIRST (LaMa) and passed as
// --src to the build tool, so painted-over obstacles are reconstructed before cutting.
import { readFile } from 'node:fs/promises';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fullName = process.argv[2];
if (!fullName) { console.error('usage: node tools/build-mask.mjs <maskName> [<path/to/maskName>]'); process.exit(1); }

// Support both short names (<maskName>) and full paths (<path/to/maskName>).
const parts = fullName.split('/');
const name = parts.pop();                  // short internal name for findMaskPath

const TOOLS = { assemble: 'cut-panel.mjs', panel: 'cut-panel.mjs', mask: 'cut-mask.mjs', bg: 'make-bg-tiles.mjs' };

const maskPath = await findMaskPath(name);
const mask = JSON.parse(await readFile(maskPath, 'utf8'));
const build = mask.build;
if (!build || !TOOLS[build]) {
  console.error(`mask "${name}" has no valid global "build" field. Set one of: ${Object.keys(TOOLS).join(', ')}.\n` +
                `(This is what makes regeneration reliable — the tool is recorded WITH the mask.)`);
  process.exit(1);
}

// DEFAULT OUTPUT CONVENTION: colocate the asset next to its mask (masks live beside the component they
// feed). So an absent `out` writes <mask-dir>/<name>.png — never the repo root. An explicit `out` still wins.
const maskDir = relative(ROOT, dirname(maskPath));
const defaultOut = n => join(maskDir, n + '.png');
const defaultInteg = n => join(maskDir, n + '.integration.png');   // integration halo = shadow AND/OR highlight (not "-shadow")

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
// --- output path ---
if (build === 'panel' || build === 'assemble') {
  // Frame + integration shadow
  const frame = (mask.out && typeof mask.out === 'object' && mask.out.frame) || defaultOut(name);
  const integ = (mask.out && typeof mask.out === 'object' && mask.out.integration) || defaultInteg(name);
  args.push(`--out-frame=${frame}`, `--out-integration=${integ}`);
  if (mask.fade != null) args.push(`--fade=${mask.fade}`);
} else if (build !== 'bg') {
  // cut-mask. An object `out` (contour name → path) means per-region cuts, each TRIMMED to its own
  // silhouette and routed by the map → --each. A string/absent `out` is one untrimmed full-frame cut.
  if (mask.out && typeof mask.out === 'object') {
    args.push('--each');
  } else {
    const out = (typeof mask.out === 'string' && mask.out) || defaultOut(name);
    args.push(`--out=${out}`);
  }
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
