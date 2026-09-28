'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { DESKTOP, MOBILE, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';

/* Jedna nić rysuje się wzdłuż scrolla przez pięć stacji (pin 250vh na desktopie). */
export function Process({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '[data-reveal]' });

  useGSAP(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    const steps = gsap.utils.toArray<HTMLElement>('.step', el);
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      const path = el.querySelector('.process-path')!;
      gsap.set(path, { drawSVG: '0%' });
      gsap.set(steps.map((s) => s.querySelector('.step-title')), { color: 'var(--ink-soft)' });
      gsap.set(steps.map((s) => s.querySelector('.step-dot')), { scale: 0.3, transformOrigin: 'center' });
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: '+=250%', pin: true, scrub: 0.9, invalidateOnRefresh: true } });
      tl.to(path, { drawSVG: '100%', duration: 1 }, 0);
      steps.forEach((step, i) => {
        const at = 0.08 + i * 0.2;
        tl.to(step.querySelector('.step-title'), { color: 'var(--ink)', duration: 0.08, ease: 'power2.out' }, at)
          .to(step.querySelector('.step-dot'), { scale: 1, duration: 0.08, ease: 'back.out(2)' }, at)
          .fromTo(step.querySelectorAll('.step-title, .step-body'), { y: 18 }, { y: 0, duration: 0.1, ease: 'power2.out', stagger: 0.02 }, at);
      });
      tl.to({}, { duration: 0.04 });
    });
    mm.add(`${MOTION_OK} and ${MOBILE}`, () => {
      steps.forEach((step) => {
        gsap.from(step, { opacity: 0, y: 24, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 80%', once: true } });
      });
    });
    mm.add(MOTION_REDUCED, () => {});
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="proces" className="process" data-section="process" aria-labelledby="process-title">
      <div className="wrap process-inner">
        <h2 id="process-title" className="t-h1 process-title" data-reveal>{c.process.title}</h2>
        <div className="process-track">
          <svg className="process-thread" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor">
            <path className="process-path-ghost" d="M20 200C160 40 240 360 400 200S620 40 760 200 900 360 980 200" strokeWidth="0.8" opacity="0.18" />
            <path className="process-path" d="M20 200C160 40 240 360 400 200S620 40 760 200 900 360 980 200" strokeWidth="1.1" />
          </svg>
          <ol className="process-steps">
            {c.process.steps.map((s, i) => (
              <li className="step" key={s.title} data-step={i}>
                <span className="step-dot" aria-hidden="true" />
                <h3 className="t-h3 step-title">{s.title}</h3>
                <p className="t-small text-ink-soft step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
