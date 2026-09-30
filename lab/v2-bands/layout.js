/*
 * Resolves a page's band plan against the live layout, so the same recipes work on any page and
 * any breakpoint without hand-placed coordinates:
 *  - gaps are measured between the last content of one section and the first content of the next;
 *  - a band never gets wider than its narrowest gap allows;
 *  - a vertical leg that would pass behind text slides to the nearest free column;
 *    if there is none, the band degrades to a straight `cross` and the page reports it.
 * Plan entry: { name, recipe, ...params, mobile?: {...overrides} | false }
 */
import { RECIPES } from './recipes.js';

const TEXT = 'h1, h2, h3, p, li, a.btn, .label, .stat, .tile, img, video, blockquote, figure';
const MARGIN = 24; // clear space between a band and any text box

function pageRect(el) {
  const r = el.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY };
}

function gapOf(name) {
  const [a, b] = name.split('/').map((id) => document.getElementById(id));
  if (!a || !b) throw new Error(`band plan: unknown gap "${name}"`);
  const end = pageRect(a.lastElementChild).bottom;
  const start = pageRect(b.firstElementChild).top;
  return { y: (end + start) / 2, room: start - end };
}

export function resolvePlan(plan) {
  const W = innerWidth, mobile = W < 900;
  const baseW = mobile ? 54 : Math.min(150, Math.max(90, W * 0.085));
  const boxes = [...document.querySelectorAll(`main :is(${TEXT})`)].map(pageRect).filter((b) => b.right > b.left);
  const gapY = (name) => gapOf(name).y;
  const report = [];
  const out = [];

  const hits = (x, w, v) =>
    boxes.some((b) => b.bottom > v.y0 && b.top < v.y1 && b.right > x - w / 2 - MARGIN && b.left < x + w / 2 + MARGIN);

  for (const raw of plan) {
    if (mobile && raw.mobile === false) continue;
    const e = { ...raw, ...(mobile && raw.mobile ? raw.mobile : {}) };
    const recipe = RECIPES[e.recipe];
    if (!recipe) { report.push(`${e.name}: unknown recipe "${e.recipe}"`); continue; }

    const gaps = e.gaps ?? [e.gap];
    const room = Math.min(...gaps.map((g) => gapOf(g).room));
    const w = Math.max(28, Math.min(baseW, room - 2 * MARGIN));
    if (w < baseW) report.push(`${e.name}: gap is tight, band narrowed to ${Math.round(w)} px`);

    let shape = recipe({ gapY, W, w, e, mobile });
    for (const v of shape.verticals) {
      if (!hits(v.x, w, v)) continue;
      // nearest free x for this vertical leg
      let best = null;
      for (let x = W * 0.03; x <= W * 0.97; x += 4) {
        if (!hits(x, w, v) && (best === null || Math.abs(x - v.x) < Math.abs(best - v.x))) best = x;
      }
      if (best === null) {
        report.push(`${e.name}: no free column for the vertical leg, degraded to cross`);
        shape = RECIPES.cross({ gapY, W, w, e: { gap: gaps[0], from: e.from } });
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
