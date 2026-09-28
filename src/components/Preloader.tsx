'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { markReady, prefersReducedMotion } from '@/lib/motion';
import { FOUNDED_YEAR } from '@/content/site';

const KEY = 'nest_seen';

/* Licznik 2014 → rok + rysowanie znaku. Raz na sesję, nigdy przy reduced motion (decyzja D8). */
export function Preloader({ label }: { label: string }) {
  const [active, setActive] = useState<boolean | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* prywatny tryb */ }
    const skip = seen || prefersReducedMotion();
    if (skip) { markReady(); setActive(false); }
    else { document.documentElement.setAttribute('data-preloading', 'true'); setActive(true); }
  }, []);

  useGSAP(() => {
    if (!active || !root.current) return;
    const el = root.current;
    const counter = { v: FOUNDED_YEAR };
    const tl = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
        document.documentElement.removeAttribute('data-preloading');
        markReady();
        setActive(false);
      },
    });
    tl.set(el.querySelectorAll('.nest-thread'), { drawSVG: '0%' })
      .to(el.querySelectorAll('.nest-thread'), { drawSVG: '100%', duration: 0.5, stagger: 0.18, ease: 'power2.inOut' }, 0)
      .to(counter, { v: year, duration: 1.15, ease: 'expo.inOut', snap: { v: 1 }, onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(counter.v)); } }, 0)
      .to(el, { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, '+=0.2');
  }, { dependencies: [active], scope: root });

  if (!active) return null;
  return (
    <div ref={root} className="preloader" role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <div className="preloader-inner">
        <svg className="preloader-mark" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="nest-thread" d="M15 4V6.44M15 14.56V44" />
          <path className="nest-thread" d="M11 4.5L30.3 33.45M35.7 41.55L38.6 45.9" />
          <path className="nest-thread" d="M33 4V44" />
        </svg>
        <span ref={count} className="preloader-count">{FOUNDED_YEAR}</span>
        <span className="preloader-name">Nest Studio</span>
      </div>
    </div>
  );
}
