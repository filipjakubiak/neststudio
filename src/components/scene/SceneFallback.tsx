import { weavePaths } from '@/lib/weavePattern';

/* Statyczny splot dla reduced motion / braku WebGL. */
export function SceneFallback({ note }: { note: string }) {
  const paths = weavePaths(7, 48, 1600, 1000);
  return (
    <div className="scene-fallback" aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeLinecap="round">
        {paths.map((d, i) => (<path key={i} d={d} strokeWidth={i % 6 === 0 ? 1.4 : 0.7} opacity={0.18 + (i % 5) * 0.06} />))}
      </svg>
      <span className="sr-only">{note}</span>
    </div>
  );
}
