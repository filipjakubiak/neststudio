import { chromium } from 'playwright-core';
// node lab/quick-shot.mjs <path> <out.png> [width] [height] [scrollToSelector]
const [, , route = '/', out = 'shots/quick.png', w = '1440', h = '900', sel] = process.argv;
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto((process.env.BASE || 'http://localhost:4801') + route, { waitUntil: 'networkidle' });
await p.waitForTimeout(2200);
if (sel) { await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start', behavior: 'instant' }), sel); await p.waitForTimeout(1500); }
await p.screenshot({ path: out });
await b.close();
