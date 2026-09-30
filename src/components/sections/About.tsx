'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';
import { Button } from '@/components/ui/Button';
import { SectionHead } from './SectionHead';

/* About + why choose us (3.7 + 5.2): the story on the left, three principles on the right that light
   up one by one as they pass the middle of the screen. A band folds down between the two columns. */
export function About({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('.principle', root.current).forEach((el) => {
        gsap.fromTo(el, { opacity: 0.28 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 48%', scrub: true } });
      });
    });
  }, { scope: root });

  return (
    <section id="studio" ref={root} className="about">
      <div className="wrap about-grid">
        <div className="about-story">
          <SectionHead eyebrow={c.about.eyebrow} title={c.about.title} />
          {c.about.body.map((p) => <p key={p.slice(0, 24)} className="text-ink-soft">{p}</p>)}
          <Button href="#kontakt" variant="ghost">{c.about.link}</Button>
        </div>
        <ol className="principles">
          {c.about.principles.map((p) => (
            <li key={p.title} className="principle">
              <h3 className="t-h3">{p.title}.</h3>
              <p className="text-ink-soft">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
