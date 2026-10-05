'use client';

import { useRef } from 'react';
import type { Block } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* One block of the document: label, heading (lines), paragraphs and/or a list (term: text). */
export function TextBlock({ b, id, index }: { b: Block; id?: string; index?: number }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id={id} ref={root} className="text-block">
      <div className="wrap text-block-grid">
        <div className="text-block-side">
          {index !== undefined && <span className="t-label text-ink-soft">{String(index).padStart(2, '0')}</span>}
          {b.label && <Eyebrow>{b.label}</Eyebrow>}
        </div>
        <div className="text-block-main">
          {b.title && <h2 className="t-h2" data-reveal>{b.title.join(' ')}</h2>}
          {b.body?.map((p) => <p key={p.slice(0, 24)} className="t-lead text-ink-soft">{p}</p>)}
          {b.list && (
            <ul className="block-list">
              {b.list.map((it) => (
                <li key={it.text}>
                  {it.term ? <><strong>{it.term}</strong><span className="text-ink-soft">{it.text}</span></> : <span>{it.text}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
