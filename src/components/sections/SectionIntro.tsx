import { Eyebrow } from '@/components/ui/Eyebrow';

/* The document's section opening: label, a heading in its own lines, an optional lead. Centred, keynote-style. */
export function SectionIntro({ eyebrow, title, lead, id, align = 'center', as: H = 'h2', className = '' }: {
  eyebrow?: string;
  title: string[];
  lead?: string;
  id?: string;
  align?: 'center' | 'start';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <header className={`intro intro-${align} ${className}`.trim()}>
      {eyebrow && <Eyebrow className="intro-in">{eyebrow}</Eyebrow>}
      <H id={id} className={`${H === 'h1' ? 't-h1' : 't-h2'} intro-title`}>
        {title.map((l, i) => <span key={i} className="intro-line">{l}</span>)}
      </H>
      {lead && <p className="t-lead soft intro-lead intro-in">{lead}</p>}
    </header>
  );
}
