'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, SplitText } from '@/lib/gsap';
import { introIn, useScene } from '@/components/motion/useScene';
import { SectionIntro } from './SectionIntro';

/*
 * 3.4 One direction: "What you see. And what happens next." The story reads itself in as you scroll: the
 * words light up from grey to white under your hand (scrubbed, so scrolling back dims them again).
 * Then the thread, the site's one motif: a magenta line runs across the three tiles 01 → 02 → 03, the way
 * a client moves from the brand to the website to the work behind it.
 */
export function Direction({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const d = c.home.direction;

  useScene(root, (q) => {
    introIn(q('.intro')[0]);
    const story = q('.direction-story')[0] as HTMLElement;
    const split = SplitText.create(story.querySelectorAll('p'), { type: 'words', aria: 'auto' });
    const css = getComputedStyle(document.documentElement);
    gsap.fromTo(split.words, { color: css.getPropertyValue('--ink-3').trim() }, {
      color: css.getPropertyValue('--ink').trim(), stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: story, start: 'top 75%', end: 'bottom 45%', scrub: true },
    });
    const items = q('.direction-item');
    gsap.timeline({ scrollTrigger: { trigger: q('.direction-items')[0], start: 'top 80%', once: true } })
      .from(items, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }, 0)
      .from(q('.thread'), { scaleX: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.28 }, 0.25);
    return () => split.revert();
  });

  return (
    <section id="kierunek" ref={root} className="section direction" aria-labelledby="kierunek-t">
      <div className="wrap direction-grid">
        <SectionIntro id="kierunek-t" eyebrow={d.eyebrow} title={d.title} align="start" className="direction-intro" />
        <div className="direction-story t-lead">
          {d.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <ol className="wrap direction-items">
        {d.items.map((it) => (
          <li key={it.n} className="tile direction-item">
            <span className="thread" aria-hidden="true" />
            <span className="direction-n t-num">{it.n}</span>
            <h3 className="t-h3">{it.title}</h3>
            <p className="soft">{it.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
