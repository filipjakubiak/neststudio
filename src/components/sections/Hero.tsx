'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { href } from '@/lib/links';
import { useScene } from '@/components/motion/useScene';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/*
 * 3.2 Hero, keynote-style: one centred statement, then the object on its stage below it.
 * Load: the lines materialise (blur + rise), the object arrives from slightly smaller.
 * Scroll: the copy recedes while the stage keeps growing toward you, so the hero hands over to the work.
 */
export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const h = c.home.hero;

  useScene(root, (q, el) => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(q('.hero-line'), { yPercent: 40, opacity: 0, filter: 'blur(12px)', duration: 1.4, stagger: 0.14 }, 0.05)
      .from(q('.hero-in'), { y: 18, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.45)
      .from(q('.hero-stage'), { scale: 0.9, opacity: 0, duration: 2, ease: 'power3.out' }, 0.25);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 30%', scrub: true } })
      .to(q('.hero-copy'), { y: -60, opacity: 0.15, ease: 'none' }, 0)
      .to(q('.hero-stage'), { scale: 1.12, ease: 'none' }, 0);
  });

  return (
    <section id="hero" ref={root} className="hero">
      <div className="wrap hero-copy center">
        <Eyebrow className="hero-in">{h.eyebrow}</Eyebrow>
        <h1 className="t-hero hero-title">
          {h.title.map((line, i) => <span key={i} className="hero-line">{line}</span>)}
        </h1>
        <p className="t-lead soft hero-lead hero-in">{h.lead}</p>
        <div className="hero-actions hero-in">
          <Button href={href(c, 'contact')}>{h.ctaPrimary}</Button>
          <Button href="#realizacje" variant="quiet" arrow="down">{h.ctaSecondary}</Button>
        </div>
        <p className="t-caption soft hero-micro hero-in">{h.micro}</p>
      </div>
      <div className="hero-stage" aria-hidden="true">
        <div className="hero-glow" />
        <ObjectLoop id="splot" variant="square" mobile="tall" className="hero-object" />
      </div>
    </section>
  );
}
