import type { Content } from '@/content/types';
import { EMAIL, LEGAL_NAME, PHONE, SOCIAL } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';

/* Footer (3.10): tagline, explore / services / contact / profiles, legal line. */
export function Footer({ c }: { c: Content }) {
  const year = 2026;
  return (
    <footer id="stopka" className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark href={c.lang === 'pl' ? '/' : '/en/'} />
            <p className="t-lead">{c.footer.tagline[0]}<br /><span className="text-ink-soft">{c.footer.tagline[1]}</span></p>
          </div>
          {c.footer.cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="footer-col">
              <p className="t-label text-ink-soft">{col.title}</p>
              <ul>{col.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
          <div className="footer-col">
            <p className="t-label text-ink-soft">{c.footer.contactTitle}</p>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
            </ul>
            <p className="t-label text-ink-soft footer-sub">{c.footer.socialTitle}</p>
            <ul className="footer-social">{SOCIAL.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}</ul>
          </div>
        </div>
        <p className="footer-word" aria-hidden="true">Nest Studio</p>
        <div className="footer-bottom t-caption text-ink-soft">
          <span>© {year} Nest Studio · {LEGAL_NAME}</span>
          <span>{c.footer.legal}</span>
          <a href="#" className="link">{c.footer.privacy}</a>
          <a href="#hero" className="link">{c.footer.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}
