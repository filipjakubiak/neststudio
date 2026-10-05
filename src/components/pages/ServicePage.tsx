import type { Content, ServiceId } from '@/content/types';
import type { PlanEntry } from '@/scene/bands/recipes';
import { href, service } from '@/lib/links';
import { PageShell } from '@/components/PageShell';
import { PageHero } from '@/components/sections/PageHero';
import { TextBlock } from '@/components/sections/TextBlock';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Process } from '@/components/sections/Process';
import { Cta } from '@/components/sections/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* Service page skeleton from the document (ch. 4): hero, client situation, scope, example of work,
   process, related service, CTA. The example appears only when a real project used this service. */
export function ServicePage({ c, id }: { c: Content; id: ServiceId }) {
  const s = service(c, id);
  const examples = c.projects.filter((p) => p.services.includes(id) && p.image);
  const related = s.page.related;
  const blockIds = s.page.blocks.map((_, i) => `blok-${i + 1}`);
  const after = examples.length ? 'przyklad' : 'proces';
  const bands: PlanEntry[] = [
    { name: 'blok', recipe: 'drop', gaps: [`hero/${blockIds[0]}`, `${blockIds[0]}/${blockIds[1]}`], from: 'right', to: 'right', x: 0.9, folds: ['soft', 'soft'], period: 24,
      mobile: { recipe: 'cross', gap: `hero/${blockIds[0]}` } },
    { name: 'przed-procesem', recipe: 'cross', gap: `${blockIds[blockIds.length - 1]}/${after}`, from: 'left', period: 28, phase: 0.4 },
  ];

  return (
    <PageShell c={c} page={id} bands={bands}>
      <PageHero c={c} eyebrow={s.name} title={s.page.title} lead={s.page.lead} object={s.object} />
      {s.page.blocks.map((b, i) => <TextBlock key={blockIds[i]} id={blockIds[i]} b={b} index={i + 1} />)}
      {examples.length > 0 && (
        <section id="przyklad" className="example">
          <div className="wrap">
            <Eyebrow>{c.system.exampleLabel}</Eyebrow>
            <div className="example-grid">
              {examples.map((p) => <ProjectCard key={p.id} c={c} p={p} />)}
            </div>
          </div>
        </section>
      )}
      <Process c={c} />
      {related && (
        <section id="powiazana" className="related">
          <div className="wrap related-inner">
            <p className="t-h2">{related.text}</p>
            <a className="related-link" href={href(c, related.to)}>{related.link} ↗</a>
          </div>
        </section>
      )}
      <Cta c={c} />
    </PageShell>
  );
}
