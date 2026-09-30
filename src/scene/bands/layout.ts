/*
 * Resolves a page's band plan against the live layout, so the same recipes work on any page and
 * breakpoint without hand-placed coordinates (docs/v2/system.md):
 *  - gaps are measured between the last content of one section and the first content of the next;
 *  - a band never gets wider than its narrowest gap allows;
 *  - a vertical leg that would pass behind text slides to the nearest free column; if there is none,
 *    the band degrades to a straight `cross` and the page reports it in the console.
 */
import { RECIPES, type PlanEntry, type Shape } from './recipes';

// what a band must not pass behind (object videos are decorative, mostly black, and may overlap)
const TEXT = 'h1, h2, h3, p, li, a.btn, .t-label, .stat, .tile, img, blockquote, figure, form';
const MARGIN = 24;

export type ResolvedBand = Shape & { name: string; width: number; period: number; phase: number; top: number; bottom: number };

type Box = { left: number; right: number; top: number; bottom: number };
function pageRect(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY };
}

/* Text blocks span their container, but only the ink matters: measure the text itself. */
const INLINE_TEXT = new Set(['P', 'H1', 'H2', 'H3', 'LI', 'BLOCKQUOTE']);
function inkRect(el: Element): Box {
  if (!INLINE_TEXT.has(el.tagName) && !el.classList.contains('t-label')) return pageRect(el);
  const range = document.createRange();
  range.selectNodeContents(el);
  const r = range.getBoundingClientRect();
  return r.width ? { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY } : pageRect(el);
}

function gapOf(name: string) {
  const [a, b] = name.split('/').map((id) => document.getElementById(id));
  if (!a || !b || !a.lastElementChild || !b.firstElementChild) throw new Error(`band plan: unknown gap "${name}"`);
  const end = pageRect(a.lastElementChild).bottom;
  const start = pageRect(b.firstElementChild).top;
  return { y: (end + start) / 2, room: start - end };
}

export function resolvePlan(plan: PlanEntry[]): ResolvedBand[] {
  const W = innerWidth;
  const mobile = W < 900;
  const baseW = mobile ? 48 : Math.min(150, Math.max(90, W * 0.085));
  const boxes = [...document.querySelectorAll(`main :is(${TEXT})`)].map(inkRect).filter((b) => b.right > b.left);
  const gapY = (name: string) => gapOf(name).y;
  const report: string[] = [];
  const out: ResolvedBand[] = [];
  const hits = (x: number, w: number, v: { y0: number; y1: number }) =>
    boxes.some((b) => b.bottom > v.y0 && b.top < v.y1 && b.right > x - w / 2 - MARGIN && b.left < x + w / 2 + MARGIN);

  for (const raw of plan) {
    if (mobile && raw.mobile === false) continue;
    const e: PlanEntry = { ...raw, ...(mobile && raw.mobile ? raw.mobile : {}) };
    const recipe = RECIPES[e.recipe];
    if (!recipe) { report.push(`${e.name}: unknown recipe "${e.recipe}"`); continue; }
    const gaps = e.recipe === 'drop' ? e.gaps ?? [] : [e.gap ?? e.gaps?.[0] ?? ''];
    let room = Infinity;
    try { room = Math.min(...gaps.map((g) => gapOf(g).room)); } catch (err) { report.push(String(err)); continue; }
    const w = Math.max(28, Math.min(baseW, room - 2 * MARGIN));
    if (w < baseW) report.push(`${e.name}: gap is tight, band narrowed to ${Math.round(w)} px`);

    let shape = recipe({ gapY, W, w, e, mobile });
    for (const v of shape.verticals) {
      if (!hits(v.x, w, v)) continue;
      let best: number | null = null;
      for (let x = W * 0.03; x <= W * 0.97; x += 4) {
        if (!hits(x, w, v) && (best === null || Math.abs(x - v.x) < Math.abs(best - v.x))) best = x;
      }
      if (best === null) {
        report.push(`${e.name}: no free column for the vertical leg, degraded to cross`);
        shape = RECIPES.cross({ gapY, W, w, e: { ...e, recipe: 'cross', gap: gaps[0] }, mobile });
        break;
      }
      report.push(`${e.name}: vertical leg moved ${Math.round(v.x)} -> ${Math.round(best)} px to clear text`);
      e.x = best / W;
      shape = recipe({ gapY, W, w, e, mobile });
    }
    const ys = shape.points.map((p) => p[1]);
    out.push({ name: e.name, ...shape, width: w, period: e.period ?? 24, phase: e.phase ?? 0, top: Math.min(...ys), bottom: Math.max(...ys) });
  }
  if (report.length) console.info('[bands]\n  ' + report.join('\n  '));
  return out;
}
