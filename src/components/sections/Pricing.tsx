'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';
import { SectionHead } from './SectionHead';

/* Pricing + FAQ (3.8). Prices are placeholders until Filip confirms real ranges; FAQ is native
   <details> (keyboard and screen readers for free), the open state animates its height in CSS. */
export function Pricing({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id="wycena" ref={root} className="pricing">
      <div className="wrap">
        <SectionHead eyebrow={c.pricing.eyebrow} title={c.pricing.title} lead={c.pricing.lead} />
        <ul className="tiers">
          {c.pricing.tiers.map((t) => (
            <li key={t.name} className="tier">
              <h3 className="t-h3">{t.name}</h3>
              <p className="tier-price" data-placeholder={t.price.startsWith('[') || undefined}>{t.price}</p>
              <p className="text-ink-soft t-small">{t.body}</p>
              <p className="t-caption t-mono text-ink-soft">{t.scope.join(' · ')}</p>
            </li>
          ))}
        </ul>
        <p className="t-caption t-mono text-ink-soft tiers-note">{c.pricing.note}</p>

        <div className="faq">
          <h3 className="t-h2" data-reveal>{c.pricing.faqTitle}</h3>
          <div className="faq-list">
            {c.pricing.faq.map((f) => (
              <details key={f.q} className="faq-item">
                <summary><span>{f.q}</span><span className="faq-plus" aria-hidden="true" /></summary>
                <p className="text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
