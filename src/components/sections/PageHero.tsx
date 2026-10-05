'use client';

import { useRef } from 'react';
import type { Content, ObjectId } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { href } from '@/lib/links';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/* Subpage hero (4.x / 5.x): H1 in the document's two lines, lead, optional CTA and object. */
export function PageHero({ c, eyebrow, title, lead, object, cta = true }: {
  c: Content;
  eyebrow?: string;
  title: string[];
  lead: string;
  object?: ObjectId;
  cta?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from(q('.hero-line > span'), { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.05)
        .from(q('.hero-fade'), { opacity: 0, y: 14, duration: 0.9, stagger: 0.07 }, 0.45)
        .from(q('.hero-object'), { opacity: 0, scale: 0.94, duration: 2, ease: 'power2.out' }, 0.2);
    });
  }, { scope: root });

  return (
    <section id="hero" ref={root} className={`hero page-hero ${object ? '' : 'no-object'}`}>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          {eyebrow && <Eyebrow className="hero-fade">{eyebrow}</Eyebrow>}
          <h1 className="hero-title">
            {title.map((line, i) => <span key={i} className="hero-line"><span>{line}</span></span>)}
          </h1>
          <p className="t-lead text-ink-soft hero-lead hero-fade">{lead}</p>
          {cta && <div className="hero-actions hero-fade"><Button href={href(c, 'contact')} magnetic>{c.nav.cta}</Button></div>}
        </div>
        {object && <ObjectLoop id={object} variant="square" className="hero-object" />}
      </div>
    </section>
  );
}
