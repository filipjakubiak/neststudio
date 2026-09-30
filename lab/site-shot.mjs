import { chromium } from 'playwright-core';
import fs from 'node:fs';
// v2 site walk-through: viewport shots every ~0.9 screen while scrolling like a person (bands and
// reveals depend on scroll, so a fullPage shot would lie). Needs `node lab/serve.mjs 4801 ../out`.
// node lab/site-shot.mjs [path=/] [name=pl]
const [, , route = '/', name = 'pl'] = process.argv;
const url = 'http://localhost:4801' + route;
fs.mkdirSync('shots/site', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
async function walk(viewport, tag, opts = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${tag}: ${m.text()}`);
    if (m.text().startsWith('[bands]')) console.log(tag, m.text());
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round(viewport.height * 0.9);
  let i = 0;
  const shot = () => page.screenshot({ path: `shots/site/${name}-${tag}-${String(i++).padStart(2, '0')}.png` });
  await shot();
  for (let y = step; y < H - viewport.height / 3 && i < 40; y += step) {
    for (let k = 1; k <= 5; k++) { await page.mouse.wheel(0, step / 5); await page.waitForTimeout(70); }
    await page.waitForTimeout(1100);
    await shot();
  }
  const state = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight,
    bands: document.querySelector('canvas.bands')?.dataset.ready,
    videos: [...document.querySelectorAll('video')].map((v) => ({ src: v.currentSrc.split('/').slice(-2).join('/'), paused: v.paused, t: +v.currentTime.toFixed(1) })),
    motion: document.documentElement.dataset.motion,
  }));
  console.log(tag, JSON.stringify(state));
  await ctx.close();
  return i;
}
console.log('desktop shots', await walk({ width: 1440, height: 900 }, 'd'));
console.log('mobile shots', await walk({ width: 390, height: 844 }, 'm'));
console.log('reduced shots', await walk({ width: 1440, height: 900 }, 'r', { reduced: true }));
console.log('errors', JSON.stringify([...new Set(errors)]));
await browser.close();
