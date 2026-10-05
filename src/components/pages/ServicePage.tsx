import type { Content, ServiceId } from '@/content/types';
import { href, service } from '@/lib/links';
import { PageShell } from '@/components/PageShell';
import { PageHero } from '@/components/sections/PageHero';
import { TextBlock } from '@/components/sections/TextBlock';
import { ProjectTile } from '@/components/sections/ProjectTile';
import { Process } from '@/components/sections/Process';
import { Cta } from '@/components/sections/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { More } from '@/components/ui/Button';

/* Service page skeleton from the document (ch. 4): hero, client situation, scope, example of work,
   process, related service, CTA. The example appears only when a real project used this service. */
export function ServicePage({ c, id }: { c: Content; id: ServiceId }) {
  const s = service(c, id);
  const examples = c.projects.filter((p) => p.services.includes(id) && p.image);
  const related = s.page.related;

  return (
    <PageShell c={c} page={id}>
      <PageHero c={c} eyebrow={s.name} title={s.page.title} lead={s.page.lead} object={s.object} />
      {s.page.blocks.map((b, i) => <TextBlock key={i} id={`blok-${i + 1}`} b={b} />)}
      {examples.length > 0 && (
        <section id="przyklad" className="section-sm example" aria-label={c.system.exampleLabel}>
          <div className="wrap">
            <Eyebrow className="example-label">{c.system.exampleLabel}</Eyebrow>
            <div className={`example-grid n-${examples.length}`}>
              {examples.map((p) => <ProjectTile key={p.id} c={c} p={p} featured={examples.length === 1} />)}
            </div>
          </div>
        </section>
      )}
      <Process c={c} />
      {related && (
        <section id="powiazana" className="section-sm related">
          <div className="wrap">
            <div className="tile tile-link related-tile">
              <p className="t-h3">{related.text}</p>
              <More href={href(c, related.to)} stretched>{related.link}</More>
            </div>
          </div>
        </section>
      )}
      <Cta c={c} />
    </PageShell>
  );
}
