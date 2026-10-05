import type { Content } from '@/content/types';
import { EMAIL, PHONE } from '@/content/site';
import { PageShell } from '@/components/PageShell';
import { PageHero } from '@/components/sections/PageHero';
import { TextBlock } from '@/components/sections/TextBlock';
import { ProjectTile } from '@/components/sections/ProjectTile';
import { Cta } from '@/components/sections/Cta';
import { ContactForm } from '@/components/sections/Contact';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* 5.1 Work: H1, lead, the project tiles (no filters while there are only a few projects, as the document says). */
export function WorkPage({ c }: { c: Content }) {
  const [first, ...rest] = c.projects;
  return (
    <PageShell c={c} page="work">
      <PageHero c={c} title={c.workPage.title} lead={c.workPage.lead} cta={false} />
      <section id="lista" className="section-sm">
        <div className="wrap work-grid">
          {first && <ProjectTile c={c} p={first} featured />}
          <div className="work-pair">{rest.map((p) => <ProjectTile key={p.id} c={c} p={p} />)}</div>
        </div>
      </section>
      <Cta c={c} />
    </PageShell>
  );
}

/* 5.2 Studio: H1, lead, our approach, three principles, people. */
export function StudioPage({ c }: { c: Content }) {
  const s = c.studioPage;
  return (
    <PageShell c={c} page="studio">
      <PageHero c={c} title={s.title} lead={s.lead} object="gniazdo" cta={false} />
      <TextBlock id="podejscie" b={s.approach} />
      <section id="zasady" className="section-sm" aria-labelledby="zasady-t">
        <div className="wrap">
          <Eyebrow className="list-label"><span id="zasady-t">{s.principlesTitle}</span></Eyebrow>
          <ol className="principles">
            {s.principles.map((p, i) => (
              <li key={p.title} className="tile principle">
                <span className="thread" aria-hidden="true" />
                <span className="direction-n t-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="soft">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="ludzie" className="section-sm" aria-labelledby="ludzie-t">
        <div className="wrap">
          <Eyebrow className="list-label"><span id="ludzie-t">{s.peopleTitle}</span></Eyebrow>
          <ul className="people">
            {s.people.map((p) => (
              <li key={p.name} className="tile person">
                <div className="portrait" aria-hidden="true"><span className="ph-badge">{c.system.placeholder}</span></div>
                <div className="person-copy">
                  <h3 className="t-h4">{p.name}</h3>
                  <p className={`t-small ${p.role.startsWith('[') ? 'ph' : 'soft'}`}>{p.role}</p>
                  <p className={`t-small ${p.bio.startsWith('[') ? 'ph' : 'soft'}`}>{p.bio}</p>
                </div>
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
    <PageShell c={c} page="contact">
      <PageHero c={c} title={k.title} lead={k.lead} cta={false} />
      <section id="formularz" className="section-sm contact">
        <div className="wrap contact-grid">
          <ContactForm c={c} />
          <aside className="contact-aside">
            <h2 className="t-h4">{k.nextTitle}</h2>
            <ol className="contact-next">
              {k.next.map((s, i) => <li key={i}><span className="direction-n t-num">{String(i + 1).padStart(2, '0')}</span><span>{s}</span></li>)}
            </ol>
            <p className="contact-direct">
              <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="link" href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
