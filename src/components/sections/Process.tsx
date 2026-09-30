'use client';

import { useCallback, useRef, useState } from 'react';
import type { Content } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';
import { ObjectLoop } from '@/components/objects/ObjectLoop';
import { SectionHead } from './SectionHead';

/* Process (3.6): four plates, one comet. The step whose plate the light is passing is the one lit
   below, so the text and the render tell the same story. Without motion all steps stay readable. */
export function Process({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  useReveal(root);
  const n = c.process.steps.length;

  // comet head over the loop: h = -0.02 + phase * 1.26 (remotion/src/v2/objects/przeplyw.ts)
  const onTime = useCallback((phase: number) => {
    const h = -0.02 + phase * 1.26;
    const i = h < 0 || h >= 1 ? -1 : Math.min(n - 1, Math.floor(h * n));
    setActive((prev) => (prev === i ? prev : i));
  }, [n]);

  return (
    <section id="proces" ref={root} className="process">
      <div className="wrap">
        <SectionHead eyebrow={c.process.eyebrow} title={c.process.title} lead={c.process.intro} />
      </div>
      <ObjectLoop id="proces" variant="wide" mobile="tall" className="process-object" onTime={onTime} />
      <div className="wrap">
        <ol className="steps">
          {c.process.steps.map((s, i) => (
            <li key={s.title} className="step" data-active={active === i || undefined}>
              <span className="t-label text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3">{s.title}</h3>
              <p className="text-ink-soft t-small">{s.body}</p>
              <p className="step-outcome t-caption"><span className="t-label">{c.process.outcomeLabel}</span>{s.outcome}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
