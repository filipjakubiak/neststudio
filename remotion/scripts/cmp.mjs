/* Look-dev: chosen frames of the encoded desktop set on the dark canvas and on the light block (out/cmp.png).
   node scripts/cmp.mjs 000 045 065 110 149 */
import sharp from 'sharp';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['000', '045', '065', '110', '149'];
const S = 640;
const comps = [{ input: { create: { width: S * ids.length, height: S, channels: 4, background: '#f4f3ef' } }, left: 0, top: S }];
ids.forEach((id, i) => {
  comps.push({ input: `../public/chrome/d/${id}.webp`, left: i * S, top: 0 });
  comps.push({ input: `../public/chrome/d/${id}.webp`, left: i * S, top: S });
});
await sharp({ create: { width: S * ids.length, height: S * 2, channels: 4, background: '#0a0a0b' } })
  .composite(comps)
  .png()
  .toFile('out/cmp.png');
console.log('out/cmp.png');
