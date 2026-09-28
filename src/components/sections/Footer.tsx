import type { Content } from '@/content/types';
import { ASK_AI, EMAIL, LEGAL_NAME, NIP, PHONE, SOCIAL } from '@/content/site';
import { Mark } from '@/components/ui/Mark';

export function Footer({ c }: { c: Content }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" data-section="footer">
      <div className="wrap footer-top">
        <div className="footer-col">
          <h3 className="t-label text-ink-soft">{c.footer.contact}</h3>
          <ul>
            <li><a className="link" href={`mailto:${EMAIL}`} data-placeholder="true">{EMAIL}</a></li>
            <li><a className="link" href={`tel:${PHONE.replace(/\s/g, '')}`} data-placeholder="true">{PHONE}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="t-label text-ink-soft">{c.footer.data}</h3>
          <ul>
            <li data-placeholder="true">{LEGAL_NAME}</li>
            <li data-placeholder="true">NIP {NIP}</li>
            <li>{c.footer.country}</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="t-label text-ink-soft">{c.footer.social}</h3>
          <ul>
            {SOCIAL.map((s) => (<li key={s.label}><a className="link" href={s.href} data-placeholder={s.placeholder || undefined}>{s.label}</a></li>))}
          </ul>
        </div>
        <div className="footer-col footer-ask">
          <h3 className="t-label text-ink-soft">{c.footer.ask}</h3>
          <ul className="footer-ask-list">
            {ASK_AI.map((a) => (
              <li key={a.id}><a className="btn btn-ghost" href={a.url(c.footer.askPrompt)} target="_blank" rel="noreferrer"><span>{a.label}</span></a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer-mark" aria-hidden="true">
        <span className="footer-wordmark t-display">Nest <span style={{ fontWeight: 300 }}>Studio</span></span>
        <Mark size={64} className="footer-glyph" />
      </div>
      <div className="wrap footer-bottom t-caption text-ink-soft">
        <span>© {year} Nest Studio. {c.footer.legal}</span>
        <span data-placeholder="true" hidden>{c.footer.privacy}</span>
      </div>
    </footer>
  );
}
