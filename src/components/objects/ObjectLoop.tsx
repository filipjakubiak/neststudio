'use client';

import { useEffect, useRef } from 'react';
import type { ObjectId } from '@/content/types';
import { MOTION_EVENT, motionPaused } from '@/lib/motionPref';

type Variant = 'square' | 'wide' | 'tall';

/*
 * A rendered section object (remotion/src/v2 -> public/v2/objects/<id>/). Rendered on pure black, so it
 * sits on the page with mix-blend-mode: screen. Loads only near the viewport, plays only while visible
 * and while motion is on; otherwise it shows its poster (first frame). Decorative: hidden from AT.
 */
export function ObjectLoop({ id, variant = 'square', mobile, className = '', onTime }: {
  id: ObjectId;
  variant?: Variant;
  mobile?: Variant;
  className?: string;
  /** loop phase 0..1 while playing (lets a section sync to the light, e.g. process steps) */
  onTime?: (phase: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const timeCb = useRef(onTime);
  timeCb.current = onTime;

  useEffect(() => {
    const v = ref.current!;
    const small = window.matchMedia('(max-width: 767px)').matches;
    const vv = small && mobile ? mobile : variant;
    const size = small ? 'm' : 'd';
    v.poster = `/v2/objects/${id}/${vv}-poster.avif`;
    let loaded = false;
    let visible = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      for (const [ext, type] of [['webm', 'video/webm'], ['mp4', 'video/mp4']] as const) {
        const s = document.createElement('source');
        s.src = `/v2/objects/${id}/${vv}-${size}.${ext}`;
        s.type = type;
        v.appendChild(s);
      }
      v.load();
    };
    const sync = () => {
      if (visible && !motionPaused()) v.play().catch(() => {});
      else v.pause();
    };
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); near.disconnect(); } }, { rootMargin: '600px 0px' });
    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 });
    near.observe(v);
    seen.observe(v);
    let raf = 0;
    const tick = () => {
      if (timeCb.current && v.duration) timeCb.current(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    if (timeCb.current) raf = requestAnimationFrame(tick);
    window.addEventListener(MOTION_EVENT, sync);
    return () => { near.disconnect(); seen.disconnect(); cancelAnimationFrame(raf); window.removeEventListener(MOTION_EVENT, sync); };
  }, [id, variant, mobile]);

  return (
    <div className={`obj obj-${variant} ${mobile ? `obj-m-${mobile}` : ''} ${className}`.trim()} aria-hidden="true">
      <video ref={ref} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} />
    </div>
  );
}
