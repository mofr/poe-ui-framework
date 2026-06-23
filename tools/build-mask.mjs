// Single entry point to (re)build a mask's asset with the CORRECT tool — recorded in the mask's GLOBAL
// `build` field — so regeneration can never pick the wrong tool and regress (e.g. panel-ruled-gold-1 needs
// `assemble`, not `panel`; a plain union leaves gaps at the corner/edge seams).
//   node tools/build-mask.mjs <maskName>
//
// build values:
//   'assemble' → tools/assemble-frame.mjs  (frame from separate corner+edge contours, gapless)
//   'panel'    → tools/cut-panel.mjs       (frame + integration shadow/specular)
//   'mask'     → tools/cut-mask.mjs        (single silhouette / --each regions)
//   'bg'       → tools/make-bg-tiles.mjs   (seamless tileable texture per keep region)
// If the mask has any op:'inpaint' contours, the cleaned plate is produced FIRST (LaMa) and passed as
// --src to the build tool, so painted-over obstacles are reconstructed before cutting.
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { findMaskPath } from './find-mask.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/build-mask.mjs <maskName>'); process.exit(1); }

const TOOLS = { assemble: 'assemble-frame.mjs', panel: 'cut-panel.mjs', mask: 'cut-mask.mjs', bg: 'make-bg-tiles.mjs' };

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
run(TOOLS[build], args);
console.log(`\n✓ built "${name}" via ${build}${hasInpaint ? ' (inpaint → ' + build + ')' : ''}`);
