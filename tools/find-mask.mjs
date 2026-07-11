// Resolve a mask by name = file basename (<name>.mask.json), wherever the file now lives. Masks
// are colocated with the component that owns them (src/components/**/<Component>.<variant>.mask.json);
// parked and cross-cutting reference masks live in inspiration/. The colocated output assets share
// the basename (<name>.png …) — one name across JSON file and PNG. A duplicate basename across
// directories fails loudly (ambiguity) instead of silently building the wrong asset.
import { readdir } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEARCH = ['src/components', 'inspiration'];

async function walk(dir) {
  let ents;
  try { ents = await readdir(dir, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.name.endsWith('.mask.json')) out.push(p);
  }
  return out;
}

async function allMaskFiles() {
  const lists = await Promise.all(SEARCH.map(d => walk(resolve(ROOT, d))));
  return lists.flat();
}

// name (file basename without .mask.json) -> absolute path. Throws on miss / ambiguity so a bad
// build key fails loudly instead of silently regenerating the wrong asset.
export async function findMaskPath(name) {
  const files = await allMaskFiles();
  const hits = files.filter(f => f.endsWith(`/${name}.mask.json`));
  if (hits.length === 1) return hits[0];
  if (hits.length === 0) throw new Error(`mask "${name}" not found under ${SEARCH.join(', ')} (searched ${files.length} *.mask.json files)`);
  throw new Error(`mask "${name}" is ambiguous — ${hits.length} files share the basename: ${hits.map(h => relative(ROOT, h)).join(', ')}`);
}

// [{ name, path }] for every mask (name = basename), sorted by path — for the editor's list / save resolution.
export async function listMasks() {
  const files = await allMaskFiles();
  return files
    .map(f => ({ name: f.replace(/^.*\//, '').replace(/\.mask\.json$/, ''), path: relative(ROOT, f) }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
