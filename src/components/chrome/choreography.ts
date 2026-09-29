/*
 * Gdzie chrom stoi w każdej sekcji (D16). Klatki niosą kształt, światło i obrót; tu jest tylko
 * pozycja na ekranie, skala, kierunek i warstwa. Każda sekcja celuje w swój kluczowy element:
 * slot w nagłówku, linię napięcia, środek showreela, aktywny projekt, otwartą usługę, stację procesu,
 * CTA, a na końcu gniazdo nici.
 */
import { DROP_FILL, FINAL_DROP_FILL, THREAD_LEN, THREAD_TIP } from '@/lib/chrome/frames';
import { worldToScreenStatic } from '@/scene/state';

export interface Pose {
  x: number;       // środek klatki, px viewportu
  y: number;
  size: number;    // bok klatki na ekranie, px
  rot: number;     // stopnie
  sx: number;      // 1 albo -1 (lustro: nić wskazuje w lewo)
  op: number;
  front: number;   // 1: nad treścią (sekcje z nieprzezroczystymi arkuszami), 0: pod treścią
}

export interface Ctx {
  w: number;
  h: number;
  desktop: boolean;
  el: HTMLElement;
}

export interface SectionChoreo {
  pose: (p: number, c: Ctx) => Pose;
  /* lokalny postęp scrolla -> lokalny postęp klatek (domyślnie liniowo) */
  frames?: (p: number) => number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };

function rect(root: ParentNode, sel: string): DOMRect | null {
  const n = root.querySelector<HTMLElement>(sel);
  return n ? n.getBoundingClientRect() : null;
}

const base = (x: number, y: number, size: number, extra: Partial<Pose> = {}): Pose => ({ x, y, size, rot: 0, sx: 1, op: 1, front: 0, ...extra });

/* Nić wskazuje czubkiem punkt (tx, ty). dir: kierunek, w który patrzy czubek. */
function thread(tx: number, ty: number, len: number, dir: 'right' | 'left' | 'down' | 'up' | number, extra: Partial<Pose> = {}): Pose {
  const size = len / THREAD_LEN;
  const off = THREAD_TIP * size;
  if (dir === 'left') return base(tx + off, ty, size, { sx: -1, ...extra });
  const deg = dir === 'right' ? 0 : dir === 'down' ? 90 : dir === 'up' ? -90 : dir;
  const a = (deg * Math.PI) / 180;
  return base(tx - Math.cos(a) * off, ty - Math.sin(a) * off, size, { rot: deg, ...extra });
}

/* Środek gniazda nici na ekranie (to samo przesunięcie co w Contact.tsx / SceneDirector). */
function nest(c: Ctx) {
  /* mobile: górny łuk gniazda, nad nagłówkiem (środek gniazda leży pod tekstem) */
  return c.desktop ? worldToScreenStatic(2.3, 0) : worldToScreenStatic(0, 1.35);
}

