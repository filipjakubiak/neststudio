'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Content } from '@/content/types';
import { EMAIL } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { LangSwitch } from './LangSwitch';

export function Nav({ content }: { content: Content }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayId = useId();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

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
          <Wordmark href={content.lang === 'pl' ? '/' : '/en/'} />
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
      <div id={overlayId} className="overlay" data-open={open ? 'true' : 'false'} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={content.nav.menu}>
        <div />
        <nav className="wrap" aria-label={content.nav.menu}>
          <ul className="overlay-links">
            {content.nav.links.map((l, i) => (
              <li key={l.href}>
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
