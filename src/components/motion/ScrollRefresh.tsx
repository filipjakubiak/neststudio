'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * Scroll bookkeeping for the whole page.
 * - Scroll positions are measured with the final fonts: re-measure once they (and images) arrive.
 * - Anchors: CSS `scroll-behavior: smooth` made the browser *animate* the jump to a #hash on page load, and
 *   ScrollTrigger's refresh (scroll to 0 and back to the recorded spot) cut that animation off half-way:
 *   /#uslugi landed in the hero. So the entry jump is instant and lands again after the refresh, and only a
 *   click on a same-page link scrolls smoothly (instantly with reduced motion).
 */
export function ScrollRefresh() {
  useEffect(() => {
    const toHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    const refresh = () => { ScrollTrigger.refresh(); toHash(); };
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a || a.pathname !== location.pathname || !a.hash) return;
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', a.hash);
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' });
    };
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('load', refresh); document.removeEventListener('click', onClick); };
  }, []);
  return null;
}
