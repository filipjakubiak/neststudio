import type { Content } from '@/content/types';

export function Tension({ c }: { c: Content }) {
  return (
    <section className="tension section" data-section="tension" aria-labelledby="tension-title">
      <div className="wrap">
        <h2 id="tension-title" className="t-h1 tension-title">{c.tension.title}</h2>
        <div className="tension-split" aria-hidden="true">
          <div className="tension-col tension-col-left">
            <span className="t-label text-ink-soft">{c.tension.leftLabel}</span>
            <span className="tension-word tension-word-scatter">{c.tension.leftWord}</span>
          </div>
          <div className="tension-divider" />
          <div className="tension-col tension-col-right">
            <span className="t-label text-ink-soft">{c.tension.rightLabel}</span>
            <span className="tension-word">{c.tension.rightWord}</span>
          </div>
        </div>
        <p className="sr-only">{c.tension.leftLabel}: {c.tension.leftWord}. {c.tension.rightLabel}: {c.tension.rightWord}.</p>
        <div className="tension-copy">
          <p className="t-h3 tension-you">{c.tension.you}</p>
          <p className="t-body measure text-ink-soft tension-body">{c.tension.body}</p>
        </div>
        <p className="t-h2 tension-closing">
          {c.tension.closing.map((l) => (
            <span className="tension-closing-line" key={l}>{l} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
