import { describe, expect, it } from 'vitest';
import { buildNestLayout, LIT_SHARE } from '@/scene/nestLayout';

describe('nest layout', () => {
  for (const count of [400, 620, 1400, 2400]) {
    it(`lit share stays within 10..18% and lit strands come last (${count})`, () => {
      const l = buildNestLayout(count);
      const share = l.litCount / count;
      expect(share).toBeGreaterThanOrEqual(0.1);
      expect(share).toBeLessThanOrEqual(0.18);
      const flags = Array.from({ length: count }, (_, i) => l.lit[i * 2]);
      const firstLit = flags.indexOf(1);
      expect(flags.slice(firstLit).every((f) => f === 1)).toBe(true);
      expect(count - firstLit).toBe(l.litCount);
    });
  }

  it('is deterministic and uses orthonormal arc bases with many different tilts', () => {
    const a = buildNestLayout(1000);
    const b = buildNestLayout(1000);
    expect(Array.from(a.nestU)).toEqual(Array.from(b.nestU));
    const axesY: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const u = [a.nestU[i * 4], a.nestU[i * 4 + 1], a.nestU[i * 4 + 2]];
      const v = [a.nestV[i * 4], a.nestV[i * 4 + 1], a.nestV[i * 4 + 2]];
      expect(Math.hypot(...u)).toBeCloseTo(1, 4);
      expect(Math.hypot(...v)).toBeCloseTo(1, 4);
      expect(u[0] * v[0] + u[1] * v[1] + u[2] * v[2]).toBeCloseTo(0, 4);
      axesY.push(Math.abs(u[2] * v[0] - u[0] * v[2])); // |a.y| z a = u × v
    }
    // nie torus: osie nici nie są wspólne, spora część ma oś daleko od pionu
    expect(axesY.filter((y) => y < 0.7).length / 1000).toBeGreaterThan(0.3);
    expect(LIT_SHARE).toBeGreaterThan(0.1);
  });
});
