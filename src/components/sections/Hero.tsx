'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { href } from '@/lib/links';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/* 3.2 Hero: label, H1, description, two buttons, microtext. The headline rises line by line on load. */
export function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const h = c.home.hero;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from(q('.hero-line > span'), { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
        .from(q('.hero-fade'), { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 0.55)
        .from(q('.hero-object'), { opacity: 0, scale: 0.94, duration: 2.2, ease: 'power2.out' }, 0.2);
    });
  }, { scope: root });

  return (
    <section id="hero" ref={root} className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Eyebrow className="hero-fade">{h.eyebrow}</Eyebrow>
          <h1 className="hero-title">
            {h.title.map((line, i) => (
              <span key={i} className="hero-line"><span>{line}</span></span>
            ))}
          </h1>
          <p className="t-lead text-ink-soft hero-lead hero-fade">{h.lead}</p>
          <div className="hero-actions hero-fade">
            <Button href={href(c, 'contact')} magnetic>{h.ctaPrimary}</Button>
            <Button href="#realizacje" variant="ghost" icon={false}>{h.ctaSecondary} ↓</Button>
          </div>
          <p className="t-caption text-ink-soft hero-fade hero-micro">{h.micro}</p>
        </div>
        <ObjectLoop id="splot" variant="square" className="hero-object" />
      </div>
    </section>
  );
}
