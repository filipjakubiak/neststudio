'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { EMAIL } from '@/content/site';
import { useReveal } from '@/components/motion/useReveal';
import { Button } from '@/components/ui/Button';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/* Final CTA (3.9): the nest closes the page's light. */
export function Cta({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id="cta" ref={root} className="cta">
      <div className="wrap cta-grid">
        <div className="cta-copy">
          <h2 className="t-h1" data-reveal>{c.cta.title.join(' ')}</h2>
          <p className="t-lead text-ink-soft measure">{c.cta.body}</p>
          <div className="cta-actions">
            <Button href="#kontakt" magnetic>{c.cta.button}</Button>
            <p className="t-small text-ink-soft">{c.cta.mailPrefix} <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
        </div>
        <ObjectLoop id="gniazdo" className="cta-object" />
      </div>
    </section>
  );
}
