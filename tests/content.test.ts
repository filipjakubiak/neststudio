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

const n = (s: string) => s.replace(/ /g, ' '); // bound orphans use a no-break space
const strings = (c: unknown, name: string) => { const out: { path: string; value: string }[] = []; walk(c, name, out); return out; };

describe('content v2', () => {
  it('pl and en have the same shape', () => {
    expect(shape({ ...en, lang: 's' })).toEqual(shape({ ...pl, lang: 's' }));
  });

  it('contains no em dash or en dash (DESIGN.md)', () => {
    const bad = [...strings(pl, 'pl'), ...strings(en, 'en')].filter((s) => /[–—]/.test(s.value) && s.path.indexOf('options') === -1);
    expect(bad).toEqual([]);
  });

  it('keeps one label for the main action everywhere (strategy: "Porozmawiajmy o projekcie")', () => {
    for (const c of [pl, en]) {
      expect(c.hero.ctaPrimary).toBe(c.nav.cta);
      expect(c.cta.button).toBe(c.nav.cta);
      expect(c.about.link).toBe(c.nav.cta);
    }
    expect(n(pl.nav.cta)).toBe('Porozmawiajmy o projekcie');
  });

  it('takes the key lines from the strategy document', () => {
    expect(n(pl.hero.title.join(' '))).toBe('Wyrazista marka. Sprawniejsze działanie.');
    expect(n(pl.work.title.join(' '))).toBe('Najpierw zobacz, jak projektujemy.');
    expect(pl.process.steps.map((s) => n(s.title))).toEqual(['Zrozumienie', 'Kierunek', 'Projekt i wdrożenie', 'Przekazanie i rozwój']);
    expect(pl.pricing.faq).toHaveLength(8);
    expect(pl.services.items).toHaveLength(5);
  });

  it('follows the copy style bans', () => {
    const banned = /!|innowacyjn|kompleksow|pasj|dedykowan|najwyższej jakości|rewolucj|innovative|cutting-edge|passion|elevate|unleash|game-changer/i;
    expect([...strings(pl, 'pl'), ...strings(en, 'en')].filter((s) => banned.test(s.value))).toEqual([]);
  });

  it('binds Polish single-letter words to the next word', () => {
    const loose = strings(pl, 'pl').filter((s) => !/href|image|\.id$/.test(s.path) && /(^|\s)[aiouwz] /i.test(s.value));
    expect(loose).toEqual([]);
  });

  it('marks every placeholder: bracketed values only where the data is flagged as placeholder', () => {
    for (const c of [pl, en]) {
      for (const s of c.stats.items) expect(s.value.startsWith('[')).toBe(s.placeholder);
      for (const t of c.testimonials.items) expect(t.placeholder).toBe(true);
    }
  });

  it('uses unique keys where components key by text', () => {
    for (const c of [pl, en]) {
      expect(new Set(c.stats.items.map((x) => x.label)).size).toBe(c.stats.items.length);
      expect(new Set(c.process.steps.map((x) => x.title)).size).toBe(c.process.steps.length);
      expect(new Set(c.pricing.faq.map((x) => x.q)).size).toBe(c.pricing.faq.length);
      expect(new Set(c.services.items.map((x) => x.id)).size).toBe(c.services.items.length);
    }
  });

  it('computes years in field from the founding year', () => {
    expect(yearsInField(2026)).toBe(12);
  });
});
