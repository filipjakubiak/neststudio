'use client';

import { useRef } from 'react';
import type { Content } from '@/content/types';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SHOWREEL_SRC } from '@/content/site';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { MOTION_OK, MOTION_REDUCED } from '@/lib/motion';
import { getSceneBus } from '@/scene/state';

const REEL_SECONDS = 150;
const PLAY_SECONDS = 26;

function timecode(p: number) {
  const t = Math.max(0, Math.min(REEL_SECONDS, p * REEL_SECONDS));
  const m = Math.floor(t / 60), s = Math.floor(t % 60), f = Math.floor((t % 1) * 25);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

/* Peak: pin 400vh. Cięcia wchodzą w głąb (perspective), scena przechodzi w tunel, na końcu cięcie na biel. */
export function Showreel({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const bus = getSceneBus();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const head = el.querySelector<HTMLElement>('.showreel-head')!;
      const cuts = gsap.utils.toArray<HTMLElement>('.showreel-cut', el);
      const labels = gsap.utils.toArray<HTMLElement>('.showreel-labels li', el);
      const time = el.querySelector<HTMLElement>('.showreel-time')!;
      const bar = el.querySelector<HTMLElement>('.showreel-progress span')!;
      const flash = el.querySelector<HTMLElement>('.showreel-flash')!;
      const video = el.querySelector<HTMLVideoElement>('.showreel-video');
      const playBtn = el.querySelector<HTMLButtonElement>('.showreel-play')!;

      gsap.set(cuts, { opacity: 0, z: -900, rotateX: 8 });
      gsap.set(flash, { opacity: 0 });

      const st = { current: null as ScrollTrigger | null };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el, start: 'top top', end: '+=400%', pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            time.textContent = timecode(p);
            bar.style.width = `${(p * 100).toFixed(2)}%`;
            const idx = Math.min(cuts.length - 1, Math.max(-1, Math.floor((p - 0.14) / 0.15)));
            labels.forEach((l, i) => l.setAttribute('data-active', i === idx ? 'true' : 'false'));
            if (video && video.duration) video.currentTime = p * video.duration;
          },
          onRefresh: (self) => { st.current = self; },
        },
      });
      st.current = tl.scrollTrigger ?? null;

      /* nagłówek odjeżdża w głąb */
      tl.to(head, { z: -500, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.04);
      /* scena: tunel */
      tl.fromTo(bus.state, { speed: 0.05, tunnel: 0 }, { speed: 0.9, tunnel: 1, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, 0.06)
        .fromTo(bus.state, { camZ: 10 }, { camZ: 7.2, duration: 0.6, ease: 'power1.inOut', immediateRender: false }, 0.1)
        .fromTo(bus.state, { dropDetach: 1, dropX: 0, dropY: 0.2, dropZ: 0, dropScale: 0.5, dropAmp: 0.2, dropVisible: 1 }, { dropScale: 1.25, dropY: 0.75, dropAmp: 0.34, duration: 0.3, ease: 'power2.inOut', immediateRender: false }, 0.2)
        .fromTo(bus.state, { weave: 0.22 }, { weave: 0.75, duration: 0.5, ease: 'none', immediateRender: false }, 0.35)
        .to(bus.state, { dropScale: 0.7, dropY: 1.1, duration: 0.25, ease: 'power2.inOut' }, 0.62);

      /* pięć cięć w głąb */
      cuts.forEach((cut, i) => {
        const start = 0.14 + i * 0.15;
        tl.to(cut, { opacity: 1, z: 0, rotateX: 0, duration: 0.06, ease: 'power3.out' }, start)
          .to(cut, { opacity: 0, z: 500, duration: 0.05, ease: 'power2.in' }, start + 0.11);
      });

      /* cięcie na biel */
      tl.to(flash, { opacity: 1, duration: 0.06, ease: 'power2.in' }, 0.9)
        .to(bus.state, { tunnel: 0, speed: 0.05, camZ: 10, ink: 1, dropVisible: 0, duration: 0.08, ease: 'power2.inOut' }, 0.9)
        .to({}, { duration: 0.02 });

      /* Odtwórz: przewijanie przez pin ze stałą prędkością */
      let playing = false;
      const setPlaying = (v: boolean) => {
        playing = v;
        playBtn.querySelector('span')!.textContent = v ? playBtn.dataset.pause! : playBtn.dataset.play!;
        playBtn.setAttribute('aria-label', v ? playBtn.dataset.pauseAria! : playBtn.dataset.playAria!);
        el.setAttribute('data-playing', String(v));
      };
      const onClick = () => {
        const trigger = st.current; const lenis = window.__lenis;
        if (!trigger || !lenis) return;
        if (playing) { lenis.scrollTo(window.scrollY, { immediate: true }); setPlaying(false); return; }
        const remaining = 1 - trigger.progress;
        if (remaining <= 0.01) { lenis.scrollTo(trigger.start, { duration: 1, onComplete: () => onClick() }); return; }
        setPlaying(true);
        lenis.scrollTo(trigger.end, { duration: remaining * PLAY_SECONDS, easing: (t: number) => t, onComplete: () => setPlaying(false) });
      };
      const onWheel = () => { if (playing) setPlaying(false); };
      playBtn.addEventListener('click', onClick);
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('touchstart', onWheel, { passive: true });
      return () => { playBtn.removeEventListener('click', onClick); window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', onWheel); };
    });
    mm.add(MOTION_REDUCED, () => {
      el.setAttribute('data-static', 'true');
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="showreel" data-section="showreel" aria-labelledby="showreel-title">
      <div className="showreel-stage" data-src={SHOWREEL_SRC || undefined}>
        {SHOWREEL_SRC ? <video className="showreel-video" src={SHOWREEL_SRC} muted playsInline preload="metadata" /> : null}
        <div className="wrap showreel-head">
          <Eyebrow>{c.showreel.eyebrow}</Eyebrow>
          <h2 id="showreel-title" className="t-h1">{c.showreel.title}</h2>
          <p className="t-lead measure text-ink-soft">{c.showreel.lead}</p>
        </div>
        <ol className="showreel-cuts wrap">
          {c.showreel.cuts.map((cut) => (
            <li className="showreel-cut" key={cut.label}>
              <span className="t-label text-ink-soft showreel-cut-label">{cut.label}</span>
              <span className="t-h1 showreel-cut-line">{cut.line}</span>
            </li>
          ))}
        </ol>
        <div className="showreel-flash" aria-hidden="true" />
        <div className="showreel-player" role="group" aria-label="Showreel">
          <span className="t-mono t-caption showreel-time" aria-hidden="true">00:00:00</span>
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
