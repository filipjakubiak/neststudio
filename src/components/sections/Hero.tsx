import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

export function Hero({ c }: { c: Content }) {
  return (
    <section className="hero" data-section="hero" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <Eyebrow className="hero-eyebrow">{c.hero.eyebrow}</Eyebrow>
        <h1 id="hero-title" className="t-display hero-title">
          {c.hero.lines.map((line, i) => (
            <span className="hero-line" key={i}>
              <span className="hero-line-inner">
                {line}
                {i === c.hero.dropAfterLine && <span className="drop-slot" aria-hidden="true" />}
              </span>
            </span>
          ))}
        </h1>
        <div className="hero-side">
          <p className="t-lead hero-lead">{c.hero.lead}</p>
          <div className="hero-ctas">
            <Button href="#kontakt" magnetic>{c.hero.ctaPrimary}</Button>
            <Button href="#projekty" variant="ghost">{c.hero.ctaSecondary}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
