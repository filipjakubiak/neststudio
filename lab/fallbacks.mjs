import { chromium } from 'playwright-core';
// 1) brak WebGL: overlay ma zniknąć bez sekwencji; 2) wolny chunk three (5 s): overlay pokazuje statyczny lockup, potem sekwencja albo odsłonięcie
const [,, url, prefix] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
// 1) no webgl
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { const orig = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (String(t).startsWith('webgl')) return null; return orig.call(this, t, ...a); }; });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__nestReady === true, null, { timeout: 15000 }).catch(() => errors.push('ready timeout'));
  const tReady = (Date.now() - t0) / 1000;
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${prefix}-nowebgl.png` });
  const st = await page.evaluate(() => ({ overlay: !!document.querySelector('.titles-overlay'), fallback: !!document.querySelector('.scene-fallback'), skip: document.documentElement.hasAttribute('data-skip-preloader'), svgOpacity: getComputedStyle(document.querySelector('.hero-lockup .lockup-single')).opacity }));
  console.log(JSON.stringify({ case: 'no-webgl', tReady, st, errors }));
  await ctx.close();
}
// 2) slow three chunk
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/_next/static/chunks/*.js', async (route) => {
    const u = route.request().url();
    if (/chunks\/[a-z0-9_-]*\.js$/i.test(u)) {
      const resp = await route.fetch(); const body = await resp.text();
      if (body.includes('UnrealBloomPass')) await new Promise(r => setTimeout(r, 5200));
      await route.fulfill({ response: resp, body });
    } else route.continue();
  });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: `${prefix}-slow-4s.png` });
  const st1 = await page.evaluate(() => ({ staticAttr: document.querySelector('.titles-overlay')?.getAttribute('data-static'), staticOpacity: getComputedStyle(document.querySelector('.titles-static')).opacity, pre: document.documentElement.getAttribute('data-preloading') }));
  await page.waitForFunction(() => !!window.__nestTitles || window.__nestReady === true, null, { timeout: 20000 }).catch(() => errors.push('scene timeout'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${prefix}-slow-after.png` });
  const st2 = await page.evaluate(() => ({ tl: !!window.__nestTitles, ready: window.__nestReady, pre: document.documentElement.getAttribute('data-preloading') }));
  console.log(JSON.stringify({ case: 'slow-three', st1, st2, errors }));
  await ctx.close();
}
await browser.close();