export const CHOREO: Record<string, SectionChoreo> = {
  hero: {
    pose: (_p, c) => {
      const s = rect(c.el, '.drop-slot');
      if (!s) return base(c.w / 2, c.h / 2, 200);
      return base(s.left + s.width / 2, s.top + s.height / 2, s.height / DROP_FILL);
    },
  },

  tension: {
    /* Kropla rozciąga się i pęka dokładnie na linii między "jak wyglądasz" a "ile jesteś wart". */
    pose: (_p, c) => {
      const d = rect(c.el, '.tension-divider');
      const m = Math.min(c.w, c.h);
      if (!d) return base(c.w / 2, c.h / 2, m * 0.6);
      return base(d.left + d.width / 2, d.top + d.height / 2, c.desktop ? m * 0.62 : m * 0.78);
    },
  },

  showreel: {
    /* Peak: soczewka na środku kadru, pod cięciami typografii; gaśnie w cięciu na biel. */
    pose: (p, c) => {
      const m = Math.min(c.w, c.h);
      return base(c.w / 2, c.h * 0.5, c.desktop ? m * 1.02 : c.w * 1.05, { op: 1 - smooth((p - 0.8) / 0.12) * 0.9 });
    },
  },

  projects: {
    /* Nić nad arkuszami wskazuje nazwę aktywnego projektu. */
    pose: (_p, c) => {
      const sheets = Array.from(c.el.querySelectorAll<HTMLElement>('.sheet'));
      let target: DOMRect | null = null;
      for (const s of sheets) {
        const r = s.getBoundingClientRect();
        if (r.top < c.h * 0.62) target = s.querySelector('h3')?.getBoundingClientRect() ?? null;
      }
      if (!target) {
        const t = rect(c.el, '.projects-head h2');
        if (!t) return base(c.w / 2, c.h / 2, 300, { front: 1 });
        return thread(Math.min(c.w - 24, t.right + 28), t.top + t.height * 0.55, c.desktop ? c.w * 0.2 : c.w * 0.34, 'left', { front: 1 });
      }
      if (c.desktop) return thread(target.left - 22, target.top + target.height * 0.55, c.w * 0.17, 'right', { front: 1 });
      return thread(Math.min(target.right + 14, c.w * 0.56), target.top + target.height * 0.55, c.w * 0.36, 'left', { front: 1 });
    },
  },

  services: {
    /* Nić schodzi w pustą środkową strefę otwartej usługi i wskazuje jej opis. */
    pose: (_p, c) => {
      const band = c.el.querySelector<HTMLElement>('.band[data-open="true"]') ?? c.el.querySelector<HTMLElement>('.band');
      if (!band) return base(c.w / 2, c.h / 2, 300);
      const body = band.querySelector('.band-body')?.getBoundingClientRect();
      const head = band.querySelector('.band-head')?.getBoundingClientRect();
      if (c.desktop && body && head) {
        const room = body.top - head.bottom;
        const len = Math.max(90, Math.min(c.h * 0.26, room - 40));
        return thread(body.left + 36, body.top - 18, len, 'down');
      }
      const t = band.querySelector('.band-title')?.getBoundingClientRect() ?? band.getBoundingClientRect();
      return thread(Math.min(c.w - 16, t.right + 16), t.top + t.height / 2, c.w * 0.26, 'left');
    },
  },

  ai: {
    pose: (_p, c) => {
      /* wskazuje pierwszy węzeł przepływu: tu zaczyna się automatyzacja */
      const n = rect(c.el, '.flow-node') ?? rect(c.el, '.aidemo-surface') ?? c.el.getBoundingClientRect();
      return thread(n.left + Math.min(n.width * 0.5, 60), n.top - 14, c.desktop ? c.h * 0.2 : c.h * 0.14, 'down');
    },
  },

  process: {
    /* Igła prowadzi nić przez stacje: celuje w ostatnią zapaloną stację. */
    pose: (_p, c) => {
      const dots = Array.from(c.el.querySelectorAll<HTMLElement>('.step-dot'));
      if (!dots.length) return base(c.w / 2, c.h / 2, 300);
      let pick = dots[0];
      if (c.desktop) {
        const sizes = dots.map((d) => d.getBoundingClientRect().width);
        const max = Math.max(...sizes);
        dots.forEach((d, i) => { if (sizes[i] >= max * 0.9) pick = d; });
      } else {
        let best = Infinity;
        for (const d of dots) {
          const r = d.getBoundingClientRect();
          const dist = Math.abs(r.top - c.h * 0.45);
          if (dist < best) { best = dist; pick = d; }
        }
      }
      const r = pick.getBoundingClientRect();
      if (c.desktop) return thread(r.left + r.width / 2, r.top - 12, c.h * 0.26, 'down');
      return thread(r.left + r.width / 2, r.top - 8, c.h * 0.14, 'down');
    },
  },

  studio: {
    pose: (_p, c) => {
      const t = rect(c.el, '.studio-body h2');
      if (!t) return base(c.w / 2, c.h / 2, 300);
      return thread(t.left + Math.min(t.width * 0.3, 80), t.top - 14, c.desktop ? c.h * 0.2 : c.h * 0.14, 'down');
    },
  },

  faq: {
    pose: (_p, c) => {
      const t = rect(c.el, '.faq-title');
      if (!t) return base(c.w / 2, c.h / 2, 300);
      if (c.desktop) return thread(t.left + t.width * 0.3, t.bottom + 24, c.h * 0.16, 'up');
      return thread(Math.min(c.w - 16, t.right + 12), t.top + t.height / 2, c.w * 0.24, 'left');
    },
  },

  contact: {
    /* Nić wskazuje CTA, zbiera się w kroplę, spada do gniazda, uderza, oddycha i trzyma. */
    frames: (p) => {
      if (p < 0.5) return lerp(0, 0.05, p / 0.5);
      if (p < 0.62) return lerp(0.05, 0.35, (p - 0.5) / 0.12);
      if (p < 0.7) return lerp(0.35, 0.55, (p - 0.62) / 0.08);
      return lerp(0.55, 1, clamp01((p - 0.7) / 0.2));
    },
    pose: (p, c) => {
      const cta = rect(c.el, '.contact-actions .btn') ?? rect(c.el, '.contact-actions');
      const n = nest(c);
      const m = Math.min(c.w, c.h);
      const dropSize = (c.desktop ? m * 0.22 : m * 0.24) / FINAL_DROP_FILL;
      const aim = cta
        ? thread(cta.left + cta.width / 2, cta.bottom + 14, c.desktop ? c.h * 0.18 : c.h * 0.14, 'up')
        : base(n.x, n.y, dropSize);
      const above = base(n.x, n.y - c.h * 0.26, dropSize);
      const land = base(n.x, n.y, dropSize);
      if (p < 0.5) return aim;
      if (p < 0.62) return mix(aim, above, smooth((p - 0.5) / 0.12));
      if (p < 0.7) { const t = clamp01((p - 0.62) / 0.08); return mix(above, land, t * t); }
      return land;
    },
  },
};

export function mix(a: Pose, b: Pose, t: number): Pose {
  let dr = b.rot - a.rot;
  if (dr > 180) dr -= 360;
  if (dr < -180) dr += 360;
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    size: lerp(a.size, b.size, t),
    rot: a.rot + dr * t,
    sx: lerp(a.sx, b.sx, t),
    op: lerp(a.op, b.op, t),
    front: lerp(a.front, b.front, t),
  };
}
