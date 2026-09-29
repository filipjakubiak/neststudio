import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
/* Arkusz porównawczy: node sheet.mjs out.jpg <kolumny> <szer. kafla> img1[:podpis] img2[:podpis] ... */
const [,, out, cols = '2', tile = '720', ...imgs] = process.argv;
const exe = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: exe, headless: true });
try {
  const cells = imgs.map((spec) => {
    const i = spec.lastIndexOf('|');
    const file = i > 0 ? spec.slice(0, i) : spec;
    const label = i > 0 ? spec.slice(i + 1) : '';
    return `<figure><img src="data:image/png;base64,${readFileSync(file).toString('base64')}"><figcaption>${label}</figcaption></figure>`;
  }).join('');
  const page = await browser.newPage({ viewport: { width: +cols * +tile, height: 400 } });
  await page.setContent(`<style>body{margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},${tile}px)}figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:8px;top:6px;font:12px monospace;color:#fff;background:#000a;padding:2px 6px}</style>${cells}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: true, type: out.endsWith('.png') ? 'png' : 'jpeg', quality: out.endsWith('.png') ? undefined : 78 });
} finally {
  await browser.close();
}
