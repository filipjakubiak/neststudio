# Chrome journey (Remotion)

Source of the liquid-chrome guide on the site (decision D15 in `docs/decisions.md`). One continuous
piece of motion, rendered offline to an image sequence with alpha; the site scrubs it with scroll.
Nothing here ships in the site bundle: this folder has its own `package.json` and `node_modules`.

## Files

- `src/journey.ts` — the choreography: frame count, fps, section -> part of the journey, keyed
  shape parameters (drop, stretched pair that splits, lens, thread, landing). Pure data, also read by
  `scripts/encode.mjs` for the manifest.
- `src/chromeShader.ts` — the object: a raymarched signed-distance field that morphs between the four
  forms (so the drop can split and pull into a thread without seams), mirror metal with Schlick
  Fresnel (chrome F0 0.78), an analytic HDR studio (strip lights, softboxes, horizon line; no HDRI
  file, nothing to credit or license), a subtle per-channel spread near the rim (chromatic falloff),
  analytic edge coverage for clean alpha.
- `src/ChromeJourney.tsx` — `@remotion/three` `ThreeCanvas` with one full-screen quad.
  The `ShaderMaterial` is created in code, not as a JSX `uniforms` prop: R3F copies that prop, so
  frames after the first would silently repeat frame one in sequence renders.
- `scripts/render.mjs` — `remotion render` to `out/png/NNN.png` (1280 px, PNG with alpha).
- `scripts/encode.mjs` — `sharp` -> `../public/chrome/{d,m}/NNN.webp` (640 / 360 px, lanczos
  downsample = 2x / 3.6x supersampling), `poster-{d,m}.webp`, `manifest.json`; prints sizes vs budget
  (desktop <= 3.5 MB, mobile <= 1.5 MB). Qualities: `Q_D` (default 80), `Q_M` (default 74).
- `scripts/sheet.mjs`, `scripts/cmp.mjs` — look-dev contact sheets.

## Render (Windows 11, tested with Node 24)

From the repo root:

```bash
npm run chrome:install     # once
npm run chrome:render      # render + encode (about 15 s on a GPU)
```

The exact render command it runs (from `remotion/`):

```bash
npx remotion render src/index.ts ChromeJourney out/png --sequence --image-format=png --gl=angle --image-sequence-pattern=[frame].[ext] --concurrency=4
node scripts/encode.mjs
```

`--gl=angle` uses the real GPU through ANGLE (D3D11) in Remotion's headless Chrome; 240 frames at
1280 px take ~12 s. Without a usable GPU use software GL: `CHROME_GL=swangle npm run chrome:render`
(same pixels, much slower). The first run downloads Remotion's headless Chrome (~110 MB).

Quick look-dev: `npm run chrome:preview` (quarter scale to `out/preview`), then
`node scripts/sheet.mjs out/preview 8 out/sheet.png`. Live preview: `npm run chrome:studio`.

`out/` is git-ignored; only `public/chrome/**` (WebP + manifest) is committed.
