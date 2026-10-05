'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { href } from '@/lib/links';
import { introIn, useScene } from '@/components/motion/useScene';
import { More } from '@/components/ui/Button';
import { ObjectLoop } from '@/components/objects/ObjectLoop';
import { SectionIntro } from './SectionIntro';

/*
 * 3.5 Services as a bento: branding and websites (the core of the offer, ch. 1) get the two large tiles,
 * graphic design, automation and AI the three smaller ones. Each tile is one object you can press; its
 * rendered object plays only while the tile is on screen. Tiles rise row by row as the grid scrolls in.
 */
export function ServicesList({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const s = c.home.services;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    gsap.set(q('.service'), { y: 70, opacity: 0, scale: 0.96 });
    ScrollTrigger.batch(q('.service'), {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1 }),
    });
  });

  return (
    <section id="uslugi" ref={root} className="section services" aria-labelledby="uslugi-t">
      <div className="wrap">
        <SectionIntro id="uslugi-t" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      </div>
      <ul className="wrap bento">
        {c.services.map((sv, i) => (
          <li key={sv.id} className={`tile tile-link service service-${i < 2 ? 'lg' : 'sm'}`}>
            <div className="service-copy">
              <p className="t-eyebrow">{sv.name}</p>
              <h3 className="t-h3">{sv.card.title}</h3>
              <p className="soft service-body">{sv.card.body}</p>
              <p className="t-caption soft service-scope">{sv.card.scope.join(' · ')}</p>
              <More href={href(c, sv.id)} stretched>{sv.card.link}</More>
            </div>
            <ObjectLoop id={sv.object} className="service-object" />
          </li>
        ))}
      </ul>
    </section>
  );
}
