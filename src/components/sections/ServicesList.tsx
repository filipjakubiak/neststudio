'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { href } from '@/lib/links';
import { useReveal } from '@/components/motion/useReveal';
import { ObjectLoop } from '@/components/objects/ObjectLoop';
import { SectionHead } from './SectionHead';

/*
 * 3.5 Services, as the document's wireframe draws them: rows "01 Branding | description / scope | link".
 * Each row carries its rendered object; the row's hairline lights red when hovered.
 */
export function ServicesList({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const h = c.home.services;
  useReveal(root);

  return (
    <section id="uslugi" ref={root} className="services">
      <div className="wrap">
        <SectionHead eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
        <ol className="service-rows">
          {c.services.map((s, i) => (
            <li key={s.id} className="service-row">
              <a className="service-link" href={href(c, s.id)} aria-label={`${s.card.link}: ${s.name}`} />
              <div className="service-name">
                <span className="t-label text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{s.name}</h3>
              </div>
              <div className="service-text">
                <p className="service-title">{s.card.title}</p>
                <p className="text-ink-soft">{s.card.body}</p>
                <p className="t-caption text-ink-soft">{s.card.scope.join(' · ')}</p>
                <span className="link t-small service-more" aria-hidden="true">{s.card.link} ↗</span>
              </div>
              <ObjectLoop id={s.object} className="service-object" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
