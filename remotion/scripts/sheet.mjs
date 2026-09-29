/* Contact sheet of a rendered sequence over a dark and a light swatch (look-dev only).
   node scripts/sheet.mjs [dir=out/preview] [every=5] [out=out/sheet.png] */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [, , dirArg = 'out/preview', everyArg = '5', outArg = 'out/sheet.png'] = process.argv;
const files = fs.readdirSync(dirArg).filter((f) => /\.(png|webp)$/.test(f)).sort();
const pick = files.filter((_, i) => i % +everyArg === 0);
const cell = 200, cols = 10;
const rows = Math.ceil(pick.length / cols);
const comps = [];
for (let i = 0; i < pick.length; i++) {
  const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
  const img = await sharp(path.join(dirArg, pick[i])).resize(cell, cell).toBuffer();
  comps.push({ input: img, left: x, top: y });
  const label = Buffer.from(`<svg width="60" height="18"><text x="3" y="13" font-family="monospace" font-size="12" fill="#6f6">${pick[i].replace(/\..*/, '')}</text></svg>`);
  comps.push({ input: label, left: x, top: y });
}
const bg = Buffer.from(`<svg width="${cols * cell}" height="${rows * cell}">${Array.from({ length: rows * cols }, (_, i) => `<rect x="${(i % cols) * cell}" y="${Math.floor(i / cols) * cell}" width="${cell}" height="${cell}" fill="${(i + Math.floor(i / cols)) % 2 ? '#0a0a0b' : '#1a1a1d'}"/>`).join('')}</svg>`);
await sharp(bg).composite(comps).png().toFile(outArg);
console.log(outArg, pick.length, 'frames');
