// Generate isolated UI component assets via the OpenAI Image API with proper
// transparency. One component per call (no sprite sheets). Reads OPENAI_API_KEY
// from .env. Flags:
//   --force            regenerate even if staged
//   --model=<id>       override model (default gpt-image-1.5)
//   --ref=<path>       override the style reference image (or 'none' for text-only)
//   --tag=<suffix>     append to output filename, e.g. panel-frame.<suffix>.png (for bake-offs)
// Usage: node tools/gen-assets.mjs panel-frame button
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STAGING = resolve(ROOT, 'assets-staging');
const flag = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : def;
};

function loadKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const env = readFileSync(resolve(ROOT, '.env'), 'utf8');
  const m = env.match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^"'\n\r]+)/m);
  if (!m) throw new Error('OPENAI_API_KEY not found in env or .env');
  return m[1].trim();
}

async function callApi({ model, prompt, size, quality, referencePath, transparent }) {
  const common = { model, quality, n: '1' };
  if (transparent) { common.background = 'transparent'; common.output_format = 'png'; }
  if (referencePath) {
    const refBuf = readFileSync(resolve(ROOT, referencePath));
    const ext = referencePath.endsWith('.png') ? 'png' : referencePath.endsWith('.webp') ? 'webp' : 'jpeg';
    const form = new FormData();
    for (const [k, v] of Object.entries(common)) form.append(k, v);
    form.append('prompt', prompt);
    form.append('size', size);
    form.append('image[]', new Blob([refBuf], { type: `image/${ext}` }), `reference.${ext}`);
    return fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: form });
  }
  return fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...common, prompt, size }),
  });
}

async function generate(asset, opts) {
  const tag = opts.tag ? `.${opts.tag}` : '';
  const out = resolve(STAGING, `${asset.name}${tag}.png`);
  if (existsSync(out) && !process.argv.includes('--force')) { console.log(`• ${asset.name}${tag}: staged (──force to redo)`); return; }
  const base = { model: opts.model, prompt: asset.prompt, size: asset.size, quality: asset.quality || 'high', referencePath: opts.reference };
  console.log(`→ ${asset.name} [${opts.model}]${opts.reference ? ' +ref' : ''}...`);
  let res = await callApi({ ...base, transparent: true });
  if (!res.ok) {
    const errText = JSON.stringify(await res.clone().json()).slice(0, 300);
    // Some models reject transparent background — retry opaque so we can still judge fidelity.
    if (/background|transparent|output_format/i.test(errText)) {
      console.log(`  ⚠ ${opts.model}: no transparency support, retrying opaque`);
      res = await callApi({ ...base, transparent: false });
    }
    if (!res.ok) throw new Error(`${asset.name} [${opts.model}]: API ${res.status} — ${errText}`);
  }
  const body = await res.json();
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${asset.name} [${opts.model}]: no image — ${JSON.stringify(body).slice(0, 200)}`);
  writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log(`  ✓ ${asset.name}${tag}.png`);
}

const cfg = JSON.parse(readFileSync(resolve(ROOT, 'tools/asset-prompts.json'), 'utf8'));
const { assets } = cfg;
const refArg = flag('ref', cfg.reference);
const opts = {
  model: flag('model', 'gpt-image-1.5'),
  reference: refArg === 'none' ? null : refArg,
  tag: flag('tag', ''),
};
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const todo = wanted.length ? assets.filter((a) => wanted.includes(a.name)) : assets;
if (!todo.length) { console.error('No matching assets. Known:', assets.map((a) => a.name).join(', ')); process.exit(1); }

const KEY = loadKey();
globalThis.KEY = KEY;
mkdirSync(STAGING, { recursive: true });
for (const a of todo) await generate(a, opts);
console.log('\nStaged:', readdirSync(STAGING).join(', '));
