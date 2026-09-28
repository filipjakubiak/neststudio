import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { CAL_URL, EMAIL } from '@/content/site';

export function Contact({ c }: { c: Content }) {
  return (
    <section id="kontakt" className="contact" data-section="contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <Eyebrow>{c.contact.eyebrow}</Eyebrow>
        <h2 id="contact-title" className="t-display contact-title">{c.contact.title}</h2>
        <p className="t-lead measure text-ink-soft contact-lead">{c.contact.lead}</p>
        <div className="contact-actions">
          <Button href={`mailto:${EMAIL}`} magnetic>{c.contact.cta}</Button>
          <a className="link t-body contact-email" href={`mailto:${EMAIL}`} data-placeholder="true">{EMAIL}</a>
          {CAL_URL ? (
            <span className="t-body text-ink-soft">{c.contact.or} <a className="link" href={CAL_URL} target="_blank" rel="noreferrer">{c.contact.calendar}</a></span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
