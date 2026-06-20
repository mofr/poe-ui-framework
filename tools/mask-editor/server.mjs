// Serves the in-repo mask editor and saves traced masks straight into the repo.
//   node tools/mask-editor/server.mjs   ->   http://localhost:5174
// Backdrop images are scanned from assets-staging/sources + asset-review.
// Masks are written to tools/masks/<name>.json (normalised contours).
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const MASKS = resolve(ROOT, 'tools/masks');
const IMG_DIRS = ['assets-staging/sources', 'asset-review'];
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
      await mkdir(MASKS, { recursive: true });
      // GLOBAL config (name/image/build/comment) grouped first, then per-contour data — kept separate.
      await writeFile(resolve(MASKS, `${name}.json`), JSON.stringify({ name, image, build, comment, contours }, null, 2));
      return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
    }
    if (req.method === 'POST' && url.pathname === '/delete') {
      const { name } = JSON.parse(await readBody(req));
      if (!name || !/^[\w-]+$/.test(name)) return send(res, 400, 'text/plain', 'bad name');
      try { await unlink(resolve(MASKS, `${name}.json`)); } catch { /* already gone */ }
      return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
    }
    if (url.pathname === '/api/images') return send(res, 200, 'application/json', JSON.stringify(await listImages()));
    if (url.pathname === '/api/masks') {
      try {
        const names = (await readdir(MASKS)).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')).sort();
        return send(res, 200, 'application/json', JSON.stringify(names));
      } catch { return send(res, 200, 'application/json', '[]'); }
    }
    if (url.pathname === '/api/mask') {
      const name = url.searchParams.get('name') || '';
      try { return send(res, 200, 'application/json', await readFile(resolve(MASKS, `${name}.json`), 'utf8')); }
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
}).listen(PORT, () => console.log(`mask editor -> http://localhost:${PORT}  (masks -> tools/masks/, rebuild with: node tools/build-mask.mjs <name>)`));
