/*
 * v2 section objects: render + encode + verify, one command per object/variant.
 *   node scripts/v2-render.mjs <object> [variant=square] [palette=red]
 *   e.g. node scripts/v2-render.mjs splot square red
 * Output (committed, served by the site):
 *   ../public/v2/objects/<object>/<variant>-{d,m}.{webm,mp4}, <variant>-poster.avif, manifest.json
 * Checks: the loop seam (last -> first frame) must be as smooth as any neighbouring pair,
 * otherwise the loop visibly jumps; the script fails.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [object, variant = 'square', palette = 'red'] = process.argv.slice(2);
if (!object) { console.error('usage: node scripts/v2-render.mjs <object> [square|wide|tall] [red|nest]'); process.exit(1); }

// encode sizes per variant: desktop (d) and mobile (m)
const SIZES = { square: { d: [960, 960], m: [540, 540] }, wide: { d: [1600, 900], m: [960, 540] }, tall: { d: [810, 1080], m: [540, 720] } };
const size = SIZES[variant];
if (!size) { console.error('unknown variant ' + variant); process.exit(1); }

const comp = `v2-${object}-${variant}-${palette}`;
const png = path.join(root, 'out', 'v2', comp);
const dest = path.join(root, '..', 'public', 'v2', 'objects', object);
fs.rmSync(png, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { cwd: root, stdio: opts.capture ? 'pipe' : 'inherit', shell: process.platform === 'win32', encoding: 'utf8' });
  if (r.status !== 0) { console.error(`${cmd} failed`, r.stderr || ''); process.exit(r.status ?? 1); }
  return r;
};

console.log(`render ${comp}`);
run('npx', ['remotion', 'render', 'src/index.ts', comp, png, '--sequence', '--image-format=png', `--gl=${process.env.V2_GL || 'angle'}`, '--image-sequence-pattern=[frame].[ext]', `--concurrency=${process.env.V2_CONCURRENCY || 4}`]);

const frames = fs.readdirSync(png).filter((f) => f.endsWith('.png')).sort();
const pad = frames[0].replace('.png', '').length;
const pattern = path.join(png, `%0${pad}d.png`);

// seam check
const psnr = (a, b) => {
  const r = spawnSync('ffmpeg', ['-i', path.join(png, a), '-i', path.join(png, b), '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /average:([0-9.]+|inf)/.exec(r.stderr);
  return m ? (m[1] === 'inf' ? 99 : +m[1]) : 0;
};
const seam = psnr(frames[frames.length - 1], frames[0]);
const step = psnr(frames[0], frames[1]);
console.log(`seam ${seam.toFixed(1)} dB vs neighbouring frames ${step.toFixed(1)} dB`);
if (seam < step - 3) { console.error('loop seam jumps: the object must be periodic in t'); process.exit(2); }

const enc = (w, h, out, codec) => {
  const vf = `scale=${w}:${h}:flags=lanczos,format=yuv420p`;
  const args = codec === 'webm'
    ? ['-v', 'error', '-y', '-framerate', '30', '-i', pattern, '-vf', vf, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-an', out]
    : ['-v', 'error', '-y', '-framerate', '30', '-i', pattern, '-vf', vf, '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', '-an', out];
  run('ffmpeg', args);
};
const files = {};
for (const [k, [w, h]] of Object.entries(size)) {
  for (const codec of ['webm', 'mp4']) {
    const name = `${variant}-${k}.${codec}`;
    enc(w, h, path.join(dest, name), codec);
    files[name] = fs.statSync(path.join(dest, name)).size;
  }
}
const poster = `${variant}-poster.avif`;
run('ffmpeg', ['-v', 'error', '-y', '-i', path.join(png, frames[0]), '-vf', `scale=${size.d[0]}:${size.d[1]}`, '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '30', path.join(dest, poster)]);
files[poster] = fs.statSync(path.join(dest, poster)).size;

const manifestPath = path.join(dest, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { object, variants: {} };
manifest.palette = palette;
manifest.variants[variant] = { seconds: frames.length / 30, width: size.d[0], height: size.d[1], seamDb: +seam.toFixed(1), files };
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

for (const [f, b] of Object.entries(files)) console.log(`  ${f.padEnd(22)} ${(b / 1024).toFixed(0)} kB`);
console.log(`-> public/v2/objects/${object}/`);
