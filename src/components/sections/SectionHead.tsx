import { Eyebrow } from '@/components/ui/Eyebrow';

/* Eyebrow + two-line heading (lines rise through a mask, see useReveal) + optional lead. */
export function SectionHead({ eyebrow, title, lead, className = '', as: Tag = 'h2' }: {
  eyebrow?: string;
  title: string[];
  lead?: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={`head ${className}`.trim()}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="t-h2 head-title" data-reveal>
        {title.map((line, i) => (
          <span key={i} className="head-line">{line}{i < title.length - 1 ? ' ' : ''}</span>
        ))}
      </Tag>
      {lead && <p className="t-lead text-ink-soft head-lead measure">{lead}</p>}
    </div>
  );
}
