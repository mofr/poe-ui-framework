// Serves the in-repo mask editor and saves traced masks straight into the repo.
//   node tools/mask-editor/server.mjs   ->   http://localhost:5174
// Backdrop images are scanned from inspiration + assets-staging/sources + asset-review.
// Masks are resolved by their `name` field wherever they live (colocated next to the component
// that owns them, or in inspiration/); brand-new masks default to inspiration/<name>.mask.json.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { findMaskPath, listMasks } from '../find-mask.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const NEW_MASK_DIR = resolve(ROOT, 'inspiration');   // home for masks the editor creates fresh
const IMG_DIRS = ['inspiration', 'assets-staging/sources', 'asset-review'];
const PORT = 5174;
const MIME = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

const send = (res, code, type, body) => { res.writeHead(code, { 'Content-Type': type }); res.end(body); };
const readBody = req => new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => r(b)); });

async function listImages() {
  // sources before asset-review, sorted within each dir; then float reference-like images
  // (ref-*/master/reference) to the TOP so the high-res reference is easy to pick, not buried
  // under intermediate artifacts (inpaint masks, bg tiles…).
  const out = [];
  for (const dir of IMG_DIRS) {
    try {
      const files = (await readdir(resolve(ROOT, dir))).filter(f => /\.(png|jpe?g)$/i.test(f)).sort();
      for (const f of files) out.push(`${dir}/${f}`);
    } catch { /* dir may not exist */ }
  }
  const isRef = p => /(^|\/)(ref-|reference)|master/i.test(p);
  return [...out.filter(isRef), ...out.filter(p => !isRef(p))];
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === 'POST' && url.pathname === '/save') {
      const { name, image, contours, build = '', comment = '' } = JSON.parse(await readBody(req));
      if (!name || !/^[\w-]+$/.test(name)) return send(res, 400, 'text/plain', 'bad name');
      // Write back to the mask's existing file (wherever it lives); a brand-new name lands in inspiration/.
      // MERGE over the existing file so fields the editor doesn't manage (e.g. `out` routing) survive a
      // save — otherwise every re-trace silently drops them and the next build falls back to a wrong path.
      let target, prev = {};
      try { target = await findMaskPath(name); prev = JSON.parse(await readFile(target, 'utf8')); }
      catch { target = resolve(NEW_MASK_DIR, `${name}.mask.json`); }
      await mkdir(dirname(target), { recursive: true });
      // GLOBAL config first (name/image/build/comment + preserved out/…), then per-contour data.
      const merged = { ...prev, name, image, build, comment, contours };
      await writeFile(target, JSON.stringify(merged, null, 2));
      return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
    }
    if (req.method === 'POST' && url.pathname === '/build') {
      // Recut this mask's asset via build-mask.mjs (reads the mask's `build` field, runs inpaint if needed,
      // then the right cut tool; cut-panel patches --integration-spill into the CSS). Returns the log.
      const { name } = JSON.parse(await readBody(req));
      if (!name || !/^[\w-]+$/.test(name)) return send(res, 400, 'text/plain', 'bad name');
      const out = await new Promise(r => execFile('node', [resolve(ROOT, 'tools/build-mask.mjs'), name],
        { cwd: ROOT, maxBuffer: 8 << 20 }, (err, so, se) => r({ ok: !err, log: (so || '') + (se || '') })));
      return send(res, 200, 'application/json', JSON.stringify(out));
    }
    if (req.method === 'POST' && url.pathname === '/delete') {
      const { name } = JSON.parse(await readBody(req));
      if (!name || !/^[\w-]+$/.test(name)) return send(res, 400, 'text/plain', 'bad name');
      try { await unlink(await findMaskPath(name)); } catch { /* already gone / not found */ }
      return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
    }
    if (url.pathname === '/api/images') return send(res, 200, 'application/json', JSON.stringify(await listImages()));
    if (url.pathname === '/api/masks') {
      try { return send(res, 200, 'application/json', JSON.stringify((await listMasks()).map(m => m.name))); }
      catch { return send(res, 200, 'application/json', '[]'); }
    }
    if (url.pathname === '/api/mask') {
      const name = url.searchParams.get('name') || '';
      try { return send(res, 200, 'application/json', await readFile(await findMaskPath(name), 'utf8')); }
      catch { return send(res, 404, 'application/json', 'null'); }
    }
    if (url.pathname === '/img') {
      const p = resolve(ROOT, url.searchParams.get('path') || '');
      if (!p.startsWith(ROOT + '/')) return send(res, 403, 'text/plain', 'no');
      return send(res, 200, MIME[extname(p)] || 'application/octet-stream', await readFile(p));
    }
    // static: index.html + path.mjs
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const fp = resolve(HERE, file);
    if (!fp.startsWith(HERE + '/')) return send(res, 403, 'text/plain', 'no');
    return send(res, 200, MIME[extname(fp)] || 'text/plain', await readFile(fp));
  } catch (e) {
    send(res, 404, 'text/plain', String(e.message || e));
  }
}).listen(PORT, () => console.log(`mask editor -> http://localhost:${PORT}  (masks colocated w/ components + inspiration/; rebuild with: node tools/build-mask.mjs <name>)`));
