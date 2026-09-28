import type { Content } from '@/content/types';
import { yearsInField } from '@/content/site';
import { WeaveCover } from '@/components/ui/WeaveCover';

export function Studio({ c }: { c: Content }) {
  const years = yearsInField();
  return (
    <section id="studio" className="studio section" data-section="studio" aria-labelledby="studio-title">
      <div className="wrap grid-12 studio-grid">
        <figure className="studio-photo" data-placeholder="true">
          <div className="studio-frame" aria-hidden="true" />
          <div className="studio-img" role="img" aria-label={c.studio.photoAlt}>
            <WeaveCover seed={2014} />
            <span className="placeholder-mark studio-photo-label">{c.studio.photoPlaceholder}</span>
          </div>
        </figure>
        <div className="studio-body">
          <h2 id="studio-title" className="t-h2">{c.studio.title}</h2>
          <p className="t-lead studio-p">{c.studio.p1}</p>
          <p className="t-body text-ink-soft studio-p">{c.studio.p2}</p>
          <p className="t-mono t-label text-ink-soft studio-years">
            <span className="studio-years-value t-mono" data-years={years}>{c.studio.years.replace('{years}', String(years))}</span>
            <span className="studio-years-since">{c.studio.since}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
