'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { href } from '@/lib/links';
import { introIn, useScene } from '@/components/motion/useScene';
import { More } from '@/components/ui/Button';
import { SectionIntro } from './SectionIntro';

/*
 * 3.7 Briefly about the studio, beside the place for a real team photo (the document asks for a real one,
 * signed with names and roles; until then the frame says so). The photo frame opens from the bottom edge.
 */
export function StudioTeaser({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const s = c.home.studio;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    gsap.timeline({ scrollTrigger: { trigger: q('.studio-photo')[0], start: 'top 85%', once: true } })
      .from(q('.studio-photo'), { clipPath: 'inset(100% 0% 0% 0% round 30px)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from(q('.studio-photo-in'), { scale: 1.2, duration: 1.8, ease: 'expo.out' }, 0.1)
      .from(q('.studio-text > *'), { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.3);
  });

  return (
    <section id="studio" ref={root} className="section studio" aria-labelledby="studio-t">
      <div className="wrap studio-grid">
        <figure className="tile studio-photo">
          <div className="studio-photo-in" />
          <figcaption className="studio-photo-cap">
            <span className="ph-badge">{c.system.placeholder}</span>
            <span className="ph t-small">{s.photoAlt}</span>
          </figcaption>
        </figure>
        <div className="studio-copy">
          <SectionIntro id="studio-t" eyebrow={s.eyebrow} title={s.title} align="start" />
          <div className="studio-text">
            {s.body.map((p, i) => <p key={i} className={i === 0 ? 't-lead' : 'soft'}>{p}</p>)}
            <More href={href(c, 'studio')}>{s.link}</More>
          </div>
        </div>
      </div>
    </section>
  );
}
