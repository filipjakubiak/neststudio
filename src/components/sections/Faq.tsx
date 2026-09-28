'use client';

import { useId, useState } from 'react';
import type { Content } from '@/content/types';

export function Faq({ c }: { c: Content }) {
  const [open, setOpen] = useState<number>(-1);
  const base = useId();
  return (
    <section className="faq section" data-section="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <h2 id="faq-title" className="t-h2 faq-title">{c.faq.title}</h2>
        <ul className="faq-list" role="list">
          {c.faq.items.map((item, i) => {
            const isOpen = open === i;
            const pid = `${base}-${i}`;
            return (
              <li className="faq-item" key={item.q} data-open={isOpen ? 'true' : 'false'}>
                <button type="button" className="faq-q" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="t-h3 faq-q-text">{item.q}</span>
                  <span className="faq-icon" aria-hidden="true"><span /><span /></span>
                </button>
                <div id={pid} className="faq-panel" hidden={!isOpen}>
                  <p className="t-body text-ink-soft measure faq-a">{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
