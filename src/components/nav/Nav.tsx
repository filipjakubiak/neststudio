'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import type { Content } from '@/content/types';
import { BASE_PATH, EMAIL } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { LangSwitch } from './LangSwitch';

export function Nav({ content }: { content: Content }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayId = useId();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(() => {
    const el = overlay.current!;
    const links = el.querySelectorAll('.overlay-links a');
    const foot = el.querySelectorAll('.overlay-foot > *');
    const reduced = prefersReducedMotion();
    if (!mounted.current) { mounted.current = true; gsap.set(el, { clipPath: 'circle(0% at calc(100% - 56px) 32px)' }); return; }
    if (open) {
      el.setAttribute('data-open', 'true');
      const tl = gsap.timeline();
      tl.fromTo(el, { clipPath: 'circle(0% at calc(100% - 56px) 32px)' }, { clipPath: 'circle(160% at calc(100% - 56px) 32px)', duration: reduced ? 0 : 0.9, ease: 'expo.inOut' })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0 : 0.9, stagger: 0.06, ease: 'expo.out' }, reduced ? 0 : 0.35)
        .fromTo(foot, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: reduced ? 0 : 0.6, stagger: 0.05 }, reduced ? 0 : 0.6);
    } else {
      gsap.timeline({ onComplete: () => el.setAttribute('data-open', 'false') })
        .to(links, { yPercent: -110, duration: reduced ? 0 : 0.4, stagger: 0.03, ease: 'power2.in' }, 0)
        .to(el, { clipPath: 'circle(0% at calc(100% - 56px) 32px)', duration: reduced ? 0 : 0.6, ease: 'expo.inOut' }, reduced ? 0 : 0.15);
    }
  }, { dependencies: [open] });

  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    io.observe(sentinel);
    return () => { io.disconnect(); sentinel.remove(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.setAttribute('data-menu', 'open');
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.removeAttribute('data-menu'); };
  }, [open]);

  return (
    <>
      <header className="nav" data-scrolled={scrolled ? 'true' : 'false'}>
        <div className="wrap nav-inner">
          <Wordmark href={`${BASE_PATH}${content.lang === 'pl' ? '/' : '/en/'}`} />
          <div className="nav-right">
            <LangSwitch lang={content.lang} label={content.nav.langLabel} />
            <Button href="#kontakt" className="nav-cta" magnetic>{content.nav.cta}</Button>
            <button
              ref={menuBtn}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls={overlayId}
              aria-label={open ? content.nav.closeMenu : content.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div ref={overlay} id={overlayId} className="overlay" data-open="false" aria-hidden={!open} role="dialog" aria-modal="true" aria-label={content.nav.menu}>
        <div />
        <nav className="wrap" aria-label={content.nav.menu}>
          <ul className="overlay-links">
            {content.nav.links.map((l, i) => (
              <li key={l.href} className="overlay-link-mask">
                <a href={l.href} ref={i === 0 ? firstLink : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap overlay-foot t-small text-ink-soft">
          <a className="link" href={`mailto:${EMAIL}`} tabIndex={open ? 0 : -1} data-placeholder="true">{EMAIL}</a>
          <span>{content.nav.remote}</span>
        </div>
      </div>
    </>
  );
}
