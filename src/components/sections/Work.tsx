'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';
import { SectionHead } from './SectionHead';

/* Selected work (3.3): one large project, two below. Images open from a clipped strip as they arrive. */
export function Work({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('.work-media', root.current).forEach((m) => {
        gsap.fromTo(m, { clipPath: 'inset(18% 8% 18% 8%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: m, start: 'top 92%', end: 'top 40%', scrub: 0.6 },
        });
        const img = m.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: m, start: 'top 92%', end: 'bottom top', scrub: 0.6 } });
      });
    });
  }, { scope: root });

  return (
    <section id="realizacje" ref={root} className="work">
      <div className="wrap">
        <SectionHead eyebrow={c.work.eyebrow} title={c.work.title} lead={c.work.lead} />
        <div className="work-grid">
          {c.work.projects.map((p, i) => (
            <article key={p.id} className={`project ${i === 0 ? 'project-lg' : ''}`}>
              <div className="work-media">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.alt} loading="lazy" decoding="async" width={1600} height={1000} />
                ) : (
                  <div className="work-cover" aria-hidden="true"><span>{p.name}</span></div>
                )}
              </div>
              <div className="project-meta">
                <div className="project-top">
                  <h3 className="t-h3">{p.name}</h3>
                  <span className="t-label text-ink-soft">{p.status} · {p.year}</span>
                </div>
                <p className="text-ink-soft project-sentence">{p.sentence}</p>
                <p className="t-caption t-mono text-ink-soft">{p.tags.join(' · ')}</p>
                {p.href && <a className="link t-small" href={p.href} target="_blank" rel="noopener">{p.linkLabel} ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
