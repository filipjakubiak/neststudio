/* Mikro-ilustracje usług (własne SVG, animowane w K4). */
export function ServiceGlyph({ id }: { id: 'strategy' | 'brand' | 'web' | 'ai' }) {
  const common = { viewBox: '0 0 120 120', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'strategy':
      return (
        <svg {...common} className="glyph glyph-strategy">
          <path className="g-path" d="M14 96C34 60 46 88 62 52S92 40 106 24" />
          <path className="g-arrow" d="M92 24h14v14" />
        </svg>
      );
    case 'brand':
      return (
        <svg {...common} className="glyph glyph-brand" strokeWidth={3}>
          <path className="g-t1" d="M40 24v8M40 46v50" />
          <path className="g-t2" d="M80 24v72" />
          <path className="g-t3" d="M32 20l44 62M84 90l6 8" />
        </svg>
      );
    case 'web':
      return (
        <svg {...common} className="glyph glyph-web">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} className="g-cell" x={16 + (i % 4) * 24} y={24 + Math.floor(i / 4) * 24} width={16} height={16} />
          ))}
        </svg>
      );
    case 'ai':
      return (
        <svg {...common} className="glyph glyph-ai">
          <circle className="g-node" cx="24" cy="60" r="7" />
          <circle className="g-node" cx="60" cy="32" r="7" />
          <circle className="g-node" cx="60" cy="88" r="7" />
          <circle className="g-node" cx="98" cy="60" r="7" />
          <path className="g-edge" d="M31 60L53 36M31 60L53 84M67 32L91 56M67 88L91 64" />
          <circle className="g-packet" cx="24" cy="60" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
