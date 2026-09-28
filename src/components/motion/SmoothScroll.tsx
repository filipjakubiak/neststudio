'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { attachMagnets } from '@/lib/magnet';

/* Lenis + ScrollTrigger na jednym tickerze (gsap.ticker). Wyłączony przy reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: 'auto' });
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    const detachMagnets = attachMagnets(document);
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    return () => {
      document.removeEventListener('click', onClick);
      detachMagnets();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}
