import { chromium } from 'playwright-core';
// screenshots at named sections: scroll to section top (+ optional offset in vh) after settling
const [,, url, prefix, w='1440', h='900'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +w, height: +h } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const spots = [['process', 0.0], ['process', 1.2], ['process', 2.3], ['services', 0.2], ['ai', 0.3], ['studio', 0.2], ['contact', 1.1]];
for (const [name, off] of spots) {
  await page.evaluate(([n, o]) => { const el = document.querySelector(`[data-section="${n}"]`); const top = el.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: top + o * window.innerHeight, behavior: 'instant' }); }, [name, off]);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${prefix}-${name}-${off}.png` });
}
console.log(JSON.stringify({ errors }));
await browser.close();
