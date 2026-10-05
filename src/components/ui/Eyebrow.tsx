/* Section label (the document's small caps label), set Apple-style: accent, semibold, sentence case. */
export function Eyebrow({ children, className = '', as: Tag = 'p' }: { children: React.ReactNode; className?: string; as?: 'p' | 'span' }) {
  return <Tag className={`t-eyebrow ${className}`.trim()}>{children}</Tag>;
}
