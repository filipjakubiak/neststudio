import { CHROME_POSTER } from '@/lib/chrome/frames';

/* Pierwsza klatka sekwencji chromu (D16) jako zwykły obraz: widoczna od pierwszego malowania, bez JS
   i przy reduced motion. Mobile dostaje mniejszy plik (ta sama granica co zestaw klatek). */
export function ChromePoster({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <picture className="chrome-picture">
      <source media="(max-width: 767px)" srcSet={CHROME_POSTER.m} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={className}
        src={CHROME_POSTER.d}
        alt=""
        width={640}
        height={640}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        loading={priority ? 'eager' : 'lazy'}
        draggable={false}
      />
    </picture>
  );
}
