import type { Content } from '@/content/types';
import { EMAIL, LEGAL_NAME, PHONE, SOCIAL } from '@/content/site';
import { href } from '@/lib/links';
import { Wordmark } from '@/components/ui/Wordmark';

/*
 * 3.10 Footer: the short description, Explore / Services / Contact / Profiles, the bottom bar.
 * Fine print, Apple-style: small, quiet, every link a real target. Profiles show only active ones (the
 * document's rule), so the column stays out until there is a real profile.
 */
export function Footer({ c }: { c: Content }) {
  const f = c.footer;
  const social = SOCIAL.filter((s) => !s.placeholder);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark href={c.paths.home} />
            <p className="t-h4">{f.tagline[0]}<br /><span className="soft">{f.tagline[1]}</span></p>
          </div>
          {f.cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="footer-col">
              <p className="footer-h">{col.title}</p>
              <ul>{col.links.map((l) => <li key={l.label}><a href={href(c, l.page, l.hash)}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
          <div className="footer-col">
            <p className="footer-h">{f.contactTitle}</p>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
              <li className="ph">{f.location}</li>
            </ul>
            {social.length > 0 && (
              <>
                <p className="footer-h footer-sub">{f.socialTitle}</p>
                <ul>{social.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}</ul>
              </>
            )}
          </div>
        </div>
        <div className="footer-bottom t-caption soft">
          <span>© 2026 Nest Studio</span>
          <span>{LEGAL_NAME} <span className="ph">{f.legal}</span></span>
          <span className="footer-legal"><a href="#" className="link">{f.privacy}</a> · <a href="#" className="link">{f.cookies}</a></span>
        </div>
      </div>
    </footer>
  );
}
