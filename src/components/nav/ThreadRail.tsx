'use client';

import { useEffect, useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { DESKTOP, prefersReducedMotion } from '@/lib/motion';

const SECTIONS = ['hero', 'tension', 'showreel', 'projects', 'services', 'ai', 'process', 'studio', 'faq', 'contact'];

/* Nić-rail: cień sceny na prawej krawędzi. Każda przekroczona sekcja zostawia splot; klik przenosi do sekcji. */
export function ThreadRail({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia(DESKTOP).matches) return;
    const el = root.current!;
    const marks = Array.from(el.querySelectorAll<HTMLElement>('.rail-mark'));
    const fill = el.querySelector<HTMLElement>('.rail-fill')!;
    const triggers: ScrollTrigger[] = [];
    SECTIONS.forEach((name, i) => {
      const section = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
      if (!section) return;
      triggers.push(ScrollTrigger.create({
        trigger: section, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => {
          marks[i].setAttribute('data-state', self.isActive ? 'active' : self.progress >= 1 || self.direction > 0 && !self.isActive && self.start < self.scroll() ? 'past' : 'future');
          if (self.isActive) marks.forEach((m, j) => { if (j < i) m.setAttribute('data-state', 'past'); if (j > i) m.setAttribute('data-state', 'future'); });
        },
      }));
    });
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { fill.style.transform = `scaleY(${self.progress})`; } });
    const onClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.rail-mark');
      if (!btn) return;
      const target = document.querySelector<HTMLElement>(`[data-section="${btn.dataset.target}"]`);
      if (!target) return;
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView();
    };
    el.addEventListener('click', onClick);
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.6, ease: 'power2.out' });
    return () => { triggers.forEach((t) => t.kill()); st.kill(); el.removeEventListener('click', onClick); };
  }, []);

  const labels: Record<string, string> = {
    hero: 'Nest Studio', tension: c.tension.leftWord, showreel: c.showreel.cuts[0].label, projects: c.nav.links[0].label,
    services: c.nav.links[1].label, ai: 'AI', process: c.nav.links[2].label, studio: c.nav.links[3].label, faq: 'FAQ', contact: c.nav.links[4].label,
  };

  return (
    <nav ref={root} className="rail" aria-label={c.system.rail}>
      <span className="rail-line" aria-hidden="true"><span className="rail-fill" /></span>
      <ul className="rail-marks">
        {SECTIONS.map((s) => (
          <li key={s}>
            <button type="button" className="rail-mark" data-target={s} data-state="future" aria-label={labels[s]}>
              <span className="rail-knot" aria-hidden="true" />
              <span className="rail-label t-label">{labels[s]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
