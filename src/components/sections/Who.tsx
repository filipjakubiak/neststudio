'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';
import { SectionHead } from './SectionHead';

/* Who we are (3.4): one direction. The three pillars draw their top line left to right, in order. */
export function Who({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ scrollTrigger: { trigger: q('.pillars')[0], start: 'top 82%', once: true } })
        .from(q('.pillar-rule'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, stagger: 0.18, ease: 'expo.inOut' })
        .from(q('.pillar-body'), { opacity: 0, y: 12, duration: 0.8, stagger: 0.18 }, 0.4);
    });
  }, { scope: root });

  return (
    <section id="who" ref={root} className="who">
      <div className="wrap">
        <SectionHead eyebrow={c.who.eyebrow} title={c.who.title} />
        <div className="who-body">
          {c.who.body.map((p) => <p key={p.slice(0, 24)} className="t-lead text-ink-soft">{p}</p>)}
        </div>
        <ol className="pillars">
          {c.who.pillars.map((p) => (
            <li key={p.n} className="pillar">
              <span className="pillar-rule" aria-hidden="true" />
              <div className="pillar-body">
                <span className="t-label text-ink-soft">{p.n}</span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="text-ink-soft">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
