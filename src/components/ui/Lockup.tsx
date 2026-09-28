import type { CSSProperties } from 'react';
import { TITLE_GLYPHS } from '@/scene/titleGlyphs';
import { layoutTitle, TITLE_ASPECT } from '@/scene/titleLayout';

/* Kontury "NEST STUDIO" raz w dokumencie; każdy lockup (hero, stopka, overlay) odwołuje się do nich przez <use>.
   Dane glifów mają y w górę (jak w Three.js), więc instancje odwracają oś y atrybutem transform. */
export function LockupDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {TITLE_GLYPHS.map((g, i) => (<path key={i} id={`ng-${i}`} d={g.d} vectorEffect="non-scaling-stroke" />))}
      </defs>
    </svg>
  );
}

function TitleSvg({ stacked, className }: { stacked: boolean; className: string }) {
  const l = layoutTitle(stacked);
  return (
    <svg className={className} viewBox={`0 0 ${l.width.toFixed(3)} ${l.height.toFixed(3)}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <g transform={`translate(0 ${l.height.toFixed(3)}) scale(1 -1)`}>
        {l.letters.map((p, i) => (
          <use key={i} href={`#ng-${TITLE_GLYPHS.indexOf(p.glyph)}`} transform={`translate(${p.x.toFixed(3)} ${p.y.toFixed(3)})`} />
        ))}
      </g>
    </svg>
  );
}

/* Boks lockupu: proporcje z układu glifów, więc kotwica DOM i litery 3D pokrywają się co do piksela.
   Jedna linia od 768 px, dwie linie poniżej (próg STACKED w motion.ts). SVG to fallback (reduced motion,
   brak WebGL, chwila przed startem sceny); gaśnie, gdy scena stoi. */
export function Lockup({ className }: { className: string }) {
  const style = { '--ar-single': TITLE_ASPECT.single.toFixed(4), '--ar-stacked': TITLE_ASPECT.stacked.toFixed(4) } as CSSProperties;
  return (
    <div className={`lockup ${className}`} aria-hidden="true" style={style}>
      <TitleSvg stacked={false} className="lockup-svg lockup-single" />
      <TitleSvg stacked className="lockup-svg lockup-stacked" />
    </div>
  );
}
