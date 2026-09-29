/*
 * The chrome journey: one continuous piece of motion mapped to the scroll of the whole page.
 * Everything here is plain data + pure functions (erasable TypeScript only), so Node 24 can import
 * it directly from the encode script to write the manifest.
 *
 * Time is expressed as a fraction t in [0, 1] of the whole journey, so the frame count can change
 * without touching the choreography.
 */

export const FPS = 24;
export const FRAMES = 240; // 10 s at 24 fps
export const RENDER_SIZE = 1280; // rendered square, downsampled 2x (desktop) for clean edges

/* Page sections (data-section ids in the site) -> part of the journey. Order = page order. */
export const SECTIONS: { id: string; from: number; to: number; form: string }[] = [
  { id: 'hero', from: 0.0, to: 0.12, form: 'drop' },
  { id: 'tension', from: 0.12, to: 0.33, form: 'stretch, twist, split' },
  { id: 'showreel', from: 0.33, to: 0.52, form: 'lens (-> thread under the cut to white)' },
  { id: 'projects', from: 0.52, to: 0.63, form: 'thread' },
  { id: 'services', from: 0.63, to: 0.71, form: 'thread' },
  { id: 'ai', from: 0.71, to: 0.76, form: 'thread' },
  { id: 'process', from: 0.76, to: 0.85, form: 'thread' },
  { id: 'studio', from: 0.85, to: 0.88, form: 'thread' },
  { id: 'faq', from: 0.88, to: 0.9, form: 'thread' },
  { id: 'contact', from: 0.9, to: 1.0, form: 'thread -> drop, lands and settles' },
];

export interface Params {
  drop: number; // shape weights (normalised when blending)
  pair: number;
  lens: number;
  thread: number;
  radius: number; // drop radius (scene units, frame half-height = 1.07)
  tear: number; // teardrop taper
  sep: number; // pair: half distance between the two lobes
  neck: number; // pair: smooth-union radius (0 = two separate droplets)
  twist: number; // twist around x (rad per unit)
  rx: number;
  ry: number;
  rz: number;
  amp: number; // liquid surface noise amplitude
  freq: number;
  env: number; // studio rotation (rad): light sweeps
  squash: number; // + flattens (impact), - elongates
  phase: number; // thread: travelling wave phase
}

const base: Params = {
  drop: 1, pair: 0, lens: 0, thread: 0,
  radius: 0.4, tear: 0.35, sep: 0, neck: 0.3, twist: 0,
  rx: 0.18, ry: 0, rz: 0,
  amp: 0.03, freq: 1.5, env: 0, squash: 0, phase: 0,
};

/* Keys: t + the params that change at t (the rest carries over from the previous key). */
const KEYS: [number, Partial<Params>][] = [
  // hero: a small, heavy drop; the studio slowly turns around it
  [0.0, {}],
  [0.11, { ry: 0.5, env: 0.35, amp: 0.045 }],
  // tension: stretch, twist, the neck thins and snaps into two droplets
  [0.14, { drop: 0, pair: 1, tear: 0.1, sep: 0.0, neck: 0.3, amp: 0.05 }],
  [0.2, { sep: 0.26, neck: 0.3, twist: 1.1, ry: 0.35, rz: -0.12, amp: 0.06, env: 0.6 }],
  [0.26, { sep: 0.42, neck: 0.12, twist: 2.0, rz: 0.05, amp: 0.05 }],
  [0.3, { sep: 0.56, neck: 0.015, twist: 2.6, rz: 0.18, env: 0.9, amp: 0.04 }],
  [0.33, { sep: 0.6, neck: 0.0, twist: 2.8, ry: 0.9, amp: 0.05 }],
  // showreel: the droplets fall into each other and open up into a large lens
  [0.38, { pair: 0, lens: 1, sep: 0.2, neck: 0.3, twist: 0.4, rx: -0.3, ry: -0.5, rz: 0, amp: 0.035, env: 1.1 }],
  [0.44, { twist: 0, rx: -0.3, ry: -0.75, amp: 0.007, env: 1.6 }],
  [0.49, { rx: -0.22, ry: 0.8, amp: 0.006, env: 2.3 }],
  // end of showreel (under the cut to white): the lens pulls out into a thin thread pointing forward (+x)
  [0.535, { lens: 0, thread: 1, rx: 0.35, ry: 0, rz: 0, twist: 1.6, amp: 0.006, env: 2.9, phase: 0 }],
  // services / ai / process / studio / faq: the thread leads, a wave travels along it
  [0.71, { phase: 3.2, twist: 2.2, env: 3.3 }],
  [0.76, { phase: 4.8, rx: 0.45 }],
  [0.85, { phase: 7.8, twist: 1.8, env: 3.9 }],
  [0.9, { phase: 9.0, rx: 0.3 }],
  // contact: the thread gathers back into a drop, lands, squashes and settles
  [0.935, { thread: 0, drop: 1, radius: 0.36, tear: 0.45, rx: 0.18, ry: 0.3, twist: 0, amp: 0.05, squash: -0.12, env: 4.3 }],
  [0.955, { squash: 0.2, tear: 0.1, amp: 0.06 }],
  [0.97, { squash: -0.07, amp: 0.045 }],
  [0.985, { squash: 0.025, amp: 0.028 }],
  [1.0, { squash: 0, tear: 0.2, amp: 0.02, env: 4.5, ry: 0.5 }],
];

const FULL: [number, Params][] = (() => {
  const out: [number, Params][] = [];
  let prev = base;
  for (const [t, k] of KEYS) {
    prev = { ...prev, ...k };
    out.push([t, prev]);
  }
  return out;
})();

const smooth = (x: number) => x * x * (3 - 2 * x);

export function paramsAt(t: number): Params {
  const tt = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < FULL.length - 2 && FULL[i + 1][0] <= tt) i++;
  const [t0, a] = FULL[i];
  const [t1, b] = FULL[i + 1];
  const k = t1 > t0 ? smooth(Math.min(1, Math.max(0, (tt - t0) / (t1 - t0)))) : 1;
  const out = {} as Params;
  for (const key of Object.keys(a) as (keyof Params)[]) out[key] = a[key] + (b[key] - a[key]) * k;
  return out;
}

/* Sections -> inclusive frame ranges, for the manifest. */
export function sectionFrames(frames: number): Record<string, [number, number]> {
  const last = frames - 1;
  const out: Record<string, [number, number]> = {};
  for (const s of SECTIONS) out[s.id] = [Math.round(s.from * last), Math.round(s.to * last)];
  return out;
}
