/*
 * PNG sequence (remotion/out/png) -> WebP with alpha for the site (public/chrome) + manifest.
 *   public/chrome/d/NNN.webp   desktop set (640 px)
 *   public/chrome/m/NNN.webp   mobile set (360 px)
 *   public/chrome/poster-d.webp, poster-m.webp   first frame, preloaded for first paint
 *   public/chrome/manifest.json
 * Budget: desktop <= 3.5 MB, mobile <= 1.5 MB in total. Qualities below were tuned to fit.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FPS, SECTIONS, sectionFrames } from '../src/journey.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'out', 'png');
const dest = path.resolve(root, '..', 'public', 'chrome');

const SETS = [
  { id: 'd', size: 640, quality: Number(process.env.Q_D || 80), alphaQuality: 80, budget: 3.5e6 },
  { id: 'm', size: 360, quality: Number(process.env.Q_M || 74), alphaQuality: 80, budget: 1.5e6 },
];

const files = fs.readdirSync(src).filter((f) => f.endsWith('.png')).sort((a, b) => parseInt(a) - parseInt(b));
if (!files.length) throw new Error('No PNG frames in ' + src + ' (run: npm run render)');
const frames = files.length;
const pad = (n) => String(n).padStart(3, '0');

fs.rmSync(dest, { recursive: true, force: true });
const totals = {};
for (const set of SETS) {
  const dir = path.join(dest, set.id);
  fs.mkdirSync(dir, { recursive: true });
  let total = 0;
  await Promise.all(
    files.map(async (f, i) => {
      const out = path.join(dir, `${pad(i)}.webp`);
      await sharp(path.join(src, f))
        .resize(set.size, set.size, { kernel: 'lanczos3' })
        .webp({ quality: set.quality, alphaQuality: set.alphaQuality, effort: 6, smartSubsample: true })
        .toFile(out);
      total += fs.statSync(out).size;
    }),
  );
  totals[set.id] = total;
  const ok = total <= set.budget ? 'ok' : 'OVER BUDGET';
  console.log(`${set.id}: ${frames} frames, ${(total / 1e6).toFixed(2)} MB (${ok}, budget ${(set.budget / 1e6).toFixed(1)} MB), avg ${(total / frames / 1e3).toFixed(1)} kB`);
}

// Posters: first frame, slightly lower quality, small enough to preload without hurting LCP.
const posters = {};
for (const set of SETS) {
  const out = path.join(dest, `poster-${set.id}.webp`);
  await sharp(path.join(src, files[0]))
    .resize(set.size, set.size, { kernel: 'lanczos3' })
    .webp({ quality: 68, alphaQuality: 70, effort: 6, smartSubsample: true })
    .toFile(out);
  posters[set.id] = fs.statSync(out).size;
  console.log(`poster-${set.id}: ${(posters[set.id] / 1e3).toFixed(1)} kB`);
}

const manifest = {
  version: Date.now().toString(36),
  frames,
  fps: FPS,
  sets: Object.fromEntries(SETS.map((s) => [s.id, { size: s.size, path: `/chrome/${s.id}/`, bytes: totals[s.id] }])),
  posters: { d: '/chrome/poster-d.webp', m: '/chrome/poster-m.webp' },
  pad: 3,
  sections: sectionFrames(frames),
  forms: Object.fromEntries(SECTIONS.map((s) => [s.id, s.form])),
};
fs.writeFileSync(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('manifest:', path.join(dest, 'manifest.json'));
