import type { Content } from '@/content/types';
import type { PlanEntry } from '@/scene/bands/recipes';
import { EMAIL, PHONE } from '@/content/site';
import { PageShell } from '@/components/PageShell';
import { PageHero } from '@/components/sections/PageHero';
import { TextBlock } from '@/components/sections/TextBlock';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Cta } from '@/components/sections/Cta';
import { ContactForm } from '@/components/sections/Contact';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* 5.1 Work: H1, lead, the project cards (no filters while there are only a few projects). */
export function WorkPage({ c }: { c: Content }) {
  const bands: PlanEntry[] = [{ name: 'lista', recipe: 'cross', gap: 'hero/lista', from: 'right', period: 26 }];
  return (
    <PageShell c={c} page="work" bands={bands}>
      <PageHero c={c} title={c.workPage.title} lead={c.workPage.lead} cta={false} />
      <section id="lista" className="work-list">
        <div className="wrap work-list-grid">
          {c.projects.map((p, i) => <ProjectCard key={p.id} c={c} p={p} className={i === 0 ? 'is-featured' : ''} />)}
        </div>
      </section>
      <Cta c={c} />
    </PageShell>
  );
}

/* 5.2 Studio: H1, lead, our approach, three principles, people. */
export function StudioPage({ c }: { c: Content }) {
  const s = c.studioPage;
  const bands: PlanEntry[] = [
    { name: 'podejscie', recipe: 'drop', gaps: ['hero/podejscie', 'podejscie/zasady'], from: 'right', to: 'right', x: 0.9, folds: ['soft', 'soft'], period: 24,
      mobile: { recipe: 'cross', gap: 'hero/podejscie' } },
    { name: 'ludzie', recipe: 'cross', gap: 'zasady/ludzie', from: 'left', period: 28, phase: 0.3 },
  ];
  return (
    <PageShell c={c} page="studio" bands={bands}>
      <PageHero c={c} title={s.title} lead={s.lead} object="gniazdo" cta={false} />
      <TextBlock id="podejscie" b={s.approach} />
      <section id="zasady" className="principles-section">
        <div className="wrap">
          <Eyebrow>{s.principlesTitle}</Eyebrow>
          <ol className="principles">
            {s.principles.map((p, i) => (
              <li key={p.title} className="principle">
                <span className="t-label text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="ludzie" className="people-section">
        <div className="wrap">
          <Eyebrow>{s.peopleTitle}</Eyebrow>
          <ul className="people">
            {s.people.map((p) => (
              <li key={p.name} className="person" data-placeholder={p.placeholder || undefined}>
                <div className="portrait" aria-hidden="true">
                  <span>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                  <em className="t-label">{c.system.placeholder}</em>
                </div>
                <h3 className="t-h3">{p.name}</h3>
                <p className="t-caption text-ink-soft">{p.role}</p>
                <p className="text-ink-soft t-small">{p.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Cta c={c} />
    </PageShell>
  );
}

/* 5.3 Contact: H1, description, the form, "What happens next?". */
export function ContactPage({ c }: { c: Content }) {
  const k = c.contactPage;
  return (
    <PageShell c={c} page="contact" bands={[]}>
      <PageHero c={c} title={k.title} lead={k.lead} cta={false} />
      <section id="formularz" className="contact">
        <div className="wrap contact-grid">
          <div className="contact-intro">
            <div className="contact-next">
              <p className="t-label text-ink-soft">{k.nextTitle}</p>
              <ol>{k.next.map((s, i) => <li key={i}><span className="t-mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}</ol>
            </div>
            <p className="contact-direct t-small">
              <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="link" href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
            </p>
          </div>
          <ContactForm c={c} />
        </div>
      </section>
    </PageShell>
  );
}
