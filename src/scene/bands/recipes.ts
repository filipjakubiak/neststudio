/*
 * Band recipes: named shapes a page can place into the gaps between its sections.
 * A recipe turns a plan entry + the measured page into a polyline (page px, y down) and fold radii.
 * Every leg is axis-aligned; corners become folds in fold.js.
 *
 *   cross  straight band edge to edge through one gap          { gap }
 *   drop   along gap A, fold down at x, along gap B out a side  { gaps: [A, B], from, to, x }
 *          from == to -> U (wrapped back), from != to -> S/L (passes through)
 *   hook   along gap A, fold down at x, runs `depth` px and ends (slides out beside a column)
 *                                                               { gap, from, x, depth }
 * Fold styles: crisp = folded paper corner, soft = rounded wrap with a gradient, roll = big curl.
 */
import type { Pt } from './fold';

export type FoldStyle = 'crisp' | 'soft' | 'roll';
export type PlanEntry = {
  name: string;
  recipe: 'cross' | 'drop' | 'hook';
  gap?: string;
  gaps?: [string, string];
  from?: 'left' | 'right';
  to?: 'left' | 'right';
  x?: number;
  depth?: number;
  fold?: FoldStyle;
  folds?: [FoldStyle, FoldStyle];
  period?: number;
  phase?: number;
  mobile?: Partial<PlanEntry> | false;
};
export type Shape = { points: Pt[]; radii: number[]; verticals: { x: number; y0: number; y1: number }[] };
type Ctx = { gapY: (name: string) => number; W: number; w: number; e: PlanEntry; mobile: boolean };

export const FOLD: Record<FoldStyle, number> = { crisp: 6, soft: 46, roll: 90 };
const fold = (style: FoldStyle | undefined, mobile: boolean) => {
  const r = FOLD[style ?? 'crisp'] ?? FOLD.crisp;
  return mobile ? Math.min(r, 16) : r;
};

export const RECIPES: Record<PlanEntry['recipe'], (c: Ctx) => Shape> = {
  cross({ gapY, W, w, e }) {
    const y = gapY(e.gap ?? e.gaps![0]);
    const [a, b] = e.from === 'left' ? [-2 * w, W + 2 * w] : [W + 2 * w, -2 * w];
    return { points: [[a, y], [b, y]], radii: [], verticals: [] };
  },

  drop({ gapY, W, w, e, mobile }) {
    const [yA, yB] = e.gaps!.map(gapY);
    const x = (e.x ?? 0.5) * W;
    const start = e.from === 'left' ? -w : W + w;
    const end = e.to === 'left' ? -3 * w : W + 3 * w;
    const [s1, s2] = e.folds ?? ['crisp', 'soft'];
    return {
      points: [[start, yA], [x, yA], [x, yB], [end, yB]],
      radii: [fold(s1, mobile), fold(s2, mobile)],
      verticals: [{ x, y0: yA, y1: yB }],
    };
  },

  hook({ gapY, W, w, e, mobile }) {
    const yA = gapY(e.gap!);
    const x = (e.x ?? 0.5) * W;
    const depth = e.depth ?? 300;
    const start = e.from === 'left' ? -w : W + w;
    return {
      points: [[start, yA], [x, yA], [x, yA + depth]],
      radii: [fold(e.fold ?? 'crisp', mobile)],
      verticals: [{ x, y0: yA, y1: yA + depth }],
    };
  },
};
