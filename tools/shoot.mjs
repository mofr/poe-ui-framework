// Screenshot a Storybook story (server must be running on :6006).
// Usage: node tools/shoot.mjs <storyId> <outPath> [clipHeight] [width=1760] [dsf=2]
// Clips to the first .poe-panel; clipHeight limits the vertical slice (0 = full element).
import { chromium } from 'playwright';

const [, , story, out, clipH = '0', width = '1760', dsf = '2'] = process.argv;
if (!story || !out) { console.error('usage: node tools/shoot.mjs <storyId> <outPath> [clipHeight] [width] [dsf]'); process.exit(1); }

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: +width, height: 1200 }, deviceScaleFactor: +dsf });
await pg.goto(`http://localhost:6006/iframe.html?id=${story}&viewMode=story`, { waitUntil: 'networkidle' });
await pg.waitForTimeout(1300);
const el = await pg.$('.poe-panel');
const box = await el.boundingBox();
await pg.screenshot({ path: out, clip: { x: box.x, y: box.y, width: box.width, height: +clipH || box.height } });
await b.close();
console.log('shot', out);
