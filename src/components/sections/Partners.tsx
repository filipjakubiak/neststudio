import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* Partners & clients: names as quiet wordmarks on a slow marquee (CSS, pauses with the motion switch
   and on hover). Real logos replace the names once clients agree. */
export function Partners({ c }: { c: Content }) {
  const row = c.partners.names.map((n, i) => (
    <li key={i} data-placeholder={n.startsWith('[') || undefined}>{n}</li>
  ));
  return (
    <section id="klienci" className="partners">
      <div className="wrap partners-head">
        <Eyebrow>{c.partners.eyebrow}</Eyebrow>
        <p className="t-caption t-mono text-ink-soft">{c.partners.note}</p>
      </div>
      <div className="marquee" aria-label={c.partners.title}>
        <ul className="marquee-track">{row}</ul>
        <ul className="marquee-track" aria-hidden="true">{row}</ul>
      </div>
    </section>
  );
}
