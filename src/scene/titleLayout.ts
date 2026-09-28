import { TITLE_GLYPHS, TITLE_SPACE, TITLE_TRACK, type TitleGlyph } from './titleGlyphs';

/* Układ liter "NEST STUDIO" w jednostkach cap height = 1, y w górę, origin = lewy dolny róg boksu.
   Jedna linia (desktop) albo dwie linie NEST / STUDIO (mobile), obie wyrównane do lewej. Wspólny dla
   fallbacku SVG w DOM i dla liter 3D w scenie, więc kotwica DOM i lockup 3D zawsze się pokrywają. */
export const LINE_GAP = 0.3;

export interface TitlePlacement { glyph: TitleGlyph; x: number; y: number }
export interface TitleLayout { letters: TitlePlacement[]; width: number; height: number; stacked: boolean }

function lineWidth(glyphs: TitleGlyph[]): number {
  return glyphs.reduce((w, g) => w + g.adv, 0) + TITLE_TRACK * (glyphs.length - 1);
}

export function layoutTitle(stacked: boolean): TitleLayout {
  const nest = TITLE_GLYPHS.filter((g) => g.word === 0);
  const studio = TITLE_GLYPHS.filter((g) => g.word === 1);
  const letters: TitlePlacement[] = [];
  if (!stacked) {
    let x = 0;
    TITLE_GLYPHS.forEach((g, i) => {
      if (i > 0 && g.word !== TITLE_GLYPHS[i - 1].word) x += TITLE_SPACE;
      letters.push({ glyph: g, x, y: 0 });
      x += g.adv + TITLE_TRACK;
    });
    return { letters, width: x - TITLE_TRACK, height: 1, stacked };
  }
  const height = 2 + LINE_GAP;
  let x = 0;
  nest.forEach((g) => { letters.push({ glyph: g, x, y: 1 + LINE_GAP }); x += g.adv + TITLE_TRACK; });
  x = 0;
  studio.forEach((g) => { letters.push({ glyph: g, x, y: 0 }); x += g.adv + TITLE_TRACK; });
  return { letters, width: Math.max(lineWidth(nest), lineWidth(studio)), height, stacked };
}

const single = layoutTitle(false);
const stackedLayout = layoutTitle(true);
/* Proporcje boksu (szerokość / wysokość) dla CSS aspect-ratio. */
export const TITLE_ASPECT = { single: single.width / single.height, stacked: stackedLayout.width / stackedLayout.height };
