import { chromium } from 'playwright-core';
// screenshots of hero at t=0.3s (preloader), t=3.5s (after intro), then scroll into tension at 3 positions
const [,, url, prefix] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text().slice(0, 300)}`); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);
await page.screenshot({ path: `${prefix}-0-preloader.png` });
await page.waitForTimeout(3600);
await page.screenshot({ path: `${prefix}-1-hero.png` });
const status = await page.evaluate(() => ({ scene: document.documentElement.dataset.scene, canvasMode: document.querySelector('.scene-canvas')?.dataset.mode, ready: window.__nestReady, lenis: !!window.__lenis, h: document.documentElement.scrollHeight }));
console.log(JSON.stringify(status));
for (const [i, y] of [[2, 600], [3, 1100], [4, 1700], [5, 2300], [6, 2800]]) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${prefix}-${i}-y${y}.png` });
}
console.log(JSON.stringify({ errors: [...new Set(errors)].slice(0, 10) }));
await browser.close();
