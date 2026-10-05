'use client';

import { useRef } from 'react';
import { CalendarBlank, Hourglass, Intersect, SquaresFour } from '@phosphor-icons/react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';
import { Odometer } from '@/components/ui/Odometer';
import { SectionHead } from './SectionHead';
import { Chain, Ring, Timeline, Wall } from './stats/Viz';

const ICONS = { since: CalendarBlank, years: Hourglass, areas: Intersect, projects: SquaresFour } as const;

/*
 * Stats bento (Filip, 30.09; layout after the dribbble reference): wide + narrow, narrow + wide.
 * Every tile: icon, rolling number, title, text, and a small visualisation of the same fact.
 */
export function Stats({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const s = c.home.stats;
  useReveal(root);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const st = (el: Element) => ({ trigger: el, start: 'top 85%', once: true });
      // timeline: the red line draws from 2014 to today, the year ticks light as it passes
      gsap.from(q('.tl-progress'), { scaleX: 0, transformOrigin: '0 50%', duration: 2.4, ease: 'power2.inOut', scrollTrigger: st(q('.viz-timeline')[0]) });
      gsap.from(q('.tl-tick'), { opacity: 0.15, duration: 0.4, stagger: 0.17, ease: 'none', scrollTrigger: st(q('.viz-timeline')[0]) });
      // ring: twelve years light one by one
      gsap.from(q('.ring-seg'), { opacity: 0.06, duration: 0.5, stagger: 0.1, ease: 'power1.out', scrollTrigger: st(q('.viz-ring')[0]) });
      // chain: the five areas join up left to right
      gsap.from(q('.chain-node'), { opacity: 0, y: 10, duration: 0.8, stagger: 0.12, ease: 'expo.out', scrollTrigger: st(q('.viz-chain')[0]) });
      // wall: cells fade in as a diagonal wave
      gsap.from(q('.wall-cell'), { opacity: 0, duration: 0.5, stagger: { each: 0.008, from: 'start' }, scrollTrigger: st(q('.viz-wall')[0]) });
    });
  }, { scope: root });

  const viz = (id: (typeof s.items)[number]['id'], value: string) => {
    if (id === 'since') return <Timeline from={Number(s.timeline.from)} to={Number(s.timeline.to)} now={s.timeline.now} />;
    if (id === 'years') return <Ring count={Number(value)} value={value} unit={s.items[1].label} />;
    if (id === 'areas') return <Chain items={s.chain} />;
    const n = Number(value);
    return <Wall total={75} lit={Number.isFinite(n) ? n : 0} />;
  };

  return (
    <section id="liczby" ref={root} className="stats-section">
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} />
        <div className="stats-bento">
          {s.items.map((it) => {
            const Icon = ICONS[it.id];
            return (
              <article key={it.id} className={`stat-tile stat-${it.id}`} data-placeholder={it.placeholder || undefined}>
                <div className="stat-top">
                  <span className="stat-icon" aria-hidden="true"><Icon size={18} weight="regular" /></span>
                  {it.id !== 'years' && (
                    <p className="stat-figure">
                      <Odometer value={it.value} className="stat-value" />
                      <span className="t-caption text-ink-soft">{it.label}</span>
                    </p>
                  )}
                </div>
                <div className="stat-text">
                  <h3 className="t-h3">{it.title}</h3>
                  <p className="text-ink-soft">{it.body}</p>
                </div>
                <div className="stat-viz">{viz(it.id, it.value)}</div>
              </article>
            );
          })}
        </div>
        <p className="t-caption t-mono text-ink-soft stats-note">{s.note}</p>
      </div>
    </section>
  );
}
