// Human-in-the-loop typography: for each reference text label, render the SAME text in every candidate
// font next to the reference crop → one comparison sheet per label. You pick the best family per role;
// then font-fit.mjs auto-tunes size/letter-spacing. Output → asset-review/type-compare-<label>.png
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Inter:wght@300;400;500&family=Alegreya+Sans:wght@400;500&family=JetBrains+Mono&display=swap';
const refURI = name => `data:image/png;base64,${readFileSync(resolve(ROOT, 'asset-review/text-labels', `${name}.png`)).toString('base64')}`;

const LABELS = [
  { name: 'title-white', text: 'gaearon', fonts: ['Cinzel', 'IM Fell English', "'IM Fell English' italic", 'Georgia', 'Inter'] },
  { name: 'big-in-panel-title-not-in-header', text: 'react', fonts: ['Cinzel', 'IM Fell English', 'Georgia', 'Inter', 'Alegreya Sans'] },
  { name: 'panel-header', text: 'ACTIVITY FEED', fonts: ['Cinzel', 'Cinzel 600', 'IM Fell English SC', 'Inter', 'Alegreya Sans'] },
  { name: 'small-title', text: 'Active Quests (Issues)', fonts: ['Cinzel', 'IM Fell English', 'Georgia', 'Inter'] },
  { name: 'list-text-regular', text: 'feat: improve server component support', fonts: ['Inter', 'Alegreya Sans', 'IM Fell English', 'Georgia'] },
];

const row = (label, content) => `<div style="display:flex;align-items:center;gap:16px;padding:6px 0;border-bottom:1px solid #222"><span style="width:200px;color:#7d8590;font:12px monospace;flex:none">${label}</span>${content}</div>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
for (const lab of LABELS) {
  const rows = [row('REFERENCE', `<img src="${refURI(lab.name)}" style="height:40px">`)];
  for (const f of lab.fonts) {
    const m = f.match(/^'?(.+?)'?( italic)?( \d+)?$/);
    const fam = m[1], italic = m[2] ? 'italic' : 'normal', wt = m[3] ? m[3].trim() : 400;
    rows.push(row(f, `<span style="color:#ece4d4;font-family:'${fam}';font-style:${italic};font-weight:${wt};font-size:34px">${lab.text}</span>`));
  }
  await page.setContent(`<!doctype html><link href="${FONT_LINK}" rel="stylesheet"><body style="margin:0;background:#15110d;padding:20px"><h3 style="color:#c9a25e;font:14px monospace">${lab.name} — pick the closest font to REFERENCE</h3>${rows.join('')}</body>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 1000, height: h + 20 });
  await page.screenshot({ path: resolve(ROOT, `asset-review/type-compare-${lab.name}.png`) });
  console.log(`type-compare-${lab.name}.png`);
}
await browser.close();
