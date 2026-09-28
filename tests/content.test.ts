import { describe, expect, it } from 'vitest';
import { pl } from '@/content/pl';
import { en } from '@/content/en';
import { yearsInField } from '@/content/site';

function walk(value: unknown, path: string, out: { path: string; value: string }[]) {
  if (typeof value === 'string') out.push({ path, value });
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, `${path}.${k}`, out));
}

function shape(value: unknown): unknown {
  if (typeof value === 'string') return 's';
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  return typeof value;
}

describe('content', () => {
  it('pl and en have the same shape', () => {
    const sp = shape({ ...pl, lang: 's' });
    const se = shape({ ...en, lang: 's' });
    expect(se).toEqual(sp);
  });

  it('contains no em dash or en dash', () => {
    const strings: { path: string; value: string }[] = [];
    walk(pl, 'pl', strings);
    walk(en, 'en', strings);
    const bad = strings.filter((s) => /[–—]/.test(s.value));
    expect(bad).toEqual([]);
  });

  it('uses at most four eyebrows', () => {
    const eyebrows = [pl.hero.eyebrow, pl.showreel.eyebrow, pl.services.eyebrow, pl.contact.eyebrow];
    expect(eyebrows.every(Boolean)).toBe(true);
    expect(eyebrows.length).toBeLessThanOrEqual(5);
  });

  it('keeps one label per contact intent', () => {
    expect(pl.nav.cta).toBe(pl.hero.ctaPrimary);
    expect(pl.hero.ctaPrimary).toBe(pl.contact.cta);
    expect(en.nav.cta).toBe(en.hero.ctaPrimary);
    expect(en.hero.ctaPrimary).toBe(en.contact.cta);
  });

  it('every ai preset has five steps', () => {
    for (const c of [pl, en]) for (const p of c.aiDemo.presets) expect(p.steps).toHaveLength(5);
  });

  it('computes years in field from the founding year', () => {
    expect(yearsInField(2026)).toBe(12);
  });

  it('hero headline lines stay short', () => {
    for (const c of [pl, en]) for (const line of c.hero.lines) expect(line.split(' ').length).toBeLessThanOrEqual(5);
  });
});
