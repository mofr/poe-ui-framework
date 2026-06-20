// Automatic typography refinement: for each reference text label, render the SAME text in every
// candidate font/weight/letter-spacing (headless, our loaded web fonts), normalise both to the same
// height, and score by pixel difference of the binarised glyph silhouettes. Lowest diff = best match.
// Pure shape/proportion fitness (colour/size are handled separately). Prints a ranked winner per label.
//   node tools/font-fit.mjs
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const R = 'asset-review/text-labels';

// label → the exact text it shows (read off the crops)
const LABELS = [
  { name: 'title-white', text: 'gaearon' },
  { name: 'big-in-panel-title-not-in-header', text: 'react' },
  { name: 'panel-header', text: 'ACTIVITY FEED' },
  { name: 'small-title', text: 'Active Quests (Issues)' },
  { name: 'list-text-regular', text: 'feat: improve server component support' },
  { name: 'list-item-secondary-line', text: 'gaearon committed 2 hours ago' },
];
const FONTS = [
  ['Cinzel', 400], ['Cinzel', 600], ['Cinzel', 700],
  ['IM Fell English', 400], ['IM Fell English SC', 400],
  ['Georgia', 400], ['Georgia', 700],
  ['Inter', 300], ['Inter', 400], ['Inter', 500], ['Inter', 600],
  ['Alegreya Sans', 400], ['Alegreya Sans', 500],
  ['JetBrains Mono', 400], ['JetBrains Mono', 500],
];
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=IM+Fell+English&family=IM+Fell+English+SC&family=Inter:wght@300;400;500;600&family=Alegreya+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap';

// binarise text on black → trim to the ink bbox → {buf, w, h}. Shape diff stretches candidate to the
// ref's exact box, so the score reflects GLYPH SHAPE (serif vs sans, weight) not size/spacing/width.
async function trimmed(buf) {
  const bin = await sharp(buf).greyscale().normalise().threshold(120).png().toBuffer();
  let t; try { t = await sharp(bin).trim({ threshold: 10 }).toBuffer(); } catch { t = bin; }
  const m = await sharp(t).metadata();
  return { buf: t, w: m.width, h: m.height, aspect: m.width / m.height };
}
async function shapeDiff(ref, candBuf) {
  const c = await trimmed(candBuf);
  const cr = await sharp(c.buf).resize({ width: ref.w, height: ref.h, fit: 'fill' }).greyscale().raw().toBuffer();
  let d = 0; for (let i = 0; i < ref.raw.length; i++) d += Math.abs((ref.raw[i] > 127 ? 1 : 0) - (cr[i] > 127 ? 1 : 0));
  return { d: d / ref.raw.length, aspect: c.aspect };
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<!doctype html><link href="${FONT_LINK}" rel="stylesheet"><body style="margin:0;background:#000"><span id="t" style="color:#fff;display:inline-block;white-space:nowrap;font-size:120px;line-height:1.3;padding:10px"></span></body>`);
await page.waitForTimeout(1500);
await page.evaluate(() => document.fonts.ready);

for (const lab of LABELS) {
  const ref = await trimmed(await readFile(resolve(ROOT, R, `${lab.name}.png`)));
  ref.raw = await sharp(ref.buf).greyscale().raw().toBuffer();
  const scored = [];
  for (const [family, weight] of FONTS) {                 // spacing 0 — shape only; spacing fitted after
    await page.evaluate(({ text, family, weight }) => {
      const t = document.getElementById('t');
      t.textContent = text; t.style.fontFamily = `'${family}'`; t.style.fontWeight = weight; t.style.letterSpacing = '0em';
    }, { text: lab.text, family, weight });
    const box = await page.locator('#t').boundingBox();
    const { d, aspect } = await shapeDiff(ref, await page.screenshot({ clip: box }));
    scored.push({ font: `${family} ${weight}`, d, aspect });
  }
  scored.sort((a, b) => a.d - b.d);
  console.log(`\n${lab.name}  "${lab.text}"  (ref aspect ${ref.aspect.toFixed(2)})`);
  scored.slice(0, 3).forEach((r, i) => console.log(`  ${i ? ' ' : '►'} ${r.font.padEnd(22)} shape-diff ${(r.d * 100).toFixed(2)}%  aspect ${r.aspect.toFixed(2)}`));
}
await browser.close();
