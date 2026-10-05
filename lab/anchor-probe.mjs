import { chromium } from 'playwright-core';
// Where does a hash entry land, and who moves the scroll? Logs scrollY + target top over time and every
// scrollTo/scrollIntoView call with its stack. Also catches GSAP "target not found" with the stack.
const [, , url = 'http://localhost:3000/#uslugi', id = 'uslugi'] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  const log = (w, extra = '') => console.log(`[scroll] ${w} y=${Math.round(scrollY)} ${extra} ${(new Error().stack || '').split('\n').slice(2, 5).map((s) => s.trim().slice(0, 90)).join(' < ')}`);
  for (const k of ['scrollTo', 'scroll', 'scrollBy']) { const o = window[k].bind(window); window[k] = (...a) => { log(k, JSON.stringify(a)); return o(...a); }; }
  const sit = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (...a) { log('scrollIntoView', this.id || this.className); return sit.apply(this, a); };
  const warn = console.warn; console.warn = (...a) => { if (String(a[0]).includes('GSAP')) console.log('[gsapwarn] ' + a.join(' ') + ' ' + (new Error().stack || '').split('\n').slice(2, 7).map((s) => s.trim().slice(0, 100)).join(' < ')); return warn(...a); };
});
page.on('console', (m) => { const t = m.text(); if (t.startsWith('[scroll]') || t.startsWith('[gsapwarn]')) console.log(t); });
await page.goto(url, { waitUntil: 'domcontentloaded' });
const t0 = Date.now();
for (let i = 0; i < 14; i++) {
  const s = await page.evaluate((id) => ({ y: Math.round(scrollY), top: Math.round((document.getElementById(id)?.getBoundingClientRect().top ?? NaN) + scrollY), h: document.documentElement.scrollHeight, restore: history.scrollRestoration }), id);
  console.log(`t=${Date.now() - t0}ms y=${s.y} target=${s.top} docH=${s.h} restoration=${s.restore}`);
  await page.waitForTimeout(i < 6 ? 150 : 500);
}
await browser.close();
