'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK, whenPrepare, whenReady } from '@/lib/motion';
import { ChromePoster } from '@/components/chrome/ChromePoster';

export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lines = el.querySelectorAll('.hero-line-inner');
      const side = el.querySelectorAll('.hero-eyebrow, .hero-lead, .hero-ctas > *');
      /* Intro gra tylko zaraz po preloaderze. Linie chowamy dopiero pod nieprzezroczystą kurtyną
         (nest:prepare), więc h1 maluje się od razu (LCP) i nic nie miga. Chrom w slocie to najpierw
         plakat (pierwsza klatka sekwencji), ChromeGuide przejmuje go po intro (D16). */
      const withPreloader = document.documentElement.getAttribute('data-preloading') === 'true';
      let cancel = () => {};
      if (withPreloader) {
        const cancelPrepare = whenPrepare(() => {
          gsap.set(lines, { yPercent: 110, y: 0 });
          gsap.set(side, { opacity: 0, y: 14 });
        });
        const cancelReady = whenReady(() => {
          gsap.timeline()
            .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out' }, 0)
            .to(side, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.45);
        });
        cancel = () => { cancelPrepare(); cancelReady(); };
      }

      /* Zjazd: elementy boczne w lekkiej paralaksie (chrom odłącza się od nagłówka w ChromeGuide). */
      gsap.to(el.querySelectorAll('.hero-side, .hero-eyebrow'), {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      return () => cancel();
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="hero" data-section="hero" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <Eyebrow className="hero-eyebrow">{c.hero.eyebrow}</Eyebrow>
        <h1 id="hero-title" className="hero-title">
          {c.hero.lines.map((line, i) => (
            <span className="hero-line" key={i}>
              <span className="hero-line-inner">
                {line}
                {i === c.hero.dropAfterLine && <span className="drop-slot" aria-hidden="true"><ChromePoster className="drop-poster" priority /></span>}
              </span>
            </span>
          ))}
        </h1>
        <div className="hero-side">
          <p className="t-lead hero-lead">{c.hero.lead}</p>
          <div className="hero-ctas">
            <Button href="#kontakt" magnetic>{c.hero.ctaPrimary}</Button>
            <Button href="#projekty" variant="ghost">{c.hero.ctaSecondary}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
