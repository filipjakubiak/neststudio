import { chromium } from 'playwright-core';
// v2 bands prototype: viewport shots while scrolling (desktop + mobile). Needs `node lab/serve.mjs`.
const url = 'http://localhost:4800/v2-bands/';
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
async function run(viewport, name, stops) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); if (m.text().startsWith('[bands]')) console.log(name, m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const f of stops) {
    const y = Math.round(f * (H - viewport.height));
    // scroll in steps so the reveal eases like a real scroll
    for (let k = 1; k <= 6; k++) { await page.evaluate((yy) => scrollTo(0, yy), Math.round(y * k / 6)); await page.waitForTimeout(80); }
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `shots/bands-${name}-${String(Math.round(f * 100)).padStart(3, '0')}.png` });
    await page.evaluate(() => scrollTo(0, 0));
  }
  await ctx.close();
}
await run({ width: 1440, height: 900 }, 'd', [0, 0.14, 0.24, 0.5, 0.66, 0.8, 1]);
await run({ width: 390, height: 844 }, 'm', [0.1, 0.2, 0.62, 0.75]);
console.log('errors', JSON.stringify(errors));
await browser.close();
