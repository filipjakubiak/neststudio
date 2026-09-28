import { chromium } from 'playwright-core';
// finał (kontakt, pin) i stopka po pełnym przejściu strony; usage: node finale.mjs <url> <prefix> [w] [h]
const [,, url, prefix, w = '1440', h = '900'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +w, height: +h } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !!window.__nestTitles, null, { timeout: 30000 });
await page.evaluate(() => { window.__nestTitles.seek(4.2, true); window.__nestTitles.play(); });
await page.waitForFunction(() => window.__nestReady === true, null, { timeout: 20000 });
await page.waitForTimeout(800);
const go = async (name, off, label) => {
  await page.evaluate(([n, o]) => { const el = document.querySelector(`[data-section="${n}"]`); const top = el.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: top + o * window.innerHeight, behavior: 'instant' }); }, [name, off]);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${prefix}-${label}.png` });
};
await go('contact', 0.6, 'contact-a');
await go('contact', 1.45, 'contact-b');
await go('footer', 0.0, 'footer');
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await page.waitForTimeout(1800);
await page.screenshot({ path: `${prefix}-footer-end.png` });
const st = await page.evaluate(() => ({ glow: window.__nestSceneBus.state.glow, tf: window.__nestSceneBus.state.titlesFooter, weave: window.__nestSceneBus.state.weave }));
console.log(JSON.stringify({ st, errors }));
await browser.close();
