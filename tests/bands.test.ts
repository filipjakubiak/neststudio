import { describe, expect, it } from 'vitest';
import { foldedStrip, type Pt } from '@/scene/bands/fold';
import { RECIPES } from '@/scene/bands/recipes';

/* Centerline sample closest to a material distance u (page coordinates, y down). */
function centerAt(r: ReturnType<typeof foldedStrip>, u: number) {
  const mid = Math.floor(r.segV / 2);
  const i = Math.round((u / r.length) * (r.cols - 1));
  const k = (i * r.rows + mid) * 3;
  return { x: r.pos[k], y: -r.pos[k + 1], z: r.pos[k + 2] };
}

describe('folded band geometry', () => {
  const pts: Pt[] = [[1500, 400], [1150, 400], [1150, 800], [-300, 800]];

  it.each([[[6, 6]], [[6, 34]], [[46, 6]]])('keeps every leg on its line with fold radii %j', (radii) => {
    const r = foldedStrip(pts, radii as number[], 120);
    // first leg: horizontal at y=400
    expect(centerAt(r, 100).y).toBeCloseTo(400, 0);
    // vertical leg: x=1150 (sample its middle)
    const e0 = Math.SQRT1_2 * Math.PI * radii[0];
    const mid = 350 - e0 + e0 + 200;
    expect(centerAt(r, mid).x).toBeCloseTo(1150, 0);
    // last leg: horizontal at y=800, runs to the left
    const tail = centerAt(r, r.length - 50);
    expect(tail.y).toBeCloseTo(800, 0);
    expect(tail.x).toBeLessThan(0);
  });

  it('never produces NaN and indexes every quad', () => {
    const r = foldedStrip(pts, [46, 6], 120);
    expect(r.pos.every((v) => Number.isFinite(v))).toBe(true);
    expect(r.index.length).toBe((r.cols - 1) * (r.rows - 1) * 6);
  });
});

describe('band recipes', () => {
  const gapY = (g: string) => ({ 'a/b': 300, 'b/c': 900 })[g] ?? 0;
  it('drop enters from one side, folds at x, leaves on the other', () => {
    const s = RECIPES.drop({ gapY, W: 1440, w: 120, mobile: false, e: { name: 't', recipe: 'drop', gaps: ['a/b', 'b/c'], from: 'right', to: 'left', x: 0.8 } });
    expect(s.points[0][0]).toBeGreaterThan(1440);
    expect(s.points[1]).toEqual([1152, 300]);
    expect(s.points[2]).toEqual([1152, 900]);
    expect(s.points[3][0]).toBeLessThan(0);
    expect(s.verticals).toEqual([{ x: 1152, y0: 300, y1: 900 }]);
  });
  it('cross is a single straight leg edge to edge', () => {
    const s = RECIPES.cross({ gapY, W: 1440, w: 120, mobile: false, e: { name: 't', recipe: 'cross', gap: 'a/b', from: 'left' } });
    expect(s.points).toHaveLength(2);
    expect(s.radii).toEqual([]);
    expect(s.points[0][1]).toBe(300);
  });
});
