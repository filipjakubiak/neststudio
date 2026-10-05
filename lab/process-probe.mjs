import { chromium } from 'playwright-core';
import fs from 'node:fs';
// The scrubbed process film: scroll through the pinned track like a person, and at each stop record the
// film time, the open stage and a screenshot. Then scroll back up to prove it un-draws.
// node lab/process-probe.mjs [base] [w] [h]
const [, , base = 'http://localhost:3000', w = '1440', h = '900'] = process.argv;
fs.mkdirSync('shots/process', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(base + '/#proces', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const state = () => page.evaluate(() => {
  const s = document.querySelector('#proces');
  const v = s.querySelector('video');
  const t = s.querySelector('.process-track');
  const r = t.getBoundingClientRect();
  return { scrub: s.hasAttribute('data-scrub'), y: Math.round(scrollY), trackTop: Math.round(r.top), t: +v.currentTime.toFixed(2), ready: v.readyState, src: v.currentSrc.split('/').pop(),
    open: [...s.querySelectorAll('.step')].findIndex((x) => x.hasAttribute('data-on')) + 1, p: getComputedStyle(t).getPropertyValue('--p') };
});
console.log('start', JSON.stringify(await state()));
const track = await page.evaluate(() => { const t = document.querySelector('.process-track'); return { top: t.getBoundingClientRect().top + scrollY, h: t.offsetHeight }; });
let i = 0;
for (const f of [0.02, 0.15, 0.3, 0.5, 0.7, 0.98]) {
  const y = track.top + (track.h - +h) * f;
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1600);
  console.log(`f=${f}`, JSON.stringify(await state()));
  await page.screenshot({ path: `shots/process/${w}-${i++}.png` });
}
// back up: the thread must un-draw
await page.evaluate((y) => window.scrollTo(0, y), track.top + (track.h - +h) * 0.2);
await page.waitForTimeout(1600);
console.log('back to 0.2', JSON.stringify(await state()));
console.log('errors', JSON.stringify(errs));
await browser.close();
