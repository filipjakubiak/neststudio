'use client';

import { useEffect, useRef, useState } from 'react';
import type { Content } from '@/content/types';
import { ScrollTrigger } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';
import { introIn, useScene } from '@/components/motion/useScene';
import { SectionIntro } from './SectionIntro';

/*
 * 3.6 How we work. The film (videos/proces, HyperFrames: one magenta thread drafts the four stages, 3 s each)
 * is driven by your scroll while the scene stays pinned: scroll back and the thread un-draws.
 * Logic flow:
 *   scroll progress p -> target time p * 12 s -> the video follows on a critically damped chase (no jitter, no
 *   overshoot) -> the active stage = the chapter the *film* is in, so text and picture never disagree.
 *   On release the scene settles on the nearest finished stage, projected from the scroll velocity
 *   (apple-design: momentum projection, then snap). Clicking a stage scrolls to it.
 * Without JS or with reduced motion: the four stages as a plain list, each with its still frame.
 */
const DURATION = 12;
const CHAPTER = 3;
/* the moment each chapter has finished drawing: where the scene comes to rest */
const REST = [2.85, 5.9, 8.9, 11.9];

export function Process({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [scrub, setScrub] = useState(false);
  const [active, setActive] = useState(0);
  const p = c.home.process;
  const steps = p.steps;

  useScene(root, (q) => { introIn(q('.intro')[0]); });

  // scrubbing only where motion is welcome; the plain list is the default
  useEffect(() => {
    const mq = window.matchMedia(MOTION_OK);
    const sync = () => setScrub(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!scrub) return;
    const el = root.current!;
    const track = el.querySelector<HTMLElement>('.process-track')!;
    const v = video.current!;
    const small = window.matchMedia('(max-width: 1023px)').matches;
    v.src = `/v3/proces/proces-${small ? 'm' : 'd'}.mp4`;
    v.load();

    let target = 0;
    let shown = 0;
    let raf = 0;
    let last = -1;
    // critically damped follow of the scroll target (frame-rate independent)
    const tick = (now: number) => {
      const dt = last < 0 ? 16 : Math.min(64, now - last);
      last = now;
      const k = 1 - Math.exp(-dt / 70);
      shown += (target - shown) * k;
      if (Math.abs(target - shown) < 0.002) shown = target;
      if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - shown) > 0.01) v.currentTime = Math.min(DURATION - 0.04, shown);
      const stage = Math.min(steps.length - 1, Math.floor(shown / CHAPTER + 0.0001));
      setActive((a) => (a === stage ? a : stage));
      track.style.setProperty('--p', (shown / DURATION).toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { target = self.progress * DURATION; },
      snap: {
        // land on the finished state of the nearest stage, chosen from where the flick was heading
        snapTo: (value: number, self?: ScrollTrigger) => {
          const projected = value + (self ? self.getVelocity() / 1000 * 0.998 / (1 - 0.998) / (self.end - self.start) : 0);
          const rests = REST.map((t) => t / DURATION);
          return rests.reduce((best, r) => (Math.abs(r - projected) < Math.abs(best - projected) ? r : best), rests[0]);
        },
        delay: 0.12,
        duration: { min: 0.25, max: 0.7 },
        ease: 'power3.out',
        inertia: false,
      },
    });
    target = st.progress * DURATION;
    shown = target;

    return () => { cancelAnimationFrame(raf); st.kill(); v.removeAttribute('src'); v.load(); };
  }, [scrub, steps.length]);

  const go = (i: number) => {
    const track = root.current!.querySelector<HTMLElement>('.process-track')!;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * (REST[i] / DURATION), behavior: 'smooth' });
  };

  return (
    <section id="proces" ref={root} className="section process" aria-labelledby="proces-t" data-scrub={scrub || undefined}>
      <div className="wrap">
        <SectionIntro id="proces-t" eyebrow={p.eyebrow} title={p.title} lead={p.intro} />
      </div>
      <div className="process-track">
        <div className="process-stage wrap">
          <div className="process-list">
            <span className="process-rail" aria-hidden="true"><span className="process-rail-fill" /></span>
            <ol className="process-steps">
              {steps.map((s, i) => (
                <li key={s.title} className="step" data-on={!scrub || i === active || undefined} data-done={scrub && i < active ? true : undefined}>
                  <button type="button" className="step-head" onClick={() => go(i)} tabIndex={scrub ? 0 : -1} aria-current={scrub && i === active ? 'step' : undefined}>
                    <span className="step-knot" aria-hidden="true" />
                    <span className="step-n t-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="step-title t-h4">{s.title}</span>
                  </button>
                  <div className="step-body">
                    <div className="step-body-in">
                      <p className="soft">{s.body}</p>
                      <div className="step-outcome">
                        <p className="t-caption soft">{p.outcomeLabel}</p>
                        <p className="t-small">{s.outcome}</p>
                      </div>
                    </div>
                  </div>
                  {/* reduced motion / no JS: the stage's finished frame */}
                  {!scrub && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="step-still" src={`/v3/proces/stage-${i + 1}.avif`} alt="" loading="lazy" width={1080} height={1080} />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="process-film tile" aria-hidden="true">
            <video ref={video} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} poster="/v3/proces/stage-1.avif" />
          </div>
        </div>
      </div>
    </section>
  );
}
