'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';
import { ObjectLoop } from '@/components/objects/ObjectLoop';
import { SectionHead } from './SectionHead';

/* What we do (3.5): bento of five tiles. Each object tile carries its own render; the tile's hairline
   picks up a red glow that follows the pointer (the reference's lit card edge). */
export function Services({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section id="uslugi" ref={root} className="services">
      <div className="wrap">
        <SectionHead eyebrow={c.services.eyebrow} title={c.services.title} lead={c.services.lead} />
        <div className="bento">
          {c.services.items.map((s, i) => (
            <article key={s.id} className={`tile tile-${s.id} ${i === 0 ? 'tile-lg' : ''} ${s.object ? 'has-object' : ''}`} onPointerMove={onMove}>
              {s.object && <ObjectLoop id={s.object} className="tile-object" />}
              <div className="tile-text">
                <p className="t-label text-ink-soft">{String(i + 1).padStart(2, '0')} · {s.name}</p>
                <h3 className="t-h3">{s.title}</h3>
                <p className="text-ink-soft tile-body">{s.body}</p>
                <p className="t-caption t-mono text-ink-soft">{s.scope.join(' · ')}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
