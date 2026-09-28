import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
// Sekwencja tytułowa klatka po klatce: przewija timeline (window.__nestTitles) do zadanych czasów,
// niezależnie od prędkości GPU. usage: node titles.mjs <url> <outSheet.png> [w] [h] [mobile]
const [,, url, out, w = '1440', h = '900', mobile = 'no'] = process.argv;
const W = +w, H = +h;
const TIMES = [0.05, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.25, 4.35, 4.6, 4.9];
const tmp = fs.mkdtempSync(path.join(process.cwd(), 'titles-'));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: mobile === 'mobile', hasTouch: mobile === 'mobile' });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text().slice(0, 240)}`); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
const t0 = Date.now();
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.screenshot({ path: path.join(tmp, 'a-first-paint.png') });
// czekaj na timeline (scena zbudowana) i zatrzymaj ją od razu
let ok = true;
try { await page.waitForFunction(() => !!window.__nestTitles, null, { timeout: 30000 }); } catch { ok = false; }
const tScene = (Date.now() - t0) / 1000;
const shots = [{ p: path.join(tmp, 'a-first-paint.png'), label: 'first paint' }];
if (ok) {
  await page.evaluate(() => { window.__nestTitles.pause(); });
  for (const t of TIMES) {
    await page.evaluate((tt) => { window.__nestTitles.seek(tt, true); }, t);
    await page.waitForTimeout(400);
    const p = path.join(tmp, `t-${t.toFixed(2)}.png`);
    await page.screenshot({ path: p });
    shots.push({ p, label: `t=${t.toFixed(2)}s` });
  }
  // dokończ sekwencję naprawdę (callbacki: prepare, finish, ready)
  await page.evaluate(() => { window.__nestTitles.seek(4.15, true); window.__nestTitles.play(); });
  try { await page.waitForFunction(() => window.__nestReady === true, null, { timeout: 20000 }); } catch { errors.push('[lab] ready timeout'); }
  await page.waitForTimeout(2200);
  const p = path.join(tmp, 'z-hero-rest.png'); await page.screenshot({ path: p }); shots.push({ p, label: 'hero (rest)' });
  await page.screenshot({ path: out.replace(/\.png$/, '-rest.png') });
  for (const y of [Math.round(H * 0.35), Math.round(H * 0.7), Math.round(H * 1.05)]) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await page.waitForTimeout(900);
    const q = path.join(tmp, `z-scroll-${y}.png`); await page.screenshot({ path: q }); shots.push({ p: q, label: `scroll ${y}` });
  }
  // stopka
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(2400);
  const f = path.join(tmp, 'z-footer.png'); await page.screenshot({ path: f }); shots.push({ p: f, label: 'footer' });
}
const status = await page.evaluate(() => ({
  scene: document.documentElement.dataset.scene, skip: document.documentElement.hasAttribute('data-skip-preloader'), pre: document.documentElement.getAttribute('data-preloading'),
  ready: window.__nestReady, overlay: !!document.querySelector('.titles-overlay'), anchors: window.__nestSceneBus?.anchors,
  state: window.__nestSceneBus && { titlesHero: window.__nestSceneBus.state.titlesHero, titlesFooter: window.__nestSceneBus.state.titlesFooter, glow: window.__nestSceneBus.state.glow, camZ: window.__nestSceneBus.state.camZ },
  sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
}));
await page.close();
// arkusz
const cols = W > H ? 4 : 8;
const thumbW = Math.floor(1600 / cols), thumbH = Math.round(thumbW * H / W);
const rows = Math.ceil(shots.length / cols);
const html = `<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:6px;padding:6px;width:max-content">
${shots.map(s => `<div style="position:relative;width:${thumbW}px;height:${thumbH}px"><img src="file://${s.p}" style="width:${thumbW}px;height:${thumbH}px;display:block"><span style="position:absolute;left:4px;top:4px;font:12px monospace;color:#0f0;background:#0008;padding:2px 4px">${s.label}</span></div>`).join('')}
</body></html>`;
const sheetPath = path.join(tmp, 'sheet.html'); fs.writeFileSync(sheetPath, html);
const p2 = await ctx.newPage(); await p2.setViewportSize({ width: cols * (thumbW + 6) + 6, height: rows * (thumbH + 6) + 6 });
await p2.goto('file://' + sheetPath); await p2.waitForTimeout(500);
await p2.screenshot({ path: out, fullPage: true });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(JSON.stringify({ ok, tScene, status, errors: [...new Set(errors)].slice(0, 10) }));
