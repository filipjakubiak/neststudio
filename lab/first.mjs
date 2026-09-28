import { chromium } from 'playwright-core';
// first paint of the title overlay + fallback lockup geometry; usage: node first.mjs <url> <prefix>
const [,, url, prefix] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
await page.screenshot({ path: `${prefix}-300ms.png` });
const info = await page.evaluate(() => {
  const st = document.querySelector('.titles-static');
  const paths = [...document.querySelectorAll('.titles-lockup .lockup-single path')].slice(0, 3).map(p => { const r = p.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  const lock = document.querySelector('.titles-lockup');
  const r = lock.getBoundingClientRect();
  return { staticOpacity: getComputedStyle(st).opacity, lockBox: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], ar: getComputedStyle(lock).aspectRatio, paths, hydrated: !!window.__nestSceneBus, pre: document.documentElement.getAttribute('data-preloading') };
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${prefix}-1500ms.png` });
console.log(JSON.stringify(info));
await browser.close();
