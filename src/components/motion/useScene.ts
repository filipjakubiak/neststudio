'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';

/*
 * One section's choreography. Runs only without reduced motion: content is fully visible in the HTML and
 * stays that way for reduced-motion users (they get the CSS cross-fades instead). Reverted on unmount.
 */
/* A SectionIntro arriving: heading lines materialise (blur + rise, like the hero), then label and lead settle. */
export function introIn(el: Element, start = 'top 82%') {
  const q = gsap.utils.selector(el);
  return gsap.timeline({ scrollTrigger: { trigger: el, start, once: true }, defaults: { ease: 'expo.out' } })
    .from(q('.intro-line'), { yPercent: 35, opacity: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.12 }, 0)
    .from(q('.intro-in'), { y: 14, opacity: 0, duration: 1, stagger: 0.06 }, 0.15);
}

export function useScene(scope: RefObject<HTMLElement | null>, build: (q: (sel: string) => Element[], el: HTMLElement) => void) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const el = scope.current;
      if (!el) return;
      build(gsap.utils.selector(el), el);
    });
    return () => mm.revert();
  }, { scope });
}
