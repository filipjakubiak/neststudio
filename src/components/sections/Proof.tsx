'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { useScene } from '@/components/motion/useScene';

/*
 * 3.3 "Place for proof": client quotes, set on the page grid itself. Hairlines divide the cells and small
 * crosses mark where they meet, like a drafting sheet. The document says: only authentic quotes, with
 * consent; until then each cell shows the document's own [brackets], dimmed as unfinished.
 * Arrival: the lines draw out from the first cross, then the quotes settle one cell after another.
 */
export function Proof({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const items = c.home.proof.items;

  useScene(root, (q, el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 78%', once: true } })
      .from(q('.proof-line-h'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut', stagger: 0.1 }, 0)
      .from(q('.proof-line-v'), { scaleY: 0, duration: 1.0, ease: 'expo.inOut', stagger: 0.08 }, 0.2)
      .from(q('.proof-cross'), { scale: 0, rotation: -90, duration: 0.6, ease: 'back.out(2)', stagger: 0.05 }, 0.5)
      .from(q('.quote'), { y: 24, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: 0.12 }, 0.6);
  });

  return (
    <section id="opinie" ref={root} className="section-sm proof" aria-label={c.system.proofLabel}>
      <div className="wrap">
        <div className="proof-grid" style={{ ['--n' as string]: items.length }}>
          <span className="proof-line-h is-top" aria-hidden="true" />
          <span className="proof-line-h is-bottom" aria-hidden="true" />
          {items.map((_, i) => <span key={`v${i}`} className={`proof-line-v${i === 0 ? ' is-first' : ''}`} style={{ ['--i' as string]: i }} aria-hidden="true" />)}
          <span className="proof-line-v is-last" aria-hidden="true" />
          {Array.from({ length: items.length + 1 }, (_, i) => (
            <span key={`x${i}`} className={`proof-crosses${i === 0 || i === items.length ? ' is-edge' : ''}`} style={{ ['--i' as string]: i }} aria-hidden="true">
              <span className="proof-cross is-top" /><span className="proof-cross is-bottom" />
            </span>
          ))}
          {items.map((it, i) => {
            const ph = it.quote.startsWith('[');
            return (
              <figure key={i} className={`quote${ph ? ' is-ph' : ''}`}>
                <span className="quote-mark" aria-hidden="true">“</span>
                <blockquote className="t-h4 quote-text">{it.quote}</blockquote>
                <figcaption className="quote-by">
                  <span className="t-small">{it.name}</span>
                  <span className="t-caption soft">{it.role}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
