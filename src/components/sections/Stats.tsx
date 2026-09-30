'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* Stats: real numbers count up once when the row comes into view; placeholders stay as they are. */
export function Stats({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      root.current!.querySelectorAll<HTMLElement>('[data-count]').forEach((el, i) => {
        const to = Number(el.dataset.count);
        const from = to > 1000 ? to - 40 : 0; // a year counts the last stretch, not from zero
        const o = { v: from };
        gsap.to(o, {
          v: to,
          duration: 1.6,
          delay: i * 0.08,
          ease: 'expo.out',
          onUpdate: () => { el.textContent = String(Math.round(o.v)); },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    });
  }, { scope: root });

  return (
    <section id="stats" ref={root} className="stats-section">
      <div className="wrap">
        <Eyebrow>{c.stats.eyebrow}</Eyebrow>
        <dl className="stats">
          {c.stats.items.map((s) => (
            <div key={s.label} className="stat" data-placeholder={s.placeholder || undefined}>
              <dt className="t-caption t-mono text-ink-soft">{s.label}</dt>
              <dd className="stat-value" data-count={s.placeholder ? undefined : s.value}>{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="t-caption t-mono text-ink-soft stats-note">{c.stats.note}</p>
      </div>
    </section>
  );
}
