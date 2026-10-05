/*
 * Small data visualisations for the stats bento (reference: dribbble bento, 30.09). Only true data:
 * the timeline and ring are derived from the founding year, the chain from the service list, the wall
 * lights exactly as many cells as there are projects (none until the real number arrives).
 * Resting state = final state in CSS; Stats.tsx animates the entrance, CSS runs the ambient loops
 * (paused by html[data-motion='paused'] and reduced motion).
 */
import { Odometer } from '@/components/ui/Odometer';

export function Timeline({ from, to, now }: { from: number; to: number; now: string }) {
  const years = to - from;
  const x0 = 24, x1 = 616, y = 64;
  const xs = Array.from({ length: years + 1 }, (_, i) => x0 + (i * (x1 - x0)) / years);
  const major = (i: number) => i === 0 || i === years || (from + i) % 4 === 2;
  return (
    <svg className="viz-timeline" viewBox="0 0 640 120" role="img" aria-label={`${from} → ${to}`}>
      <defs>
        <linearGradient id="tl-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#3a0007" />
          <stop offset="0.6" stopColor="#c22428" />
          <stop offset="1" stopColor="#eb2e2a" />
        </linearGradient>
        <radialGradient id="tl-glow">
          <stop offset="0" stopColor="#f8ccb8" />
          <stop offset="0.35" stopColor="#eb2e2a" />
          <stop offset="1" stopColor="#eb2e2a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1={x0} x2={x1} y1={y} y2={y} className="tl-base" />
      <line x1={x0} x2={x1} y1={y} y2={y} className="tl-progress" stroke="url(#tl-grad)" />
      {xs.map((x, i) => (
        <line key={i} x1={x} x2={x} y1={y - (major(i) ? 12 : 6)} y2={y + (major(i) ? 12 : 6)} className={`tl-tick ${major(i) ? 'is-major' : ''}`} />
      ))}
      {xs.map((x, i) => major(i) && (
        <text key={`t${i}`} x={x} y={y + 38} textAnchor={i === 0 ? 'start' : i === years ? 'end' : 'middle'} className="tl-label">{from + i}</text>
      ))}
      <text x={x1} y={y - 24} textAnchor="end" className="tl-now">{now}</text>
      <g className="tl-comet"><circle cx={x0} cy={y} r="22" fill="url(#tl-glow)" /><circle cx={x0} cy={y} r="3.5" fill="#f8ccb8" /></g>
    </svg>
  );
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export function Ring({ count, value, unit }: { count: number; value: string; unit: string }) {
  const gap = 0.07;
  const step = (Math.PI * 2) / count;
  return (
    <div className="viz-ring">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => {
          const a0 = -Math.PI / 2 + i * step + gap / 2;
          return <path key={i} d={arc(100, 100, 78, a0, a0 + step - gap)} className="ring-seg" style={{ '--i': i, opacity: 0.32 + (0.68 * (i + 1)) / count } as React.CSSProperties} />;
        })}
      </svg>
      <div className="ring-center">
        <Odometer value={value} className="ring-value" />
        <span className="t-label text-ink-soft">{unit}</span>
      </div>
    </div>
  );
}

export function Chain({ items }: { items: string[] }) {
  return (
    <ol className="viz-chain" style={{ '--n': items.length } as React.CSSProperties}>
      {items.map((it, i) => (
        <li key={it} className="chain-node" style={{ '--i': i } as React.CSSProperties}>
          <span className="chain-dot" aria-hidden="true" />
          <span className="chain-name">{it}</span>
          <span className="chain-bar" aria-hidden="true" />
          {i < items.length - 1 && <span className="chain-link" aria-hidden="true"><i /></span>}
        </li>
      ))}
    </ol>
  );
}

export function Wall({ total, lit }: { total: number; lit: number }) {
  const cols = 15;
  return (
    <div className="viz-wall" style={{ '--cols': cols } as React.CSSProperties} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`wall-cell ${i < lit ? 'is-lit' : ''}`} style={{ '--d': (i % cols) + Math.floor(i / cols) } as React.CSSProperties} />
      ))}
    </div>
  );
}
