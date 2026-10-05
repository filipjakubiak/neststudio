'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { href } from '@/lib/links';
import { introIn, useScene } from '@/components/motion/useScene';
import { Button } from '@/components/ui/Button';
import { SectionIntro } from './SectionIntro';
import { ProjectTile } from './ProjectTile';

/*
 * 3.3 Selected work, wireframe ch. 6: project 01 full width, 02 and 03 side by side, "All work".
 * The document's one stronger moment of presenting work: project 01 opens up as you scroll to it, its frame
 * widening from an inset card to the full tile while the screenshot settles (scrubbed, so it follows the hand).
 */
export function Work({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const w = c.home.work;
  const [first, ...rest] = c.projects;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    const feat = q('.project.is-featured')[0];
    if (feat) {
      gsap.timeline({ scrollTrigger: { trigger: feat, start: 'top 95%', end: 'top 25%', scrub: 0.6 } })
        .fromTo(feat, { clipPath: 'inset(0% 7% 0% 7% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', ease: 'none' }, 0)
        .fromTo(feat.querySelector('.project-media img, .project-cover'), { scale: 1.14 }, { scale: 1, ease: 'none' }, 0);
    }
    gsap.from(q('.work-pair .project'), {
      y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: q('.work-pair')[0], start: 'top 88%', once: true },
    });
  });

  return (
    <section id="realizacje" ref={root} className="section work" aria-labelledby="realizacje-t">
      <div className="wrap">
        <SectionIntro id="realizacje-t" eyebrow={w.eyebrow} title={w.title} lead={w.lead} />
      </div>
      <div className="wrap work-grid">
        {first && <ProjectTile c={c} p={first} featured />}
        <div className="work-pair">
          {rest.map((p) => <ProjectTile key={p.id} c={c} p={p} />)}
        </div>
        <div className="work-all">
          <Button href={href(c, 'work')} variant="quiet">{w.all}</Button>
        </div>
      </div>
    </section>
  );
}
