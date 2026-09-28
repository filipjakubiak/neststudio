import { chromium } from 'playwright-core';
const [,, url, out, w='1400', h='900'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await page.goto(url);
await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 5000 }).catch(()=>{});
await page.screenshot({ path: out, fullPage: true });
await browser.close();
