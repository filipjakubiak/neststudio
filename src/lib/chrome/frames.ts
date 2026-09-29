/*
 * Chrom jako sekwencja klatek (D15): czyste funkcje bez DOM, testowane w tests/chrome.test.ts.
 * Manifest pisze remotion/scripts/encode.mjs; tu jest tylko czytany.
 */
import manifest from '../../../public/chrome/manifest.json';

export type ChromeSetId = 'd' | 'm';

export interface ChromeManifest {
  version: string;
  frames: number;
  fps: number;
  sets: Record<ChromeSetId, { size: number; path: string; bytes: number }>;
  posters: Record<ChromeSetId, string>;
  pad: number;
  sections: Record<string, [number, number]>;
  forms: Record<string, string>;
}

export const CHROME: ChromeManifest = manifest as unknown as ChromeManifest;
export const CHROME_POSTER = CHROME.posters;

/* Geometria obiektu w klatce (z remotion/src/journey.ts i chromeShader.ts, kamera: pół wysokości kadru = 1.072):
   średnica kropli / bok klatki, odległość czubka nici od środka / bok klatki. */
export const DROP_FILL = 0.37;
export const FINAL_DROP_FILL = 0.34;
export const THREAD_TIP = 0.41;
export const THREAD_LEN = 0.82;

export function frameUrl(set: ChromeSetId, i: number, m: ChromeManifest = CHROME): string {
  return `${m.sets[set].path}${String(i).padStart(m.pad, '0')}.webp?v=${m.version}`;
}

/* Kolejność sekcji na stronie = kolejność w manifeście. */
export function sectionOrder(m: ChromeManifest = CHROME): string[] {
  return Object.keys(m.sections);
}

/* Klatka (float) dla sekcji i jej lokalnego postępu 0..1. */
export function frameFor(section: string, progress: number, m: ChromeManifest = CHROME): number {
  const r = m.sections[section];
  if (!r) return 0;
  const p = Math.min(1, Math.max(0, progress));
  return r[0] + (r[1] - r[0]) * p;
}

/* Zestaw klatek do pobrania: co `stride`-ta plus ostatnia (Save-Data / wolne łącze: stride 2). */
export function wantedFrames(frames: number, stride: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < frames; i += stride) out.push(i);
  if (out[out.length - 1] !== frames - 1) out.push(frames - 1);
  return out;
}

/* Następna klatka do pobrania: najbliższa bieżącej pozycji scrolla, z lekką przewagą kierunku ruchu. */
export function nextToLoad(
  wanted: number[],
  isDone: (i: number) => boolean,
  target: number,
  direction: 1 | -1 = 1,
): number | null {
  let best: number | null = null;
  let bestScore = Infinity;
  for (const i of wanted) {
    if (isDone(i)) continue;
    const d = i - target;
    const score = Math.abs(d) * (Math.sign(d) === direction || d === 0 ? 0.75 : 1);
    if (score < bestScore) { bestScore = score; best = i; }
  }
  return best;
}

/* Najbliższa załadowana klatka (gdy potrzebnej jeszcze nie ma). */
export function nearestLoaded(i: number, frames: number, has: (i: number) => boolean): number | null {
  const c = Math.round(Math.min(frames - 1, Math.max(0, i)));
  if (has(c)) return c;
  for (let d = 1; d < frames; d++) {
    if (c - d >= 0 && has(c - d)) return c - d;
    if (c + d < frames && has(c + d)) return c + d;
  }
  return null;
}
