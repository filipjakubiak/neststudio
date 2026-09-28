import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SHOWREEL_SRC } from '@/content/site';

export function Showreel({ c }: { c: Content }) {
  return (
    <section className="showreel" data-section="showreel" aria-labelledby="showreel-title">
      <div className="wrap showreel-head">
        <Eyebrow>{c.showreel.eyebrow}</Eyebrow>
        <h2 id="showreel-title" className="t-h1">{c.showreel.title}</h2>
        <p className="t-lead measure text-ink-soft">{c.showreel.lead}</p>
      </div>
      <div className="showreel-stage" data-src={SHOWREEL_SRC || undefined}>
        {SHOWREEL_SRC ? (
          <video className="showreel-video" src={SHOWREEL_SRC} muted playsInline preload="metadata" />
        ) : null}
        <ol className="showreel-cuts">
          {c.showreel.cuts.map((cut) => (
            <li className="showreel-cut" key={cut.label}>
              <span className="t-label text-ink-soft showreel-cut-label">{cut.label}</span>
              <span className="t-h2 showreel-cut-line">{cut.line}</span>
            </li>
          ))}
        </ol>
        <div className="showreel-player" role="group" aria-label="Showreel">
          <span className="t-mono t-caption showreel-time" aria-live="off">00:00:00</span>
          <div className="showreel-progress" aria-hidden="true"><span /></div>
          <ul className="showreel-labels" aria-hidden="true">
            {c.showreel.cuts.map((cut) => (<li key={cut.label} className="t-label">{cut.label}</li>))}
          </ul>
          <button type="button" className="btn btn-ghost showreel-play" aria-label={c.showreel.playAria} data-play={c.showreel.play} data-pause={c.showreel.pause} data-play-aria={c.showreel.playAria} data-pause-aria={c.showreel.pauseAria}>
            <span>{c.showreel.play}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
