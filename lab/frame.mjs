import { chromium } from 'playwright-core';
// pełnoekranowa klatka sekwencji w czasie t; usage: node frame.mjs <url> <t> <out.png> [w] [h] [mobile]
const [,, url, tArg, out, w = '1440', h = '900', mobile = 'no'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, isMobile: mobile === 'mobile', hasTouch: mobile === 'mobile' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !!window.__nestTitles, null, { timeout: 30000 });
await page.evaluate((t) => { window.__nestTitles.pause(); window.__nestTitles.seek(t, true); }, +tArg);
await page.waitForTimeout(500);
await page.screenshot({ path: out });
await browser.close();
