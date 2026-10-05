'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { introIn, useScene } from '@/components/motion/useScene';
import { SectionIntro } from './SectionIntro';

/*
 * 3.8 FAQ "Before we start.": native <details> (keyboard and screen readers for free). The answer's height
 * eases open on the CSS spring (::details-content), so a second click mid-way simply reverses it.
 */
export function Faq({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const f = c.home.faq;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    gsap.from(q('.faq-item'), {
      y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: q('.faq-list')[0], start: 'top 85%', once: true },
    });
  });

  return (
    <section id="faq" ref={root} className="section faq" aria-labelledby="faq-t">
      <div className="wrap faq-grid">
        <SectionIntro id="faq-t" title={[f.title]} align="start" className="faq-intro" />
        <div className="faq-list">
          {f.items.map((it) => (
            <details key={it.q} className="faq-item" name="faq">
              <summary>
                <span className="t-h4">{it.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p className="soft faq-a">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
