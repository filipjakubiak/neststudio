export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`t-label text-ink-soft ${className}`.trim()}>{children}</p>;
}
