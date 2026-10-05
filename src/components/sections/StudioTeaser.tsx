'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { href } from '@/lib/links';
import { useReveal } from '@/components/motion/useReveal';
import { Button } from '@/components/ui/Button';
import { SectionHead } from './SectionHead';

/* 3.7 About the studio: the real photo on the left (placeholder until Filip sends one), text + link. */
export function StudioTeaser({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const s = c.home.studio;
  useReveal(root);
  return (
    <section id="studio" ref={root} className="studio-teaser">
      <div className="wrap studio-grid">
        <figure className="studio-photo" data-placeholder>
          <div className="photo-frame" role="img" aria-label={s.photoAlt}>
            <span className="t-label">{c.system.placeholder}</span>
            <span className="t-caption">{s.photoAlt}</span>
          </div>
        </figure>
        <div className="studio-copy">
          <SectionHead eyebrow={s.eyebrow} title={s.title} />
          {s.body.map((p) => <p key={p.slice(0, 24)} className="text-ink-soft">{p}</p>)}
          <Button href={href(c, 'studio')} variant="ghost">{s.link}</Button>
        </div>
      </div>
    </section>
  );
}
