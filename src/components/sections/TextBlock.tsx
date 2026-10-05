'use client';

import { useRef } from 'react';
import type { Block } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { introIn, useScene } from '@/components/motion/useScene';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionIntro } from './SectionIntro';

/*
 * One text block of a subpage (label, heading, paragraphs, list), set as an Apple feature row: the heading
 * on the left, the text on the right. Lists with named items become small tiles; plain lists become rows
 * on the thread (a short magenta line marks each one, drawn in as the row arrives).
 */
export function TextBlock({ id, b }: { id: string; b: Block }) {
  const root = useRef<HTMLElement>(null);
  const termed = b.list?.some((i) => i.term);

  useScene(root, (q) => {
    if (q('.intro').length) introIn(q('.intro')[0]);
    gsap.from(q('.block-in'), { y: 18, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } });
    if (!termed) gsap.from(q('.row-mark'), { scaleX: 0, duration: 0.9, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: q('.block-list')[0] ?? root.current, start: 'top 80%', once: true } });
  });

  return (
    <section id={id} ref={root} className="section-sm block" aria-labelledby={b.title ? `${id}-t` : undefined}>
      <div className="wrap block-grid">
        <div className="block-head">
          {b.title ? <SectionIntro id={`${id}-t`} eyebrow={b.label} title={b.title} align="start" /> : b.label && <Eyebrow>{b.label}</Eyebrow>}
        </div>
        <div className="block-body">
          {b.body?.map((p, i) => <p key={i} className={`block-in ${b.title ? 'soft' : 't-lead'}`}>{p}</p>)}
          {b.list && (termed ? (
            <ul className="block-terms">
              {b.list.map((it) => (
                <li key={it.text} className="tile block-term block-in">
                  <h3 className="t-h4">{it.term}</h3>
                  <p className="soft t-small">{it.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="block-list">
              {b.list.map((it) => (
                <li key={it.text} className="block-row block-in"><span className="row-mark" aria-hidden="true" /><span>{it.text}</span></li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
