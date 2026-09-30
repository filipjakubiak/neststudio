'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { useReveal } from '@/components/motion/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* Testimonials + team. Both hold placeholders until Filip sends real quotes and photos
   (docs/placeholders.md); placeholders are marked, never passed off as real. */
export function Testimonials({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '.quote-text' });
  return (
    <section id="opinie" ref={root} className="testimonials">
      <div className="wrap">
        <Eyebrow>{c.testimonials.eyebrow}</Eyebrow>
        {c.testimonials.items.map((t) => (
          <figure key={t.name} className="quote" data-placeholder={t.placeholder || undefined}>
            <blockquote className="t-h2 quote-text">{t.quote}</blockquote>
            <figcaption className="quote-by">
              <span>{t.name}</span>
              <span className="t-caption t-mono text-ink-soft">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Team({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id="zespol" ref={root} className="team">
      <div className="wrap">
        <div className="head">
          <Eyebrow>{c.team.eyebrow}</Eyebrow>
          <h2 className="t-h2 head-title" data-reveal>{c.team.title.join(' ')}</h2>
          <p className="t-lead text-ink-soft head-lead measure">{c.team.lead}</p>
        </div>
        <ul className="people">
          {c.team.people.map((p) => (
            <li key={p.name + p.role} className="person" data-placeholder={p.placeholder || undefined}>
              <div className="portrait" aria-hidden="true">
                <span>{p.name.startsWith('[') ? '?' : p.name.split(' ').map((w) => w[0]).join('')}</span>
                <em className="t-label">{c.system.placeholder}</em>
              </div>
              <h3 className="t-h3">{p.name}</h3>
              <p className="t-caption t-mono text-ink-soft">{p.role}</p>
              <p className="text-ink-soft t-small">{p.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
