'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';

/* 3.8 FAQ "Before we start.": native <details> (keyboard and screen readers for free). */
export function Faq({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const f = c.home.faq;
  useReveal(root);
  return (
    <section id="faq" ref={root} className="faq-section">
      <div className="wrap faq">
        <h2 className="t-h2" data-reveal>{f.title}</h2>
        <div className="faq-list">
          {f.items.map((it) => (
            <details key={it.q} className="faq-item">
              <summary><span>{it.q}</span><span className="faq-plus" aria-hidden="true" /></summary>
              <p className="text-ink-soft">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
