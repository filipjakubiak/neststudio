'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { EMAIL } from '@/content/site';
import { gsap } from '@/lib/gsap';
import { href } from '@/lib/links';
import { useScene } from '@/components/motion/useScene';
import { Button } from '@/components/ui/Button';
import { ObjectLoop } from '@/components/objects/ObjectLoop';

/*
 * 3.9 Closing CTA: the question, one action, the email as the alternative. The nest glows behind it.
 * As you arrive the question comes forward out of the dark (scrubbed: it settles exactly when you stop).
 */
export function Cta({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const k = c.home.cta;

  useScene(root, (q, el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', end: 'center 60%', scrub: 0.5 } })
      .fromTo(q('.cta-title'), { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
      .fromTo(q('.cta-object'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0);
    gsap.from(q('.cta-in'), { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 55%', once: true } });
  });

  return (
    <section id="kontakt" ref={root} className="section cta" aria-labelledby="cta-t">
      <div className="cta-stage" aria-hidden="true">
        <ObjectLoop id="gniazdo" className="cta-object" />
      </div>
      <div className="wrap cta-copy center">
        <h2 id="cta-t" className="t-h1 cta-title">{k.title.map((l, i) => <span key={i} className="intro-line">{l}</span>)}</h2>
        <p className="t-lead soft cta-body cta-in">{k.body}</p>
        <div className="cta-in"><Button href={href(c, 'contact')}>{k.button}</Button></div>
        <p className="t-small soft cta-in">{k.mailPrefix} <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
      </div>
    </section>
  );
}
