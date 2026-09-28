import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
// usage: node walk.mjs <url> <outSheet.png> [w] [h] [reduce|no] [step fraction] [cols]
const [,, url, out, w='1440', h='900', reduced='no', stepF='1', colsArg] = process.argv;
const W = +w, H = +h, step = Math.round(H * +stepF);
const cols = colsArg ? +colsArg : (W > H ? 3 : 8);
const tmp = fs.mkdtempSync(path.join(process.cwd(), 'walk-'));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, reducedMotion: reduced === 'reduce' ? 'reduce' : 'no-preference' });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const shots = [];
for (let y = 0, i = 0; y < total; y += step, i++) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(650);
  const p = path.join(tmp, `s${String(i).padStart(2, '0')}.png`);
  await page.screenshot({ path: p });
  shots.push({ p, y });
  if (i > 60) break;
}
const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight }));
await page.close();
// compose sheet
const thumbW = Math.floor(1500 / cols), thumbH = Math.round(thumbW * H / W);
const rows = Math.ceil(shots.length / cols);
const html = `<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:6px;padding:6px;width:max-content">
${shots.map(s => `<div style="position:relative;width:${thumbW}px;height:${thumbH}px"><img src="file://${s.p}" style="width:${thumbW}px;height:${thumbH}px;display:block"><span style="position:absolute;left:4px;top:4px;font:12px monospace;color:#0f0;background:#0008;padding:2px 4px">${s.y}</span></div>`).join('')}
</body></html>`;
const sheetPath = path.join(tmp, 'sheet.html'); fs.writeFileSync(sheetPath, html);
const p2 = await ctx.newPage(); await p2.setViewportSize({ width: cols * (thumbW + 6) + 6, height: rows * (thumbH + 6) + 6 });
await p2.goto('file://' + sheetPath); await p2.waitForTimeout(500);
await p2.screenshot({ path: out, fullPage: true });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(JSON.stringify({ shots: shots.length, total, overflow, errors: [...new Set(errors)].slice(0, 8) }));
