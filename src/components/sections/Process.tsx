import type { Content } from '@/content/types';

export function Process({ c }: { c: Content }) {
  return (
    <section id="proces" className="process section" data-section="process" aria-labelledby="process-title">
      <div className="wrap process-inner">
        <h2 id="process-title" className="t-h1 process-title">{c.process.title}</h2>
        <div className="process-track">
          <svg className="process-thread" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor">
            <path className="process-path-ghost" d="M20 200C160 40 240 360 400 200S620 40 760 200 900 360 980 200" strokeWidth="1" opacity="0.2" />
            <path className="process-path" d="M20 200C160 40 240 360 400 200S620 40 760 200 900 360 980 200" strokeWidth="1.5" />
          </svg>
          <ol className="process-steps">
            {c.process.steps.map((s, i) => (
              <li className="step" key={s.title} data-step={i}>
                <span className="step-dot" aria-hidden="true" />
                <h3 className="t-h3 step-title">{s.title}</h3>
                <p className="t-small text-ink-soft step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
