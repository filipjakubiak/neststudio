'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { CAL_URL, EMAIL } from '@/content/site';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { DESKTOP, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { getSceneBus } from '@/scene/state';

/* Finał: gniazdo domknięte, kropla ląduje w środku, wszystko się zatrzymuje i trzyma (pin 150vh). */
export function Contact({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const bus = getSceneBus();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const title = el.querySelector<HTMLElement>('.contact-title')!;
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'none' });
      const rest = el.querySelectorAll('.contact-eyebrow, .contact-lead, .contact-actions > *');
      gsap.set(split.lines, { yPercent: 110 });
      gsap.set(rest, { opacity: 0, y: 16 });
      const desktop = window.matchMedia(DESKTOP).matches;
      const nestX = desktop ? 2.3 : 0;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=150%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(split.lines, { yPercent: 0, duration: 0.22, stagger: 0.06, ease: 'power3.out' }, 0)
        .to(rest, { opacity: 1, y: 0, duration: 0.18, stagger: 0.04, ease: 'power2.out' }, 0.16)
        .fromTo(bus.state, { dropVisible: 0, dropDetach: 1, dropX: nestX, dropY: 3.2, dropZ: 0.3, dropScale: 0.9, dropAmp: 0.3 }, { dropVisible: 1, dropY: desktop ? 0 : -1.3, dropAmp: 0.1, duration: 0.42, ease: 'power2.in', immediateRender: false }, 0.05)
        .to(bus.state, { dropAmp: 0.32, duration: 0.05, ease: 'power2.out' }, 0.47)
        .to(bus.state, { dropAmp: 0.1, duration: 0.18, ease: 'power2.inOut' }, 0.52)
        .fromTo(bus.state, { weave: 0.92, nestX, nestY: 0, speed: 0.03 }, { weave: 1, speed: 0.015, duration: 0.48, immediateRender: false }, 0.02)
        .to({}, { duration: 0.3 });
      return () => split.revert();
    });
    mm.add(MOTION_REDUCED, () => { bus.state.dropVisible = 1; });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="kontakt" className="contact" data-section="contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <Eyebrow className="contact-eyebrow">{c.contact.eyebrow}</Eyebrow>
        <h2 id="contact-title" className="t-display contact-title">{c.contact.title}</h2>
        <p className="t-lead measure text-ink-soft contact-lead">{c.contact.lead}</p>
        <div className="contact-actions">
          <Button href={`mailto:${EMAIL}`} magnetic>{c.contact.cta}</Button>
          <a className="link t-body contact-email" href={`mailto:${EMAIL}`} data-placeholder="true">{EMAIL}</a>
          {CAL_URL ? (
            <span className="t-body text-ink-soft">{c.contact.or} <a className="link" href={CAL_URL} target="_blank" rel="noreferrer">{c.contact.calendar}</a></span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
