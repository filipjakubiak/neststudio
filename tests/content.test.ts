import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
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

/* The strategy document, as plain text: the site copy must come from it (1:1). */
const doc = fs.readFileSync('docs/v2/source/copywriting-strategia.html', 'utf8')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const inDoc = (s: string) => doc.includes(n(s).replace(/\s+/g, ' '));

describe('content follows the strategy document 1:1', () => {
  it('home headings and texts are the document’s', () => {
    const h = pl.home;
    for (const s of [
      h.hero.eyebrow.toUpperCase(), h.hero.lead, h.hero.micro, ...h.hero.title,
      ...h.work.title, h.work.lead,
      ...h.direction.title, ...h.direction.body,
      ...h.services.title, h.services.lead,
      ...h.process.title, h.process.intro, ...h.process.steps.flatMap((s) => [s.body, s.outcome]),
      ...h.studio.title, h.studio.body[1], h.studio.body[2],
      h.faq.title, ...h.faq.items.flatMap((f) => [f.q, f.a]),
      ...h.cta.title,
    ]) expect(inDoc(s), s).toBe(true);
  });

  it('service cards and pages are the document’s', () => {
    for (const s of pl.services) {
      for (const t of [s.card.title, s.card.body, ...s.page.title]) expect(inDoc(t), t).toBe(true);
      for (const b of s.page.blocks) for (const t of [...(b.title ?? []), ...(b.body ?? [])]) {
        if (!/[,:] (na przykład|nie tylko)/.test(t)) expect(inDoc(t), t).toBe(true); // dash replaced by comma
      }
    }
  });

  it('subpage headings are the document’s', () => {
    for (const t of [...pl.workPage.title, ...pl.studioPage.title, ...pl.studioPage.approach.title!, ...pl.contactPage.title, pl.contactPage.lead])
      expect(inDoc(t), t).toBe(true);
  });

  it('navigation is the document’s: Work, Services, Studio + the main action', () => {
    expect(pl.nav.links.map((l) => l.label)).toEqual(['Realizacje', 'Usługi', 'Studio']);
    expect(n(pl.nav.cta)).toBe('Porozmawiajmy o projekcie');
    for (const c of [pl, en]) {
      expect(c.home.hero.ctaPrimary).toBe(c.nav.cta);
      expect(c.home.cta.button).toBe(c.nav.cta);
    }
  });
});

describe('content hygiene', () => {
  it('pl and en have the same shape', () => {
    expect(shape({ ...en, lang: 's' })).toEqual(shape({ ...pl, lang: 's' }));
  });

  it('contains no em dash or en dash (DESIGN.md)', () => {
    expect([...strings(pl, 'pl'), ...strings(en, 'en')].filter((s) => /[–—]/.test(s.value))).toEqual([]);
  });

  it('binds Polish single-letter words to the next word', () => {
    const loose = strings(pl, 'pl').filter((s) => !/paths|href|image|\.id$|\.page$|\.hash$|\.object$/.test(s.path) && /(^|\s)[aiouwz] /i.test(s.value));
    expect(loose).toEqual([]);
  });

  it('marks placeholders honestly', () => {
    for (const c of [pl, en]) for (const s of c.home.stats.items) expect(s.value.startsWith('[')).toBe(s.placeholder);
  });

  it('every page has a path in both languages and every service a page', () => {
    for (const c of [pl, en]) {
      for (const s of c.services) expect(c.paths[s.id]).toMatch(/\/$/);
      expect(new Set(Object.values(c.paths)).size).toBe(Object.keys(c.paths).length);
    }
  });

  it('computes years in field from the founding year', () => {
    expect(yearsInField(2026)).toBe(12);
  });
});
