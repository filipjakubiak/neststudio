import { chromium } from 'playwright-core';
/* Zrzuty gniazda w sekcjach (prawdziwy GPU przez ANGLE/D3D11 na Windows).
   node nest.mjs http://localhost:3102/ out/prefix 1440 900 [iso]
   iso: dodatkowo gniazdo w pełni splecione na środku (stan wymuszony przez bus) do porównań przed/po. */
const [,, url, prefix, w = '1440', h = '900', iso = ''] = process.argv;
const exe = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
try {
  const mobile = +w < 768;
  const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +(process.env.DPR || 1), hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const renderer = await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a';
  });
  await page.waitForTimeout(4500);
  if (mobile) { await page.mouse.wheel(0, 10); await page.evaluate(() => window.dispatchEvent(new Event('scroll'))); await page.waitForTimeout(2500); }
  const spots = [['hero', 0], ['tension', 1.4], ['showreel', 1.6], ['projects', 0.3], ['services', 0.2], ['process', 0.3], ['contact', 1.1], ['footer', 0]];
  for (const [name, off] of spots) {
    await page.evaluate(([n, o]) => { const el = document.querySelector(`[data-section="${n}"]`); const top = el.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: top + o * window.innerHeight, behavior: 'instant' }); }, [name, off]);
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${prefix}-${name}.png` });
  }
  if (iso) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      document.querySelectorAll('main, header, nav, .preloader').forEach((e) => { e.style.visibility = 'hidden'; });
      const s = globalThis.__nestSceneBus.state;
      Object.assign(s, { weave: 1, chaos: 1, speed: 0.02, tunnel: 0, ink: 0, opacity: 1, nestX: 0, nestY: 0, dropVisible: 0, camZ: 10, camY: 0, camRoll: 0 });
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${prefix}-iso.png` });
    await page.screenshot({ path: `${prefix}-iso-crop.png`, clip: { x: +w / 2 - 380, y: +h / 2 - 300, width: 760, height: 600 } });
    if (!mobile) { await page.mouse.move(+w * 0.3, +h * 0.72); await page.waitForTimeout(1200); await page.screenshot({ path: `${prefix}-iso-pointer.png`, clip: { x: +w / 2 - 380, y: +h / 2 - 300, width: 760, height: 600 } }); }
    await page.evaluate(() => { const s = globalThis.__nestSceneBus.state; s.ink = 1; document.body.style.background = '#F4F4F5'; document.documentElement.style.background = '#F4F4F5'; });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${prefix}-iso-ink.png` });
  }
  const fms = await page.evaluate(() => globalThis.__nestScene?.averageFrameMs?.() ?? null);
  console.log(JSON.stringify({ renderer, errors, avgFrameMs: fms, threads: await page.evaluate(() => globalThis.__nestScene?.threads?.count ?? null) }));
} finally {
  await browser.close();
}
