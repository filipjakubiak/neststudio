'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { WeaveCover } from '@/components/ui/WeaveCover';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { DESKTOP, MOBILE, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';

/* Biały blok (jedyna zmiana motywu): arkusze w sticky stack, nici stają się tuszem na papierze. */
export function Projects({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '[data-reveal]' });

  useGSAP(() => {
    const el = root.current!;
    /* Z JS motyw przełącza cała strona (nici widoczne przez przezroczyste tło); bez JS sekcja sama jest jasna. */
    el.removeAttribute('data-theme');
    el.setAttribute('data-theme-js', 'true');
    const html = document.documentElement;
    const toggle = ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom 40%',
      onToggle: (self) => { if (self.isActive) html.setAttribute('data-theme', 'light'); else html.removeAttribute('data-theme'); },
    });

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const sheets = gsap.utils.toArray<HTMLElement>('.sheet', el);
      sheets.forEach((sheet) => {
        const paths = sheet.querySelectorAll('.sheet-cover path');
        gsap.set(paths, { drawSVG: '0%' });
        gsap.to(paths, { drawSVG: '100%', duration: 1.6, ease: 'power2.out', stagger: { each: 0.02, from: 'random' }, scrollTrigger: { trigger: sheet, start: 'top 70%', once: true } });
        gsap.from(sheet.querySelectorAll('.sheet-metric > *, .sheet-scope li'), { opacity: 0, y: 12, duration: 0.7, stagger: 0.05, scrollTrigger: { trigger: sheet, start: 'top 65%', once: true } });
      });
      return () => {};
    });
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      const sheets = gsap.utils.toArray<HTMLElement>('.sheet', el);
      sheets.forEach((sheet, i) => {
        if (i === sheets.length - 1) return;
        ScrollTrigger.create({ trigger: sheet, start: 'top top', endTrigger: sheets[sheets.length - 1], end: 'top top', pin: true, pinSpacing: false });
        gsap.to(sheet.querySelector('.sheet-inner'), {
          scale: 0.94, opacity: 0.35, ease: 'none',
          scrollTrigger: { trigger: sheets[i + 1], start: 'top bottom', end: 'top top', scrub: true },
        });
      });
    });
    mm.add(`${MOTION_OK} and ${MOBILE}`, () => {});
    mm.add(MOTION_REDUCED, () => {});
    return () => { mm.revert(); toggle.kill(); html.removeAttribute('data-theme'); };
  }, { scope: root });

  return (
    <section ref={root} id="projekty" className="projects" data-section="projects" data-theme="light" aria-labelledby="projects-title">
      <div className="wrap projects-head">
        <h2 id="projects-title" className="t-h1" data-reveal>{c.projects.title}</h2>
        <p className="t-lead text-ink-soft measure" data-reveal>{c.projects.lead}</p>
      </div>
      <div className="projects-stack">
        {c.projects.items.map((p, i) => (
          <article className="sheet" key={p.slug} data-index={i} aria-labelledby={`project-${p.slug}`}>
            <div className="wrap sheet-inner grid-12">
              <div className="sheet-cover">
                <WeaveCover seed={p.seed} />
              </div>
              <div className="sheet-body">
                <h3 id={`project-${p.slug}`} className="t-h2" data-placeholder={p.placeholder || undefined}>{p.name}</h3>
                <p className="t-body text-ink-soft sheet-summary" data-placeholder={p.placeholder || undefined}>{p.summary}</p>
                <ul className="sheet-scope" aria-label="Zakres">
                  {p.scope.map((s) => (<li className="chip" key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="sheet-metric" data-placeholder={p.placeholder || undefined}>
                <span className="t-mono sheet-metric-value">{p.metric}</span>
                <span className="t-caption text-ink-soft">{p.metricLabel}</span>
                <span className="t-mono t-label text-ink-soft sheet-year">{p.year}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap projects-foot">
        <a className="link t-lead" href="#kontakt">{c.projects.askLink}</a>
      </div>
    </section>
  );
}
