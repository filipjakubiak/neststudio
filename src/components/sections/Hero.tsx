'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Lockup } from '@/components/ui/Lockup';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED, STACKED, whenPrepare, whenReady } from '@/lib/motion';
import { getSceneBus, measureAnchor } from '@/scene/state';

/* Hero: lockup "NEST STUDIO" (litery 3D zakotwiczone w boksie .hero-lockup) nad nagłówkiem.
   Po sekwencji tytułowej litery zostają, światło podąża za kursorem; scroll cofa je w głąb. */
export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const bus = getSceneBus();
    const box = el.querySelector<HTMLElement>('.hero-lockup')!;
    const measure = () => { bus.anchors.hero = measureAnchor(box, window.matchMedia(STACKED).matches); };
    measure();
    window.addEventListener('resize', measure);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lines = el.querySelectorAll('.hero-line-inner');
      const side = el.querySelectorAll('.hero-eyebrow, .hero-lead, .hero-ctas > *');
      bus.state.titlesHero = 1;
      if (!window.__nestReady) bus.state.opacity = 0.55; else gsap.to(bus.state, { opacity: 0.55, duration: 1.2 });
      /* Intro gra tylko zaraz po sekwencji tytułowej. Linie chowamy dopiero pod nieprzezroczystym
         overlayem (nest:prepare), więc h1 maluje się od razu (LCP) i nic nie miga. */
      const withSequence = document.documentElement.getAttribute('data-preloading') === 'true';
      let cancel = () => {};
      if (withSequence) {
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

      /* Zjazd: elementy boczne w lekkiej paralaksie, litery cofają się w głąb i gasną, nici przejmują kadr. */
      gsap.to(el.querySelectorAll('.hero-side, .hero-eyebrow'), {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.fromTo(bus.state, { titlesRecede: 0 }, {
        titlesRecede: 1, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
      return () => cancel();
    });
    mm.add(MOTION_REDUCED, () => {});
    return () => { window.removeEventListener('resize', measure); mm.revert(); };
  }, { scope: root });

  return (
    <section ref={root} className="hero" data-section="hero" aria-labelledby="hero-title">
      <div className="wrap hero-lockup-wrap">
        <Lockup className="hero-lockup" />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-head">
          <Eyebrow className="hero-eyebrow">{c.hero.eyebrow}</Eyebrow>
          <h1 id="hero-title" className="hero-title">
            {c.hero.lines.map((line, i) => (
              <span className="hero-line" key={i}>
                <span className="hero-line-inner">{line}</span>
              </span>
            ))}
          </h1>
        </div>
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
