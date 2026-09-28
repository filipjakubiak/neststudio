'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ServiceGlyph } from './services/ServiceGlyph';
import { gsap, useGSAP } from '@/lib/gsap';
import { DESKTOP, MOBILE, MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { useReveal } from '@/components/motion/useReveal';

type Id = 'strategy' | 'brand' | 'web' | 'ai';

/* Mikro-animacja każdej nici: strategia szuka kierunku, znak składa się z nici, siatka układa layout, węzły łączą się i płynie pakiet. */
function playGlyph(band: HTMLElement, id: Id, reduced: boolean): gsap.core.Timeline {
  const g = band.querySelector('.glyph')!;
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  if (reduced) return tl;
  switch (id) {
    case 'strategy': {
      const path = g.querySelector('.g-path'), arrow = g.querySelector('.g-arrow');
      tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut' })
        .fromTo(arrow, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35 }, '-=0.15');
      break;
    }
    case 'brand': {
      const t1 = g.querySelector('.g-t1'), t2 = g.querySelector('.g-t2'), t3 = g.querySelector('.g-t3');
      tl.fromTo([t1, t3, t2], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.22, ease: 'power2.inOut' });
      break;
    }
    case 'web': {
      const cells = g.querySelectorAll('.g-cell');
      tl.fromTo(cells, { x: () => gsap.utils.random(-40, 40), y: () => gsap.utils.random(-40, 40), rotation: () => gsap.utils.random(-30, 30), opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.8, stagger: { each: 0.04, from: 'random' }, ease: 'expo.out' });
      break;
    }
    case 'ai': {
      const nodes = g.querySelectorAll('.g-node'), edges = g.querySelector('.g-edge'), packet = g.querySelector('.g-packet');
      tl.fromTo(nodes, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' })
        .fromTo(edges, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
        .fromTo(packet, { attr: { cx: 24, cy: 60 } }, { attr: { cx: 60, cy: 32 }, duration: 0.45, ease: 'power1.inOut' })
        .to(packet, { attr: { cx: 98, cy: 60 }, duration: 0.45, ease: 'power1.inOut' })
        .to(packet, { attr: { cx: 60, cy: 88 }, duration: 0.45, ease: 'power1.inOut' })
        .to(packet, { attr: { cx: 24, cy: 60 }, duration: 0.45, ease: 'power1.inOut' });
      break;
    }
  }
  return tl;
}

export function Services({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { selector: '[data-reveal]' });

  useGSAP(() => {
    const el = root.current!;
    const bands = gsap.utils.toArray<HTMLElement>('.band', el);
    const heads = bands.map((b) => b.querySelector<HTMLButtonElement>('.band-head')!);
    let current = 0;
    let reduced = false;
    let desktop = false;
    const glyphTl = new Map<number, gsap.core.Timeline>();

    const open = (i: number) => {
      current = i;
      bands.forEach((b, j) => {
        const isOpen = j === i;
        b.setAttribute('data-open', String(isOpen));
        heads[j].setAttribute('aria-expanded', String(isOpen));
        const panel = b.querySelector<HTMLElement>('.band-panel')!;
        if (desktop) {
          gsap.to(b, { flexGrow: isOpen ? 2.4 : 1, duration: reduced ? 0 : 0.7, ease: 'expo.out', overwrite: 'auto' });
          gsap.to(panel, { opacity: isOpen ? 1 : 0, duration: reduced ? 0 : 0.4, delay: isOpen && !reduced ? 0.2 : 0, overwrite: 'auto' });
        } else {
          gsap.to(panel, { height: isOpen ? 'auto' : 0, duration: reduced ? 0 : 0.5, ease: 'expo.out', overwrite: 'auto' });
        }
        if (isOpen) {
          glyphTl.get(j)?.kill();
          glyphTl.set(j, playGlyph(b, b.dataset.service as Id, reduced));
        }
      });
    };

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => { desktop = true; bands.forEach((b) => gsap.set(b, { flexGrow: b.dataset.open === 'true' ? 2.4 : 1 })); open(current); return () => { desktop = false; bands.forEach((b) => gsap.set(b, { clearProps: 'flex-grow' })); }; });
    mm.add(MOBILE, () => { desktop = false; bands.forEach((b, j) => gsap.set(b.querySelector('.band-panel'), { height: j === current ? 'auto' : 0 })); return () => bands.forEach((b) => gsap.set(b.querySelector('.band-panel'), { clearProps: 'height,opacity' })); });
    mm.add(MOTION_OK, () => { reduced = false; });
    mm.add(MOTION_REDUCED, () => { reduced = true; });

    const listeners: (() => void)[] = [];
    heads.forEach((h, i) => {
      const onEnter = () => { if (desktop && i !== current) open(i); };
      const onClick = () => open(i === current && !desktop ? -1 : i);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); heads[(i + 1) % heads.length].focus(); open((i + 1) % heads.length); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); heads[(i - 1 + heads.length) % heads.length].focus(); open((i - 1 + heads.length) % heads.length); }
      };
      h.addEventListener('pointerenter', onEnter);
      h.addEventListener('focus', onEnter);
      h.addEventListener('click', onClick);
      h.addEventListener('keydown', onKey);
      listeners.push(() => { h.removeEventListener('pointerenter', onEnter); h.removeEventListener('focus', onEnter); h.removeEventListener('click', onClick); h.removeEventListener('keydown', onKey); });
    });
    return () => { listeners.forEach((f) => f()); mm.revert(); };
  }, { scope: root });

  return (
    <section ref={root} id="uslugi" className="services section" data-section="services" aria-labelledby="services-title">
      <div className="wrap">
        <Eyebrow>{c.services.eyebrow}</Eyebrow>
        <h2 id="services-title" className="t-h1 services-title" data-reveal>{c.services.title}</h2>
      </div>
      <div className="wrap">
        <ul className="services-bands" role="list">
          {c.services.items.map((s, i) => (
            <li className="band" key={s.id} data-service={s.id} data-open={i === 0 ? 'true' : 'false'}>
              <button type="button" className="band-head" aria-expanded={i === 0} aria-controls={`band-${s.id}`}>
                <span className="band-glyph" aria-hidden="true"><ServiceGlyph id={s.id} /></span>
                <span className="t-h3 band-title">{s.title}</span>
              </button>
              <div id={`band-${s.id}`} className="band-panel">
                <p className="t-body text-ink-soft band-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-caption text-ink-soft services-note">{c.services.note}</p>
      </div>
    </section>
  );
}
