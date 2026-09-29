/*
 * Renders the chrome journey to a PNG sequence with alpha (remotion/out/png/NNN.png).
 *   node scripts/render.mjs            full quality (1280 px, downsampled later)
 *   node scripts/render.mjs --preview  quarter scale, for quick look-dev
 * WebGL on Windows: --gl=angle uses the real GPU through ANGLE/D3D11 (fast).
 * Fallback without a GPU: CHROME_GL=swangle (software, slow but identical output).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.argv.includes('--preview');
const outDir = path.join(root, 'out', preview ? 'preview' : 'png');
fs.rmSync(outDir, { recursive: true, force: true });

const gl = process.env.CHROME_GL || 'angle';
const args = [
  'remotion', 'render', 'src/index.ts', 'ChromeJourney', outDir,
  '--sequence', '--image-format=png', `--gl=${gl}`,
  '--image-sequence-pattern=[frame].[ext]',
  `--concurrency=${process.env.CHROME_CONCURRENCY || 4}`,
  ...(preview ? ['--scale=0.25'] : []),
];
console.log('npx ' + args.join(' '));
const r = spawnSync('npx', args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(r.status ?? 1);
