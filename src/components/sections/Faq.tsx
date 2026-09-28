'use client';

import { useId, useRef, useState } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';

export function Faq({ c }: { c: Content }) {
  const [open, setOpen] = useState<number>(-1);
  const base = useId();
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '[data-reveal]' });

  useGSAP(() => {
    const items = root.current!.querySelectorAll<HTMLElement>('.faq-item');
    const reduced = prefersReducedMotion();
    items.forEach((item, i) => {
      const panel = item.querySelector<HTMLElement>('.faq-panel')!;
      const isOpen = i === open;
      panel.hidden = false;
      gsap.to(panel, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, duration: reduced ? 0 : 0.55, ease: 'expo.out', overwrite: 'auto', onComplete: () => { if (!isOpen) panel.hidden = true; } });
    });
  }, { dependencies: [open], scope: root });

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const items = root.current!.querySelectorAll('.faq-item');
    gsap.from(items, { opacity: 0, y: 18, duration: 0.8, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
  }, { scope: root });

  return (
    <section ref={root} className="faq section" data-section="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <h2 id="faq-title" className="t-h2 faq-title" data-reveal>{c.faq.title}</h2>
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
                <div id={pid} className="faq-panel" hidden={!isOpen} style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
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
