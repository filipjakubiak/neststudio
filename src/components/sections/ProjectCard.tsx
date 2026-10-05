import type { Content, Project } from '@/content/types';

/* Project card (document 3.3): client name, one sentence about the real change, scope, "See the project". */
export function ProjectCard({ c, p, className = '' }: { c: Content; p: Project; className?: string }) {
  return (
    <article className={`project-card ${className}`.trim()}>
      <div className="card-media">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.alt} loading="lazy" decoding="async" width={1600} height={1000} draggable={false} />
        ) : (
          <div className="card-cover" aria-hidden="true"><span>{p.name}</span></div>
        )}
        {p.status && <span className="card-status t-label" data-placeholder={p.status.startsWith('[') || undefined}>{p.status}</span>}
      </div>
      <div className="card-meta">
        <div className="card-top">
          <h3 className="t-h3">{p.name}</h3>
          <span className="t-label text-ink-soft">{p.year}</span>
        </div>
        <p className="text-ink-soft card-sentence">{p.sentence}</p>
        <p className="t-caption text-ink-soft">{p.tags.join(' · ')}</p>
        {p.href && <a className="link t-small card-link" href={p.href} target="_blank" rel="noopener">{c.home.work.cardLink} ↗</a>}
      </div>
    </article>
  );
}
