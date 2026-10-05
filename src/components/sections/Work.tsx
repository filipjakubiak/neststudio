'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import type { Content } from '@/content/types';
import { href } from '@/lib/links';
import { MOTION_EVENT, motionPaused } from '@/lib/motionPref';
import { useReveal } from '@/components/motion/useReveal';
import { Button } from '@/components/ui/Button';
import { SectionHead } from './SectionHead';
import { ProjectCard } from './ProjectCard';

/*
 * 3.3 Selected work as a carousel (Filip, 30.09). Native horizontal scroll with snap (touch, trackpad,
 * keyboard for free) + mouse drag + arrows + progress. The first project card is wider: the document's
 * hierarchy is "one big project first". A gentle auto-advance runs only until the visitor touches the
 * carousel, only while it is on screen and only while motion is on.
 */
export function Work({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const touched = useRef(false);
  const w = c.home.work;
  const n = c.projects.length;
  useReveal(root);

  const cards = () => [...(track.current?.querySelectorAll<HTMLElement>('.carousel-card') ?? [])];
  const go = (i: number) => {
    const t = track.current!;
    const list = cards();
    const target = list[(i + list.length) % list.length];
    t.scrollTo({ left: target.offsetLeft - list[0].offsetLeft, behavior: motionPaused() ? 'auto' : 'smooth' });
  };
  const step = (d: number) => { touched.current = true; go(index + d); };

  useEffect(() => {
    const t = track.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = t.scrollWidth - t.clientWidth;
      setProgress(max > 0 ? t.scrollLeft / max : 0);
      const list = cards();
      const mid = t.scrollLeft + t.clientWidth * 0.35;
      let best = 0;
      list.forEach((el, i) => { if (el.offsetLeft - list[0].offsetLeft <= mid) best = i; });
      setIndex(t.scrollLeft >= max - 4 ? list.length - 1 : best);
      // parallax: each image drifts against the scroll a little
      const center = t.scrollLeft + t.clientWidth / 2;
      list.forEach((el) => {
        const img = el.querySelector<HTMLElement>('.card-media > *');
        if (!img) return;
        const off = (el.offsetLeft - list[0].offsetLeft + el.offsetWidth / 2 - center) / t.clientWidth;
        img.style.transform = `translateX(${(-off * 48).toFixed(1)}px) scale(1.08)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    t.addEventListener('scroll', onScroll, { passive: true });
    update();

    // mouse drag (touch and trackpads scroll natively)
    let startX = 0, startLeft = 0, dragging = false, moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startLeft = t.scrollLeft;
      t.setPointerCapture(e.pointerId);
      t.classList.add('is-dragging');
      touched.current = true;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      t.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      t.classList.remove('is-dragging'); // snap takes over again and settles on the nearest card
    };
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const stop = () => { touched.current = true; };
    t.addEventListener('pointerdown', down);
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', up);
    t.addEventListener('pointercancel', up);
    t.addEventListener('click', click, true);
    t.addEventListener('wheel', stop, { passive: true });
    t.addEventListener('touchstart', stop, { passive: true });

    // auto-advance while untouched, visible and motion on
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.5 });
    io.observe(t);
    const timer = window.setInterval(() => {
      if (touched.current || !visible || motionPaused()) return;
      const list = cards();
      const cur = list.findIndex((el) => el.offsetLeft - list[0].offsetLeft >= t.scrollLeft - 4);
      go(cur + 1 >= list.length || t.scrollLeft >= t.scrollWidth - t.clientWidth - 4 ? 0 : cur + 1);
    }, 6000);
    const onMotion = () => update();
    window.addEventListener(MOTION_EVENT, onMotion);

    return () => {
      cancelAnimationFrame(raf);
      t.removeEventListener('scroll', onScroll);
      t.removeEventListener('pointerdown', down);
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', up);
      t.removeEventListener('pointercancel', up);
      t.removeEventListener('click', click, true);
      t.removeEventListener('wheel', stop);
      t.removeEventListener('touchstart', stop);
      io.disconnect();
      clearInterval(timer);
      window.removeEventListener(MOTION_EVENT, onMotion);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return (
    <section id="realizacje" ref={root} className="work">
      <div className="wrap work-head">
        <SectionHead eyebrow={w.eyebrow} title={w.title} lead={w.lead} />
        <div className="carousel-controls">
          <span className="t-caption t-mono text-ink-soft carousel-count" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <button type="button" className="carousel-btn" onClick={() => step(-1)} aria-label={w.prev}><ArrowLeft size={18} /></button>
          <button type="button" className="carousel-btn" onClick={() => step(1)} aria-label={w.next}><ArrowRight size={18} /></button>
        </div>
      </div>
      <div
        ref={track}
        className="carousel"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={w.eyebrow}
        onKeyDown={onKey}
        onFocus={() => { touched.current = true; }}
      >
        {c.projects.map((p, i) => (
          <ProjectCard key={p.id} c={c} p={p} className={`carousel-card ${i === 0 ? 'is-featured' : ''}`} />
        ))}
      </div>
      <div className="wrap work-foot">
        <div className="carousel-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} /></div>
        <p className="t-caption t-mono text-ink-soft carousel-hint">{w.hint}</p>
        <Button href={href(c, 'work')} variant="ghost">{w.all}</Button>
      </div>
    </section>
  );
}
