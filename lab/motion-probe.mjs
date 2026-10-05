import { chromium } from 'playwright-core';
// Diagnose "static" animations: scroll like a person, then at every stop list what is in view but stuck
// (opacity < 1, leftover transform/filter/clip) and what every video in view is doing.
// node lab/motion-probe.mjs [base=http://localhost:3000] [route=/] [startY=0]
const [, , base = 'http://localhost:3000', route = '/', startY = '0'] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: +(process.env.H || 900) }, isMobile: !!process.env.MOB, hasTouch: !!process.env.MOB });
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
await page.goto(base + route, { waitUntil: 'networkidle' });
if (+startY) { await page.evaluate((y) => window.scrollTo(0, y), +startY); await page.reload({ waitUntil: 'networkidle' }); }
await page.waitForTimeout(2500);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const probe = () => page.evaluate(() => {
  const vh = innerHeight;
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.bottom > vh * 0.1 && r.top < vh * 0.9 && r.width > 0; };
  const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.textContent || '').trim().slice(0, 30) + '"';
  const stuck = [];
  for (const el of document.querySelectorAll('main *')) {
    if (!inView(el)) continue;
    const cs = getComputedStyle(el);
    const op = +cs.opacity;
    const tr = cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    const fl = cs.filter !== 'none';
    if (op < 0.98 || fl) stuck.push(`${label(el)} op=${op.toFixed(2)}${tr ? ' tr=' + cs.transform.slice(0, 40) : ''}${fl ? ' filter=' + cs.filter : ''}`);
  }
  const videos = [...document.querySelectorAll('video')].filter(inView).map((v) => ({
    obj: v.closest('[class*=obj]')?.className.split(' ').find((c) => /object/.test(c)),
    src: (v.currentSrc || '(none)').split('/').slice(-2).join('/'),
    paused: v.paused, ready: v.readyState, net: v.networkState, err: v.error?.code ?? null, t: +v.currentTime.toFixed(2), sources: v.querySelectorAll('source').length,
  }));
  return { y: scrollY, motion: document.documentElement.dataset.motion, stuck: stuck.slice(0, 12), stuckCount: stuck.length, videos };
});
for (let y = +startY; y < H; y += 700) {
  for (let k = 0; k < 7; k++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(40); }
  await page.waitForTimeout(1800);
  const r = await probe();
  if (r.stuckCount || r.videos.some((v) => v.paused || v.err)) console.log(JSON.stringify(r));
  else console.log(`y=${r.y} ok, videos playing: ${r.videos.map((v) => v.obj).join(',') || '-'}`);
}
console.log('LOGS', JSON.stringify([...new Set(logs)], null, 1));
await browser.close();
