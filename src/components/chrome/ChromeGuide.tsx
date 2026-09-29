'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { DESKTOP, isFinePointer, prefersReducedMotion, whenReady } from '@/lib/motion';
import { CHROME, frameFor, frameUrl, nearestLoaded, nextToLoad, sectionOrder, wantedFrames, type ChromeSetId } from '@/lib/chrome/frames';
import { CHOREO, mix, type Ctx, type Pose } from './choreography';

type Conn = { saveData?: boolean; effectiveType?: string };

/* Przewodnik: jedna klatka liquid chrome (render Remotion, D15) na kanwie 2D nad nićmi.
   Scroll przewija klatki (kształt: kropla, napięcie, soczewka, nić, lądowanie), a pozycja,
   skala i kierunek są komponowane per sekcja tak, żeby chrom prowadził oko. */
export function ChromeGuide() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const html = document.documentElement;
    if (!canvas) return;
    if (prefersReducedMotion()) { html.setAttribute('data-chrome', 'static'); return; }
    html.setAttribute('data-chrome', 'pending');
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) { html.setAttribute('data-chrome', 'static'); return; }

    /* --- zestaw i sieć ------------------------------------------------------------------ */
    const setId: ChromeSetId = window.innerWidth < 768 ? 'm' : 'd';
    const S = CHROME.sets[setId].size;
    const N = CHROME.frames;
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    const slow = !!conn && (conn.saveData === true || ['slow-2g', '2g', '3g'].includes(conn.effectiveType ?? ''));
    const stride = slow ? 2 : 1;
    const wanted = wantedFrames(N, stride);
    const bitmaps: (ImageBitmap | null)[] = new Array(N).fill(null);
    const failed = new Set<number>();
    const inflight = new Set<number>();
    canvas.width = S;
    canvas.height = S;
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;

    let disposed = false;
    let loading = false;
    let dirty = true;
    let direction: 1 | -1 = 1;

    const has = (i: number) => bitmaps[i] !== null;
    /* Klatka 0 = plakat, który już stoi w slocie hero: dekodujemy go zamiast pobierać drugi raz. */
    const poster = document.querySelector<HTMLImageElement>('.drop-poster');
    const seedPoster = () => {
      if (!poster || bitmaps[0] || !poster.naturalWidth) return;
      createImageBitmap(poster).then((bmp) => { if (disposed || bitmaps[0]) { bmp.close(); return; } bitmaps[0] = bmp; dirty = true; }).catch(() => {});
    };
    if (poster?.complete) seedPoster(); else poster?.addEventListener('load', seedPoster, { once: true });
    const load = (i: number) => {
      inflight.add(i);
      fetch(frameUrl(setId, i), { priority: i === 0 ? 'high' : 'low' } as RequestInit)
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
        .then((b) => createImageBitmap(b))
        .then((bmp) => { if (disposed) { bmp.close(); return; } bitmaps[i] = bmp; dirty = true; })
        .catch(() => { failed.add(i); })
        .finally(() => { inflight.delete(i); pump(); });
    };
    const pump = () => {
      if (disposed || !loading) return;
      while (inflight.size < 4) {
        const i = nextToLoad(wanted, (k) => has(k) || inflight.has(k) || failed.has(k), cur.f, direction);
        if (i === null) return;
        load(i);
      }
    };

    /* --- odcinki scrolla ---------------------------------------------------------------- */
    const ids = sectionOrder().filter((id) => document.querySelector(`[data-section="${id}"]`));
    const els = ids.map((id) => document.querySelector<HTMLElement>(`[data-section="${id}"]`)!);
    const starts = ids.map((_, i) => ScrollTrigger.create({ trigger: els[i], start: i === 0 ? 'top top' : 'top 60%' }));
    const footer = document.querySelector<HTMLElement>('[data-section="footer"]');
    const endST = footer ? ScrollTrigger.create({ trigger: footer, start: 'top bottom' }) : null;
    const mqDesktop = window.matchMedia(DESKTOP);

    const locate = (y: number) => {
      let i = 0;
      while (i < ids.length - 1 && starts[i + 1].start <= y) i++;
      const a = starts[i].start;
      const b = i < ids.length - 1 ? starts[i + 1].start : (endST?.start ?? document.documentElement.scrollHeight - window.innerHeight);
      return { i, p: b > a ? Math.min(1, Math.max(0, (y - a) / (b - a))) : 0 };
    };

    const BLEND = 0.22; // ostatnie 22% odcinka płynie do pozy następnej sekcji
    const targetPose = (i: number, p: number): Pose => {
      const c: Ctx = { w: window.innerWidth, h: window.innerHeight, desktop: mqDesktop.matches, el: els[i] };
      const own = CHOREO[ids[i]]?.pose(p, c) ?? { x: c.w / 2, y: c.h / 2, size: 300, rot: 0, sx: 1, op: 1, front: 0 };
      if (i < ids.length - 1 && p > 1 - BLEND) {
        const nc: Ctx = { ...c, el: els[i + 1] };
        const next = CHOREO[ids[i + 1]]?.pose(0, nc);
        if (next) {
          const t = (p - (1 - BLEND)) / BLEND;
          return mix(own, next, t * t * (3 - 2 * t));
        }
      }
      return own;
    };
    const targetFrame = (i: number, p: number) => {
      const map = CHOREO[ids[i]]?.frames;
      return frameFor(ids[i], map ? map(p) : p);
    };

    /* --- wskaźnik w hero ---------------------------------------------------------------- */
    const ptr = { x: 0, y: 0, on: 0 };
    const onPointer = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = 1; };
    const onLeave = () => { ptr.on = 0; };
    if (isFinePointer()) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    /* --- pętla (gsap.ticker, ten sam co Lenis i ScrollTrigger) --------------------------- */
    const start = locate(window.scrollY);
    const cur = { f: targetFrame(start.i, start.p), ...targetPose(start.i, start.p), tilt: 0, px: 0, py: 0 };
    let shown = false;
    let lastKey = '';
    let lastTransform = '';
    let lastT = performance.now();
    let lastY = window.scrollY;

    const draw = () => {
      const base = Math.floor(cur.f / stride) * stride;
      const frac = (cur.f - base) / stride;
      const a = nearestLoaded(base, N, has);
      if (a === null) return false;
      const b = nearestLoaded(Math.min(N - 1, base + stride), N, has);
      const alpha = b !== null && b !== a ? Math.round(frac * 24) / 24 : 0;
      const key = `${a}|${b}|${alpha}`;
      if (key === lastKey && !dirty) return true;
      lastKey = key;
      canvas.dataset.frame = String(a); // odczyt w lab/chrome.mjs
      dirty = false;
      ctx2d.clearRect(0, 0, S, S);
      ctx2d.globalAlpha = 1;
      ctx2d.drawImage(bitmaps[a]!, 0, 0, S, S);
      if (alpha > 0 && b !== null) { ctx2d.globalAlpha = alpha; ctx2d.drawImage(bitmaps[b]!, 0, 0, S, S); ctx2d.globalAlpha = 1; }
      return true;
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      const y = window.scrollY;
      if (y !== lastY) { direction = y > lastY ? 1 : -1; lastY = y; }
      const { i, p } = locate(y);
      const tf = targetFrame(i, p);
      const tp = targetPose(i, p);
      /* po finale gniazdo odjeżdża ze stroną: kropla razem z nim */
      if (endST && y > endST.start) tp.y -= y - endST.start;

      /* wygładzanie: klatki płyną za scrollem (ciecz), pozycja trzyma się treści ciasno */
      const kf = 1 - Math.exp(-dt * 7);
      const kp = 1 - Math.exp(-dt * (i === 0 && p < 0.5 ? 40 : 11));
      cur.f += (tf - cur.f) * kf;
      if (Math.abs(tf - cur.f) < 0.002) cur.f = tf;
      cur.x += (tp.x - cur.x) * kp;
      cur.y += (tp.y - cur.y) * kp;
      cur.size += (tp.size - cur.size) * kp;
      let dr = tp.rot - cur.rot;
      if (dr > 180) dr -= 360;
      if (dr < -180) dr += 360;
      cur.rot += dr * kp;
      cur.sx += (tp.sx - cur.sx) * kp;
      cur.op += (tp.op - cur.op) * kp;
      cur.front = tp.front;

      /* hero: lekka paralaksa i przechył za kursorem */
      const heroW = i === 0 ? Math.max(0, 1 - p * 2.5) * ptr.on : 0;
      const kx = 1 - Math.exp(-dt * 5);
      const dx = Math.max(-1, Math.min(1, (ptr.x - cur.x) / (window.innerWidth * 0.5)));
      const dy = Math.max(-1, Math.min(1, (ptr.y - cur.y) / (window.innerHeight * 0.5)));
      cur.px += (dx * 10 * heroW - cur.px) * kx;
      cur.py += (dy * 7 * heroW - cur.py) * kx;
      cur.tilt += (dx * 5 * heroW - cur.tilt) * kx;

      if (!draw()) return;
      if (!shown) return;
      const scale = cur.size / S;
      const tr = `translate3d(${(cur.x + cur.px - S / 2).toFixed(1)}px,${(cur.y + cur.py - S / 2).toFixed(1)}px,0) rotate(${(cur.rot + cur.tilt).toFixed(2)}deg) scale(${(scale * cur.sx).toFixed(4)},${scale.toFixed(4)})`;
      if (tr !== lastTransform) { canvas.style.transform = tr; lastTransform = tr; }
      canvas.style.opacity = cur.op.toFixed(3);
      canvas.dataset.layer = cur.front > 0.5 ? 'front' : 'back';
      if (canvas.dataset.section !== ids[i]) canvas.dataset.section = ids[i];
    };
    gsap.ticker.add(tick);

    /* --- start: plakat w slocie -> kanwa po intro; klatki dociągane w tle po pierwszym malowaniu --- */
    const withPreloader = html.getAttribute('data-preloading') === 'true';
    let handoffTimer = 0;
    let idleId = 0;
    const reveal = () => {
      if (disposed) return;
      if (!has(0) && !bitmaps.some(Boolean)) { handoffTimer = window.setTimeout(reveal, 120); return; }
      shown = true;
      lastTransform = '';
      tick();
      html.setAttribute('data-chrome', 'on');
    };
    const startLoading = () => { if (disposed || loading) return; loading = true; pump(); };
    const cancelReady = whenReady(() => {
      const idle = (cb: () => void) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 1200 }) : window.setTimeout(cb, 150));
      idleId = idle(startLoading) as number;
      /* intro nagłówka (maska linii) trwa ~1,4 s: do tego czasu chrom to plakat w linii */
      handoffTimer = window.setTimeout(reveal, withPreloader ? 1500 : 250);
    });

    const onRefresh = () => { dirty = true; };
    ScrollTrigger.addEventListener('refresh', onRefresh);

    return () => {
      disposed = true;
      cancelReady();
      window.clearTimeout(handoffTimer);
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId); else window.clearTimeout(idleId);
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      starts.forEach((s) => s.kill());
      endST?.kill();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      bitmaps.forEach((b) => b?.close());
      html.removeAttribute('data-chrome');
    };
  }, []);

  return <canvas ref={ref} className="chrome-guide" aria-hidden="true" />;
}
