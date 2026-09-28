import { chromium } from 'playwright-core';
const [,, url, mobile] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext(mobile === 'mobile' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const logs = []; page.on('console', m => logs.push(m.text().slice(0, 200))); page.on('pageerror', e => logs.push('ERR ' + e.message));
await page.goto(url, { waitUntil: 'domcontentloaded' });
const samples = [];
for (const t of [300, 1500, 2600, 3200, 4500, 6000]) {
  await page.waitForTimeout(t - (samples.length ? samples[samples.length - 1].t : 0));
  samples.push(await page.evaluate((t) => { const l = document.querySelector('.hero-line-inner'); const cs = getComputedStyle(l); return { t, ready: !!window.__nestReady, pre: document.documentElement.getAttribute('data-preloading'), skip: document.documentElement.hasAttribute('data-skip-preloader'), inline: l.getAttribute('style'), transform: cs.transform, opacity: cs.opacity, leadOpacity: getComputedStyle(document.querySelector('.hero-lead')).opacity, preloader: !!document.querySelector('.preloader') }; }, t));
}
console.log(JSON.stringify(samples, null, 0));
console.log(logs.slice(0, 5).join(' | '));
await browser.close();
