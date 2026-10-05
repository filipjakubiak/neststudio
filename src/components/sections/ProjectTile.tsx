import type { Content, Project } from '@/content/types';
import { More } from '@/components/ui/Button';

/*
 * Project card (document 3.3): client name, one sentence about the real change, scope, "See the project".
 * The whole tile presses like one object when the project has a page to open. [brackets] = Filip's data.
 */
export function ProjectTile({ c, p, featured = false }: { c: Content; p: Project; featured?: boolean }) {
  const ph = (s: string) => s.startsWith('[');
  return (
    <article className={`tile project${featured ? ' is-featured' : ''}${p.href ? ' tile-link' : ''}`}>
      <div className="project-head">
        <div className="project-title">
          <h3 className={featured ? 't-h2' : 't-h3'}>{p.name}</h3>
          {p.status && <span className="ph-badge">{p.status}</span>}
        </div>
        <p className={`project-sentence ${ph(p.sentence) ? 'ph' : 'soft'}`}>{p.sentence}</p>
        <div className="project-meta">
          <p className="t-caption soft project-tags">{p.tags.join(' · ')}{p.year && <span className="t-num"> · {p.year}</span>}</p>
          {p.href && <More href={p.href} external stretched>{c.home.work.cardLink}</More>}
        </div>
      </div>
      <div className="project-media">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.alt} loading="lazy" decoding="async" width={1600} height={1000} draggable={false} />
        ) : (
          <div className="project-cover" aria-hidden="true"><span>{p.name}</span></div>
        )}
      </div>
    </article>
  );
}
