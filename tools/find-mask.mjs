// Resolve a mask by its internal `name` field, wherever the file now lives. Masks are colocated
// with the component that owns them (src/components/**/<Component>.<variant>.mask.json); the two
// cross-cutting reference masks live in inspiration/. The build key is the mask's `name`, NOT its
// filename, so callers stay stable (`build-mask.mjs panel-slim-dark-1`) across file moves/renames.
import { readFile, readdir } from 'node:fs/promises';
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

// name (internal `name` field) -> absolute path. Throws on miss / ambiguity so a bad build key
// fails loudly instead of silently regenerating the wrong asset.
export async function findMaskPath(name) {
  const files = await allMaskFiles();
  const hits = [];
  for (const f of files) {
    try { if (JSON.parse(await readFile(f, 'utf8')).name === name) hits.push(f); } catch { /* skip unparseable */ }
  }
  if (hits.length === 1) return hits[0];
  if (hits.length === 0) throw new Error(`mask "${name}" not found under ${SEARCH.join(', ')} (searched ${files.length} *.mask.json files)`);
  throw new Error(`mask "${name}" is ambiguous — ${hits.length} files declare it: ${hits.map(h => relative(ROOT, h)).join(', ')}`);
}

// [{ name, path }] for every mask, sorted by name — for the editor's list / save resolution.
export async function listMasks() {
  const files = await allMaskFiles();
  const out = [];
  for (const f of files) {
    try { const m = JSON.parse(await readFile(f, 'utf8')); if (m.name) out.push({ name: m.name, path: relative(ROOT, f) }); } catch { /* skip */ }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
