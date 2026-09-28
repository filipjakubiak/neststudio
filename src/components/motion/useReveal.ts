'use client';

import { useGSAP, gsap, SplitText } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import type { RefObject } from 'react';

type Options = { selector?: string; stagger?: number; delay?: number; start?: string; once?: boolean; y?: number };

/* Wejście liniami przez maskę (SplitText lines + mask). Reduced motion: nic. */
export function useReveal(scope: RefObject<HTMLElement | null>, opts: Options = {}) {
  const { selector = '[data-reveal]', stagger = 0.06, delay = 0, start = 'top 80%', once = true } = opts;
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current ?? undefined);
      const splits: SplitText[] = [];
      let cancelled = false;
      const run = () => targets.forEach((el) => {
        if (cancelled) return;
        el.classList.add('split');
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          aria: 'none',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger,
              delay,
              scrollTrigger: { trigger: el, start, once, toggleActions: once ? 'play none none none' : 'play none none reverse' },
            });
          },
        });
        splits.push(split);
      });
      if (document.fonts?.status === 'loaded') run(); else document.fonts.ready.then(run);
      return () => { cancelled = true; splits.forEach((s) => s.revert()); };
    });
    mm.add(MOTION_REDUCED, () => {});
    return () => mm.revert();
  }, { scope });
}
