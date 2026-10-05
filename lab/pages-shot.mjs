import { chromium } from 'playwright-core';
import fs from 'node:fs';
// v3 check of every subpage + the interactive bits (mobile sheet, form validation, FAQ).
// Needs `node lab/serve.mjs 4801 ../out`. Shots in shots/pages/.
const base = 'http://localhost:4801';
const routes = ['/uslugi/branding/', '/uslugi/automatyzacje/', '/realizacje/', '/studio/', '/kontakt/', '/en/'];
fs.mkdirSync('shots/pages', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const watch = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag}: ${m.text()}`); });
};

for (const route of routes) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const tag = route.replace(/\//g, '_');
  watch(page, tag);
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < H && i < 8; y += 810) {
    if (y) { for (let k = 0; k < 5; k++) { await page.mouse.wheel(0, 162); await page.waitForTimeout(60); } await page.waitForTimeout(1000); }
    await page.screenshot({ path: `shots/pages/${tag}-${i++}.png` });
  }
  console.log(route, 'h', H, 'shots', i);
  await ctx.close();
}

// mobile: menu sheet, then the contact form validation
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  watch(page, 'mobile');
  await page.goto(base + '/kontakt/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shots/pages/m-top.png' });
  await page.click('.menu-btn');
  await page.waitForTimeout(700);
  const focus = await page.evaluate(() => document.activeElement?.textContent);
  await page.screenshot({ path: 'shots/pages/m-menu.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  const closed = await page.evaluate(() => document.querySelector('.nav-sheet')?.hasAttribute('hidden'));
  await page.locator('#formularz').scrollIntoViewIfNeeded();
  await page.click('button[type=submit]');
  await page.waitForTimeout(500);
  const invalid = await page.evaluate(() => [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.getAttribute('name')));
  await page.screenshot({ path: 'shots/pages/m-form-errors.png' });
  console.log('menu focus:', focus, '| closed by Esc:', closed, '| invalid after empty submit:', invalid);
  await ctx.close();
}

// FAQ opens and closes (desktop)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  watch(page, 'faq');
  await page.goto(base + '/#faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.click('.faq-item summary');
  await page.waitForTimeout(800);
  const open = await page.evaluate(() => { const d = document.querySelector('.faq-item'); return { open: d.open, h: d.querySelector('.faq-a').getBoundingClientRect().height }; });
  await page.screenshot({ path: 'shots/pages/faq-open.png' });
  console.log('faq', JSON.stringify(open));
  await ctx.close();
}
console.log('errors', JSON.stringify([...new Set(errors)]));
await browser.close();
