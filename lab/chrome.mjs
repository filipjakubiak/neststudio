/*
 * Weryfikacja chromu (D15): przejście przez całą stronę krokami, contact sheet, stan kanwy w każdym kroku,
 * błędy konsoli, poziomy scroll i kolejność pobierania klatek.
 * usage: node chrome.mjs <url> <outDir> [w=1440] [h=900] [reduce|no] [stepFraction=0.5]
 * Chrome: CHROME_PATH albo domyślna ścieżka Windows.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , url = 'http://localhost:3103/', outDir = 'shots-chrome', w = '1440', h = '900', reduced = 'no', stepF = '0.5'] = process.argv;
const W = +w, H = +h;
const exe = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(outDir, { recursive: true });
const tag = `${W}x${H}${reduced === 'reduce' ? '-reduced' : ''}`;
const mobile = W < 768;

const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
try {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: reduced === 'reduce' ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [];
  const requests = [];
  const t0 = Date.now();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
  page.on('requestfinished', async (r) => {
    const u = r.url();
    if (!u.includes('/chrome/')) return;
    const size = (await r.sizes().catch(() => null))?.responseBodySize ?? 0;
    requests.push({ t: Date.now() - t0, url: u.replace(/^.*\/chrome\//, '').replace(/\?.*$/, ''), size });
  });

  await page.goto(url, { waitUntil: 'load' });
  const firstPaint = await page.evaluate(() => {
    const img = document.querySelector('.drop-poster');
    return { posterComplete: img?.complete ?? null, posterSrc: img?.currentSrc?.replace(/^.*\/chrome\//, '') ?? null, chrome: document.documentElement.getAttribute('data-chrome') };
  });
  // Bez scrolla: ile klatek pobrało się w tle w 1 s i 4 s po starcie (progresywnie, bez blokowania)
  await page.waitForTimeout(1000);
  const after1s = requests.length;
  if (mobile) await page.mouse.wheel(0, 1); // gest (D13) dla sceny nici na dotyku
  await page.waitForTimeout(3000);
  const after4s = requests.length;

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round(H * +stepF);
  const shots = [];
  const states = [];
  for (let y = 0, i = 0; y < total - H + step; y += step, i++) {
    await page.evaluate((yy) => { (window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : window.scrollTo(0, yy)); }, y);
    await page.waitForTimeout(900);
    const st = await page.evaluate(() => {
      const c = document.querySelector('.chrome-guide');
      const r = c?.getBoundingClientRect();
      return {
        y: Math.round(window.scrollY),
        section: c?.dataset.section ?? null,
        frame: c?.dataset.frame ? +c.dataset.frame : null,
        layer: c?.dataset.layer ?? null,
        op: c ? +getComputedStyle(c).opacity : null,
        vis: c ? getComputedStyle(c).visibility : null,
        box: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
      };
    });
    states.push(st);
    const p = path.join(outDir, `${tag}-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: p });
    shots.push({ p, st });
    if (i > 90) break;
  }
  const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));

  // contact sheet
  const cols = W > H ? 4 : 8;
  const thumbW = Math.floor(1600 / cols), thumbH = Math.round((thumbW * H) / W);
  const html = `<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:4px;padding:4px;width:max-content">${shots
    .map((s) => `<div style="position:relative"><img src="file:///${path.resolve(s.p).replace(/\\/g, '/')}" style="width:${thumbW}px;height:${thumbH}px;display:block"><span style="position:absolute;left:3px;top:3px;font:11px monospace;color:#0f0;background:#000a;padding:1px 3px">${s.st.y} ${s.st.section ?? '-'} f${s.st.frame ?? '-'} ${s.st.layer ?? ''}</span></div>`)
    .join('')}</body></html>`;
  const sheetHtml = path.resolve(outDir, `${tag}-sheet.html`);
  fs.writeFileSync(sheetHtml, html);
  const p2 = await ctx.newPage();
  await p2.setViewportSize({ width: cols * (thumbW + 4) + 4, height: 800 });
  await p2.goto('file:///' + sheetHtml.replace(/\\/g, '/'));
  await p2.waitForTimeout(400);
  await p2.screenshot({ path: path.join(outDir, `${tag}-sheet.png`), fullPage: true });

  const frames = states.map((s) => s.frame).filter((f) => f != null);
  const report = {
    tag, firstPaint, total, overflow,
    horizontalScroll: overflow.sw > overflow.cw,
    chromeRequests: { after1s, after4s, final: requests.length, bytes: requests.reduce((a, r) => a + r.size, 0), first10: requests.slice(0, 10).map((r) => `${r.t}ms ${r.url}`) },
    framesSeen: { distinct: new Set(frames).size, min: Math.min(...frames), max: Math.max(...frames), monotonicViolations: frames.filter((f, i) => i && f < frames[i - 1] - 2).length },
    sections: [...new Set(states.map((s) => s.section))],
    errors: [...new Set(errors)].slice(0, 10),
  };
  fs.writeFileSync(path.join(outDir, `${tag}-report.json`), JSON.stringify({ ...report, states }, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
