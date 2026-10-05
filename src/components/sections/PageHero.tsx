'use client';

import { useRef } from 'react';
import type { Content, ObjectId } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { href } from '@/lib/links';
import { useScene } from '@/components/motion/useScene';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/* Subpage hero (ch. 4 and 5): the same keynote opening as the home hero, one size down. */
export function PageHero({ c, eyebrow, title, lead, object, cta = true }: {
  c: Content;
  eyebrow?: string;
  title: string[];
  lead: string;
  object?: ObjectId;
  cta?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useScene(root, (q, el) => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(q('.hero-line'), { yPercent: 40, opacity: 0, filter: 'blur(12px)', duration: 1.3, stagger: 0.12 }, 0.05)
      .from(q('.hero-in'), { y: 16, opacity: 0, duration: 1, stagger: 0.07 }, 0.4)
      .from(q('.page-stage'), { scale: 0.9, opacity: 0, duration: 1.8, ease: 'power3.out' }, 0.2);
    if (q('.page-stage').length) {
      gsap.to(q('.page-stage'), { scale: 1.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
    }
  });

  return (
    <section id="hero" ref={root} className={`page-hero${object ? ' has-object' : ''}`}>
      <div className="wrap center page-hero-copy">
        {eyebrow && <Eyebrow className="hero-in">{eyebrow}</Eyebrow>}
        <h1 className="t-h1 hero-title">{title.map((l, i) => <span key={i} className="hero-line">{l}</span>)}</h1>
        <p className="t-lead soft hero-lead hero-in">{lead}</p>
        {cta && <div className="hero-actions hero-in"><Button href={href(c, 'contact')}>{c.nav.cta}</Button></div>}
      </div>
      {object && (
        <div className="page-stage" aria-hidden="true">
          <div className="hero-glow" />
          <ObjectLoop id={object} className="page-object" />
        </div>
      )}
    </section>
  );
}
