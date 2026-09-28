import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ServiceGlyph } from './services/ServiceGlyph';

export function Services({ c }: { c: Content }) {
  return (
    <section id="uslugi" className="services section" data-section="services" aria-labelledby="services-title">
      <div className="wrap">
        <Eyebrow>{c.services.eyebrow}</Eyebrow>
        <h2 id="services-title" className="t-h1 services-title">{c.services.title}</h2>
      </div>
      <div className="wrap">
        <ul className="services-bands" role="list">
          {c.services.items.map((s, i) => (
            <li className="band" key={s.id} data-service={s.id} data-open={i === 0 ? 'true' : 'false'}>
              <button type="button" className="band-head" aria-expanded={i === 0} aria-controls={`band-${s.id}`}>
                <span className="band-glyph" aria-hidden="true"><ServiceGlyph id={s.id} /></span>
                <span className="t-h3 band-title">{s.title}</span>
              </button>
              <div id={`band-${s.id}`} className="band-panel">
                <p className="t-body text-ink-soft band-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-caption text-ink-soft services-note">{c.services.note}</p>
      </div>
    </section>
  );
}
