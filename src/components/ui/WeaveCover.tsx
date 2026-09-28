import { weavePaths } from '@/lib/weavePattern';

export function WeaveCover({ seed, className = '', label }: { seed: number; className?: string; label?: string }) {
  const paths = weavePaths(seed);
  return (
    <svg className={className} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} fill="none" stroke="currentColor" strokeLinecap="round">
      {paths.map((d, i) => (
        <path key={i} d={d} strokeWidth={i % 5 === 0 ? 1.6 : 0.8} opacity={0.35 + (i % 7) * 0.09} />
      ))}
    </svg>
  );
}
