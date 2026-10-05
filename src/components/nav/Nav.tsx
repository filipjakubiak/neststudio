'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import type { Content, PageId } from '@/content/types';
import { alternates, href } from '@/lib/links';
import { EMAIL } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { LangSwitch } from './LangSwitch';
import { MotionToggle } from './MotionToggle';

/* Desktop: links inline. Below 1024 px: the overlay menu (clip-path circle, focus to first link, Escape). */
export function Nav({ content, page }: { content: Content; page: PageId }) {
  const alt = alternates(page);
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
      gsap.timeline()
        .fromTo(el, { clipPath: 'circle(0% at calc(100% - 56px) 32px)' }, { clipPath: 'circle(160% at calc(100% - 56px) 32px)', duration: reduced ? 0 : 0.9, ease: 'expo.inOut' })
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
          <Wordmark href={content.paths.home} />
          <nav className="nav-links" aria-label={content.system.navLabel}>
            {content.nav.links.map((l) => <a key={l.label} href={href(content, l.page, l.hash)} aria-current={l.page === page && !l.hash ? 'page' : undefined}>{l.label}</a>)}
          </nav>
          <div className="nav-right">
            <MotionToggle pause={content.system.motionPause} play={content.system.motionPlay} />
            <span className="nav-lang"><LangSwitch lang={content.lang} label={content.system.langLabel} alt={alt} /></span>
            <Button href={href(content, 'contact')} className="nav-cta" magnetic>{content.nav.cta}</Button>
            <button
              ref={menuBtn}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls={overlayId}
              aria-label={open ? content.system.close : content.system.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div ref={overlay} id={overlayId} className="overlay" data-open="false" aria-hidden={!open} role="dialog" aria-modal="true" aria-label={content.system.menu}>
        <div />
        <nav className="wrap" aria-label={content.system.menu}>
          <ul className="overlay-links">
            {content.nav.links.map((l, i) => (
              <li key={l.label} className="overlay-link-mask">
                <a href={href(content, l.page, l.hash)} ref={i === 0 ? firstLink : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap overlay-foot t-small text-ink-soft">
          <Button href={href(content, 'contact')}>{content.nav.cta}</Button>
          <a className="link" href={`mailto:${EMAIL}`} tabIndex={open ? 0 : -1}>{EMAIL}</a>
          <LangSwitch lang={content.lang} label={content.system.langLabel} alt={alt} />
        </div>
      </div>
    </>
  );
}
