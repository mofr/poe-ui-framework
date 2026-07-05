// Dump rendered leaf-text boxes of a story, normalized to the outer .poe-panel and scaled to the
// reference master (1680x945) so they compare directly against a *.mask.json. Eyeball-free layout check.
// Usage: node tools/dom-boxes.mjs [storyId]
import { chromium } from 'playwright';

const story = process.argv[2] || 'reference-reconstruction--dashboard';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1760, height: 1200 } });
await pg.goto(`http://localhost:6006/iframe.html?id=${story}&viewMode=story`, { waitUntil: 'networkidle' });
await pg.waitForTimeout(1200);
const rows = await pg.evaluate(() => {
  const panel = document.querySelector('.poe-panel').getBoundingClientRect();
  const nb = r => [
    Math.round((r.left - panel.left) / panel.width * 1680),
    Math.round((r.right - panel.left) / panel.width * 1680),
    Math.round((r.top - panel.top) / panel.height * 945),
    Math.round((r.bottom - panel.top) / panel.height * 945),
  ];
  const out = [];
  for (const e of document.querySelectorAll('div')) {
    const t = e.textContent.trim();
    if (t && t.length < 40 && e.querySelectorAll('div').length === 0) {
      const [x0, x1, y0, y1] = nb(e.getBoundingClientRect());
      out.push(`${t.slice(0, 28).padEnd(30)} x ${x0}-${x1} (w${x1 - x0})  y ${y0}-${y1}`);
    }
  }
  const c = document.querySelector('.poe-panel__content').getBoundingClientRect();
  out.push(`[content-box right] ${Math.round((c.right - panel.left) / panel.width * 1680)}`);
  return out;
});
await b.close();
console.log(rows.join('\n'));
