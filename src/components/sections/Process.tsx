'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap } from '@/lib/gsap';
import { introIn, useScene } from '@/components/motion/useScene';
import { SectionIntro } from './SectionIntro';

/*
 * 3.6 How we work: four stages on one thread. The magenta line is driven by your scroll (direct manipulation:
 * scroll back and it retracts); each stage lights up the moment the line reaches its knot. Horizontal on
 * desktop, vertical on a phone, the same thread either way.
 */
export function Process({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const p = c.home.process;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    const steps = q('.step') as HTMLElement[];
    const track = q('.process-track')[0];
    steps.forEach((s) => s.removeAttribute('data-on'));
    gsap.fromTo(track, { '--p': 0 }, {
      '--p': 1, ease: 'none',
      scrollTrigger: {
        trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: 0.4,
        onUpdate: (st) => steps.forEach((s, i) => s.toggleAttribute('data-on', st.progress >= i / steps.length + 0.02)),
      },
    });
  });

  return (
    <section id="proces" ref={root} className="section process" aria-labelledby="proces-t">
      <div className="wrap">
        <SectionIntro id="proces-t" eyebrow={p.eyebrow} title={p.title} lead={p.intro} />
      </div>
      <div className="wrap">
        <div className="process-track">
          <span className="process-line" aria-hidden="true"><span className="process-fill" /></span>
          <ol className="process-steps">
            {p.steps.map((s, i) => (
              <li key={s.title} className="step" data-on>
                <span className="step-knot" aria-hidden="true" />
                <span className="step-n t-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h4">{s.title}</h3>
                <p className="soft t-small">{s.body}</p>
                <div className="step-outcome">
                  <p className="t-caption soft">{p.outcomeLabel}</p>
                  <p className="t-small">{s.outcome}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
