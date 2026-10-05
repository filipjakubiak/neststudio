'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Content, PageId } from '@/content/types';
import { alternates, href } from '@/lib/links';
import { EMAIL } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { LangSwitch } from './LangSwitch';
import { MotionToggle } from './MotionToggle';

/*
 * 3.1 Navigation: logo, Work / Services / Studio, the main action. A translucent material bar with the content
 * scrolling under it (apple-design §12); a soft edge appears only once content actually runs under it.
 * Below 900 px the links move into a sheet that drops from the bar and returns the same way (§7).
 */
export function Nav({ content, page }: { content: Content; page: PageId }) {
  const alt = alternates(page);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheetId = useId();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = sheet.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); }
      if (e.key === 'Tab' && sheet.current) {
        // keep focus inside the bar + sheet while the sheet is open
        const items = [menuBtn.current!, ...sheet.current.querySelectorAll<HTMLElement>('a, button')];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 900) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.documentElement.dataset.menu = 'open';
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); delete document.documentElement.dataset.menu; };
  }, [open]);

  const links = content.nav.links.map((l) => ({ ...l, url: href(content, l.page, l.hash), current: l.page === page && !l.hash }));

  return (
    <header className="nav" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className="nav-bar wrap-wide">
        <Wordmark href={content.paths.home} />
        <nav className="nav-links" aria-label={content.system.navLabel}>
          {links.map((l) => <a key={l.label} href={l.url} aria-current={l.current ? 'page' : undefined}>{l.label}</a>)}
        </nav>
        <div className="nav-right">
          <MotionToggle pause={content.system.motionPause} play={content.system.motionPlay} />
          <span className="nav-lang"><LangSwitch lang={content.lang} label={content.system.langLabel} alt={alt} /></span>
          <Button href={href(content, 'contact')} size="sm" className="nav-cta">{content.nav.cta}</Button>
          <button
            ref={menuBtn}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls={sheetId}
            aria-label={open ? content.system.close : content.system.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div ref={sheet} id={sheetId} className="nav-sheet" hidden={!open} aria-label={content.system.menu}>
        <ul className="wrap sheet-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.url} aria-current={l.current ? 'page' : undefined} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="wrap sheet-foot">
          <Button href={href(content, 'contact')}>{content.nav.cta}</Button>
          <a className="link t-small" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <LangSwitch lang={content.lang} label={content.system.langLabel} alt={alt} />
        </div>
      </div>
    </header>
  );
}
