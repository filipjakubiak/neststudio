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
export const FOLD = { crisp: 6, soft: 46, roll: 90 };
const fold = (style, mobile) => {
  const r = FOLD[style] ?? FOLD.crisp;
  return mobile ? Math.min(r, 16) : r;
};

export const RECIPES = {
  cross({ gapY, W, w, e }) {
    const y = gapY(e.gap);
    const [a, b] = e.from === 'left' ? [-2 * w, W + 2 * w] : [W + 2 * w, -2 * w];
    return { points: [[a, y], [b, y]], radii: [], verticals: [] };
  },

  drop({ gapY, W, w, e, mobile }) {
    const [yA, yB] = e.gaps.map(gapY);
    const x = e.x * W;
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
    const yA = gapY(e.gap);
    const x = e.x * W;
    const start = e.from === 'left' ? -w : W + w;
    return {
      points: [[start, yA], [x, yA], [x, yA + e.depth]],
      radii: [fold(e.fold ?? 'crisp', mobile)],
      verticals: [{ x, y0: yA, y1: yA + e.depth }],
    };
  },
};
