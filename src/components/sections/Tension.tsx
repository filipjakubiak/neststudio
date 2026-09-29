'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { getSceneBus } from '@/scene/state';
import { useReveal } from '@/components/motion/useReveal';

/* Split stage: "jak wyglądasz" (znaki rozsypane) kontra "ile jesteś wart" (stałe); scroll domyka lukę. Pin 200vh. */
export function Tension({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '[data-reveal]', start: 'top 75%' });

  useGSAP(() => {
    const el = root.current!;
    const bus = getSceneBus();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const scatter = el.querySelector<HTMLElement>('.tension-word-scatter')!;
      const split = SplitText.create(scatter, { type: 'chars', aria: 'none' });
      const chars = split.chars;
      gsap.set(chars, {
        x: () => gsap.utils.random(-70, 70), y: () => gsap.utils.random(-46, 46),
        rotation: () => gsap.utils.random(-16, 16), opacity: 0.22, display: 'inline-block',
      });
      const closing = el.querySelectorAll<HTMLElement>('.tension-closing-line');
      const closingSplit = SplitText.create(closing, { type: 'lines', mask: 'lines', aria: 'none' });
      const you = el.querySelector('.tension-you');
      const body = el.querySelector('.tension-body');
      const labels = el.querySelectorAll('.tension-col .t-label');
      gsap.set([you, body], { opacity: 0, y: 24 });
      gsap.set(labels, { opacity: 0 });
      gsap.set(closingSplit.lines, { yPercent: 110 });


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el, start: 'top top', end: '+=200%', pin: true, scrub: 0.9, invalidateOnRefresh: true,
        },
      });
      tl.to(chars, { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'weave', duration: 0.55, stagger: { each: 0.018, from: 'random' } }, 0)
        .to(labels, { opacity: 1, duration: 0.15 }, 0.1)
        .fromTo(bus.state, { weave: 0 }, { weave: 0.22, duration: 0.98, ease: 'none', immediateRender: false }, 0.02)
        .to(you, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.5)
        .to(body, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.58)
        .to(closingSplit.lines, { yPercent: 0, duration: 0.22, stagger: 0.07, ease: 'power3.out' }, 0.72)
        .to({}, { duration: 0.06 });

      return () => { split.revert(); closingSplit.revert(); };
    });
    mm.add(MOTION_REDUCED, () => {});
    return () => { mm.revert(); ScrollTrigger.refresh(); };
  }, { scope: root });

  return (
    <section ref={root} className="tension" data-section="tension" aria-labelledby="tension-title">
      <div className="wrap tension-stage">
        <h2 id="tension-title" className="t-h2 tension-title" data-reveal>{c.tension.title}</h2>
        <div className="tension-split" aria-hidden="true">
          <div className="tension-col tension-col-left">
            <span className="t-label text-ink-soft">{c.tension.leftLabel}</span>
            <span className="tension-word tension-word-scatter">{c.tension.leftWord}</span>
          </div>
          <div className="tension-divider" />
          <div className="tension-col tension-col-right">
            <span className="t-label text-ink-soft">{c.tension.rightLabel}</span>
            <span className="tension-word">{c.tension.rightWord}</span>
          </div>
        </div>
        <p className="sr-only">{c.tension.leftLabel}: {c.tension.leftWord}. {c.tension.rightLabel}: {c.tension.rightWord}.</p>
        <div className="tension-foot">
          <div className="tension-copy">
            <p className="t-h3 tension-you">{c.tension.you}</p>
            <p className="t-small measure text-ink-soft tension-body">{c.tension.body}</p>
          </div>
          <p className="t-h3 tension-closing">
            {c.tension.closing.map((l) => (<span className="tension-closing-line" key={l}>{l}</span>))}
          </p>
        </div>
      </div>
    </section>
  );
}
