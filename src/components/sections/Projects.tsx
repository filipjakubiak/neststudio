import type { Content } from '@/content/types';
import { WeaveCover } from '@/components/ui/WeaveCover';

export function Projects({ c }: { c: Content }) {
  return (
    <section id="projekty" className="projects" data-section="projects" data-theme="light" aria-labelledby="projects-title">
      <div className="wrap projects-head">
        <h2 id="projects-title" className="t-h1">{c.projects.title}</h2>
        <p className="t-lead text-ink-soft measure">{c.projects.lead}</p>
      </div>
      <div className="projects-stack">
        {c.projects.items.map((p, i) => (
          <article className="sheet" key={p.slug} data-index={i} aria-labelledby={`project-${p.slug}`}>
            <div className="wrap sheet-inner grid-12">
              <div className="sheet-cover">
                <WeaveCover seed={p.seed} />
              </div>
              <div className="sheet-body">
                <h3 id={`project-${p.slug}`} className="t-h2" data-placeholder={p.placeholder || undefined}>{p.name}</h3>
                <p className="t-body text-ink-soft sheet-summary" data-placeholder={p.placeholder || undefined}>{p.summary}</p>
                <ul className="sheet-scope" aria-label="Zakres">
                  {p.scope.map((s) => (<li className="chip" key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="sheet-metric" data-placeholder={p.placeholder || undefined}>
                <span className="t-mono sheet-metric-value">{p.metric}</span>
                <span className="t-caption text-ink-soft">{p.metricLabel}</span>
                <span className="t-mono t-label text-ink-soft sheet-year">{p.year}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap projects-foot">
        <a className="link t-lead" href="#kontakt">{c.projects.askLink}</a>
      </div>
    </section>
  );
}
