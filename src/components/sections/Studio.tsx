'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { yearsInField } from '@/content/site';
import { WeaveCover } from '@/components/ui/WeaveCover';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';

/* Trzy warstwy w paralaksie: portret, rama z chromu, tekst. Lata liczone, nie wpisane (D10). */
export function Studio({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const years = yearsInField();
  useReveal(root, { selector: '[data-reveal]' });

  useGSAP(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const img = el.querySelector('.studio-img')!;
      const frame = el.querySelector('.studio-frame')!;
      const body = el.querySelector('.studio-body')!;
      gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 70%', once: true } });
      const scrub = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo(img, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: scrub });
      gsap.fromTo(frame, { y: 48 }, { y: -40, ease: 'none', scrollTrigger: scrub });
      gsap.fromTo(body, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: scrub });
      const val = el.querySelector<HTMLElement>('.studio-years-value')!;
      const tpl = val.dataset.template ?? '';
      const counter = { v: 0 };
      gsap.to(counter, { v: years, duration: 1.6, ease: 'expo.out', snap: { v: 1 }, scrollTrigger: { trigger: val, start: 'top 85%', once: true }, onUpdate: () => { val.textContent = tpl.replace('{years}', String(Math.round(counter.v))); } });
    });
    mm.add(MOTION_REDUCED, () => {});
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="studio" className="studio section" data-section="studio" aria-labelledby="studio-title">
      <div className="wrap grid-12 studio-grid">
        <figure className="studio-photo" data-placeholder="true">
          <div className="studio-frame" aria-hidden="true" />
          <div className="studio-img" role="img" aria-label={c.studio.photoAlt}>
            <WeaveCover seed={2014} />
            <span className="placeholder-mark studio-photo-label">{c.studio.photoPlaceholder}</span>
          </div>
        </figure>
        <div className="studio-body">
          <h2 id="studio-title" className="t-h2" data-reveal>{c.studio.title}</h2>
          <p className="t-lead studio-p" data-reveal>{c.studio.p1}</p>
          <p className="t-body text-ink-soft studio-p" data-reveal>{c.studio.p2}</p>
          <p className="t-mono t-label text-ink-soft studio-years">
            <span className="studio-years-value t-mono" data-years={years} data-template={c.studio.years}>{c.studio.years.replace('{years}', String(years))}</span>
            <span className="studio-years-since">{c.studio.since}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
