import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { pl } from '@/content/pl';
import { en } from '@/content/en';
import { yearsInField } from '@/content/site';
import { HUMANIZED, REMOVED } from '@/content/edits';

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
const norm = (s: string) => n(s).replace(/\s+/g, ' ');
/* a site text is the document's own, or a recorded humanize rewrite of a document sentence (src/content/edits.ts) */
const rewrites = HUMANIZED.map((h) => ({ doc: norm(h.doc), site: norm(h.site) }));
const inDoc = (s: string) => {
  let t = norm(s);
  for (const r of rewrites) t = t.replace(r.site, r.doc);
  // the document writes [NAZWA] for the studio's name
  return doc.includes(t) || doc.includes(t.replace(/Nest Studio/g, '[NAZWA]'));
};

describe('content follows the strategy document 1:1', () => {
  it('home headings and texts are the document’s', () => {
    const h = pl.home;
    for (const s of [
      h.hero.eyebrow.toUpperCase(), h.hero.lead, h.hero.micro, ...h.hero.title,
      ...h.work.title, h.work.lead,
      ...h.direction.title, ...h.direction.body,
      ...h.services.title, h.services.lead,
      ...h.process.title, h.process.intro, ...h.process.steps.flatMap((s) => [s.body, s.outcome]),
      ...h.studio.title, h.studio.body[1],
      h.faq.title, ...h.faq.items.flatMap((f) => [f.q, f.a]),
      ...h.cta.title,
    ]) expect(inDoc(s), s).toBe(true);
  });

  it('service cards and pages are the document’s', () => {
    for (const s of pl.services) {
      for (const t of [s.card.title, s.card.body, ...s.page.title]) expect(inDoc(t), t).toBe(true);
      for (const b of s.page.blocks) for (const t of [...(b.title ?? []), ...(b.body ?? [])]) {
        expect(inDoc(t), t).toBe(true);
      }
    }
  });

  it('subpage headings are the document’s', () => {
    for (const t of [...pl.workPage.title, pl.workPage.lead, ...pl.studioPage.title, pl.studioPage.lead, ...pl.studioPage.approach.title!, ...pl.studioPage.approach.body!, ...pl.studioPage.principles.flatMap((p) => [p.title, p.body]), ...pl.contactPage.title, pl.contactPage.lead])
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

  it('every humanize rewrite is a real document sentence, and removed sentences are gone', () => {
    for (const h of HUMANIZED) expect(doc.includes(norm(h.doc)), h.doc).toBe(true);
    const all = strings(pl, 'pl').map((s) => norm(s.value)).join(' ');
    for (const r of REMOVED) expect(all.includes(r)).toBe(false);
  });

  it('contains no em dash or en dash (humanize-text: the strongest AI tell)', () => {
    expect([...strings(pl, 'pl'), ...strings(en, 'en')].filter((s) => /[–—]/.test(s.value))).toEqual([]);
  });

  it('binds Polish single-letter words to the next word', () => {
    const loose = strings(pl, 'pl').filter((s) => !/paths|href|image|\.id$|\.page$|\.hash$|\.object$/.test(s.path) && /(^|\s)[aiouwz] /i.test(s.value));
    expect(loose).toEqual([]);
  });

  it('invents no client quotes: until real ones arrive, the document’s own brackets', () => {
    for (const q of pl.home.proof.items) for (const t of [q.quote, q.name, q.role]) expect(t.startsWith('[') && inDoc(t), t).toBe(true);
  });

  it('invents no project facts: a sentence is the document’s or a [placeholder]', () => {
    for (const p of pl.projects) expect(p.sentence.startsWith('[') || inDoc(p.sentence.replace(/\.$/, '')), p.sentence).toBe(true);
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
