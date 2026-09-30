import { chromium } from 'playwright-core';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
// v2 look-dev page: desktop hero + bento, mobile, red variant. Real Chrome, real video playback.
const url = pathToFileURL(path.resolve('v2-lookdev/index.html')).href;
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
async function shoot(viewport, name, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  if (fn) await fn(page);
  const state = await page.evaluate(() => [...document.querySelectorAll('video')].map((v) => ({ t: +v.currentTime.toFixed(2), paused: v.paused, src: v.currentSrc.split('/').pop() })));
  console.log(name, JSON.stringify(state));
  await page.screenshot({ path: `shots/${name}.png`, fullPage: true });
  await ctx.close();
}
await shoot({ width: 1440, height: 900 }, 'lookdev-desktop');
await shoot({ width: 390, height: 844 }, 'lookdev-mobile');
await shoot({ width: 1440, height: 900 }, 'lookdev-red', async (p) => { await p.click('button[data-pal="splotred"]'); await p.waitForTimeout(1800); });
console.log('errors', JSON.stringify(errors));
await browser.close();
