import type { Content } from '@/content/types';
import { EMAIL, LEGAL_NAME, PHONE, SOCIAL } from '@/content/site';
import { href } from '@/lib/links';
import { Wordmark } from '@/components/ui/Wordmark';

/* 3.10 Footer: short description, Explore / Services / Contact / Profiles, bottom bar. */
export function Footer({ c }: { c: Content }) {
  const f = c.footer;
  return (
    <footer id="stopka" className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark href={c.paths.home} />
            <p className="t-lead">{f.tagline[0]}<br /><span className="text-ink-soft">{f.tagline[1]}</span></p>
          </div>
          {f.cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="footer-col">
              <p className="t-label text-ink-soft">{col.title}</p>
              <ul>{col.links.map((l) => <li key={l.label}><a href={href(c, l.page, l.hash)}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
          <div className="footer-col">
            <p className="t-label text-ink-soft">{f.contactTitle}</p>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
              <li className="text-ink-soft" data-placeholder>{f.location}</li>
            </ul>
            <p className="t-label text-ink-soft footer-sub">{f.socialTitle}</p>
            <ul>{SOCIAL.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}</ul>
          </div>
        </div>
        <p className="footer-word" aria-hidden="true">Nest Studio</p>
        <div className="footer-bottom t-caption text-ink-soft">
          <span>© 2026 Nest Studio</span>
          <span>{LEGAL_NAME} <span data-placeholder>{f.legal}</span></span>
          <span><a href="#" className="link">{f.privacy}</a> · <a href="#" className="link">{f.cookies}</a></span>
        </div>
      </div>
    </footer>
  );
}
