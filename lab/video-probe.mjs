import { chromium } from 'playwright-core';
// Why does a video stay paused while in view? Logs every play()/load()/pause() call with its outcome and
// the media events of the hero video, while scrolling it into view on a phone viewport.
const [, , url = 'http://localhost:3000/', sel = '.hero-object video'] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.addInitScript((sel) => {
  const t0 = performance.now();
  const tag = (v) => (v.closest('[class*=object]')?.className.match(/\b\w+-object\b/) || ['?'])[0];
  const log = (m) => console.log(`[v ${Math.round(performance.now() - t0)}ms] ${m}`);
  const P = HTMLMediaElement.prototype;
  const play = P.play, load = P.load, pause = P.pause;
  P.play = function () { const p = play.call(this); log(`${tag(this)} play() muted=${this.muted} src=${this.currentSrc.split('/').pop() || '-'}`); p.then(() => log(`${tag(this)} play resolved`), (e) => log(`${tag(this)} play REJECTED ${e.name}: ${e.message}`)); return p; };
  P.load = function () { log(`${tag(this)} load() sources=${this.querySelectorAll('source').length}`); return load.call(this); };
  P.pause = function () { if (!this.paused) log(`${tag(this)} pause()`); return pause.call(this); };
  document.addEventListener('DOMContentLoaded', () => {
    const v = document.querySelector(sel);
    if (!v) return log('no video for ' + sel);
    for (const ev of ['loadstart', 'loadedmetadata', 'canplay', 'playing', 'pause', 'abort', 'error', 'emptied', 'stalled']) v.addEventListener(ev, () => log(`${tag(v)} event ${ev}`));
    new IntersectionObserver(([e]) => log(`${tag(v)} IO intersecting=${e.isIntersecting} ratio=${e.intersectionRatio.toFixed(2)}`), { threshold: [0, 0.05] }).observe(v);
  });
}, sel);
page.on('console', (m) => { if (m.text().startsWith('[v ')) console.log(m.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log('--- scrolling');
for (let i = 0; i < 7; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
await page.waitForTimeout(2500);
console.log(JSON.stringify(await page.evaluate((sel) => { const v = document.querySelector(sel); const r = v.getBoundingClientRect(); return { y: scrollY, top: Math.round(r.top), h: Math.round(r.height), paused: v.paused, t: v.currentTime, motion: document.documentElement.dataset.motion }; }, sel)));
await browser.close();
