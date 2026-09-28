'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED, whenReady } from '@/lib/motion';
import { getSceneBus } from '@/scene/state';

export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const bus = getSceneBus();
    const slot = el.querySelector<HTMLElement>('.drop-slot')!;
    /* Pozycja z layoutu (offsety), niezależna od transformów maski w intro. */
    const measure = () => {
      let x = 0, y = 0, node: HTMLElement | null = slot;
      while (node) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      bus.anchors.heroSlot = { x: x + slot.offsetWidth / 2, y: y + slot.offsetHeight / 2, r: slot.offsetHeight / 2 };
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lines = el.querySelectorAll('.hero-line-inner');
      const side = el.querySelectorAll('.hero-eyebrow, .hero-lead, .hero-ctas > *');
      gsap.set(lines, { yPercent: 110 });
      gsap.set(side, { opacity: 0, y: 14 });
      bus.state.dropVisible = 0;

      const play = () => {
        gsap.timeline()
          .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out' }, 0)
          .to(side, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.45)
          .to(bus.state, { dropVisible: 1, duration: 1.4, ease: 'expo.out' }, 0.55)
          .fromTo(bus.state, { dropAmp: 0.55 }, { dropAmp: 0.12, duration: 2.2, ease: 'expo.out' }, 0.55);
      };
      const cancel = whenReady(play);

      /* Zjazd: hero w lekkiej paralaksie, kropla odłącza się od nagłówka i płynie do sekcji napięcia. */
      gsap.to(el.querySelectorAll('.hero-side, .hero-eyebrow'), {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.fromTo(bus.state, { dropDetach: 0 }, {
        dropDetach: 1, ease: 'power2.inOut', immediateRender: false,
        scrollTrigger: { trigger: el, start: '40% top', end: 'bottom top', scrub: 0.8 },
      });
      return () => cancel();
    });
    mm.add(MOTION_REDUCED, () => {
      bus.state.dropVisible = 1;
    });
    return () => { window.removeEventListener('resize', measure); mm.revert(); };
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
                {i === c.hero.dropAfterLine && <span className="drop-slot" aria-hidden="true" />}
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
