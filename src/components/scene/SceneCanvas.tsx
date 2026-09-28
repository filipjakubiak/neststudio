'use client';

import { useEffect, useRef, useState } from 'react';
import { getSceneBus } from '@/scene/state';
import { isFinePointer, prefersReducedMotion, whenReady } from '@/lib/motion';
import { SceneFallback } from './SceneFallback';

function webgl2Supported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

function budget(): { threads: number; dpr: number } {
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (coarse) return { threads: mem >= 4 ? 1400 : 900, dpr: Math.min(1.25, window.devicePixelRatio || 1) };
  if (cores >= 8 && mem >= 8) return { threads: 6000, dpr: Math.min(2, window.devicePixelRatio || 1) };
  return { threads: 3500, dpr: Math.min(1.5, window.devicePixelRatio || 1) };
}

/* Fixed canvas pod treścią. Decyduje: scena WebGL albo statyczny fallback. */
export function SceneCanvas({ noWebglNote }: { noWebglNote: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'pending' | 'on' | 'fallback'>('pending');

  useEffect(() => {
    const bus = getSceneBus();
    if (prefersReducedMotion() || !webgl2Supported()) { bus.status = 'fallback'; setMode('fallback'); return; }
    let disposed = false;
    let scene: import('@/scene/NestScene').NestScene | null = null;
    let raf = 0;
    let checkTimer = 0;
    bus.status = 'loading';

    const onPointer = (e: PointerEvent) => { bus.pointer.x = e.clientX; bus.pointer.y = e.clientY; bus.pointer.active = 1; };
    const onLeave = () => { bus.pointer.active = 0; };
    const onResize = () => scene?.resize();
    const onVis = () => { if (!scene) return; if (document.hidden) scene.stop(); else scene.start(); };

    const boot = async () => {
      const { NestScene } = await import('@/scene/NestScene');
      if (disposed || !ref.current) return;
      const b = budget();
      try {
        scene = new NestScene(ref.current, { threads: b.threads, dpr: b.dpr, dropDetail: coarse ? 5 : 6 });
      } catch {
        bus.status = 'fallback'; setMode('fallback'); return;
      }
      scene.start();
      bus.status = 'on';
      document.documentElement.setAttribute('data-scene', 'on');
      setMode('on');
      if (isFinePointer()) {
        window.addEventListener('pointermove', onPointer, { passive: true });
        document.addEventListener('pointerleave', onLeave);
      }
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVis);
      // strażnik wydajności: po ~2 s sprawdź średni czas klatki
      checkTimer = window.setTimeout(() => {
        const avg = scene?.averageFrameMs();
        if (avg == null || !scene) return;
        if (avg > 40) {
          scene.dispose(); scene = null;
          document.documentElement.removeAttribute('data-scene');
          bus.status = 'fallback'; setMode('fallback');
        } else if (avg > 24 && b.threads > 1500) {
          scene.dispose();
          scene = new NestScene(ref.current!, { threads: Math.round(b.threads / 2), dpr: Math.min(1.25, b.dpr), dropDetail: 5 });
          scene.start();
        }
      }, 2600);
    };
    /* start po preloaderze i w wolnej chwili, żeby nie blokować pierwszego malowania */
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let interactionCleanup = () => {};
    const idle = (cb: () => void) => {
      const go = () => { if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout: 1500 }); else window.setTimeout(cb, 200); };
      if (!coarse) { go(); return; }
      /* Na dotyku scena rusza dopiero przy pierwszym geście (scroll/dotyk): strona jest
         interaktywna od razu, kompilacja shaderów nie blokuje startu, a do tego czasu
         w slocie hero stoi chrom z CSS (decyzja D13). */
      let fired = false;
      const once = () => { if (fired) return; fired = true; interactionCleanup(); go(); };
      window.addEventListener('scroll', once, { passive: true, once: true });
      window.addEventListener('touchstart', once, { passive: true, once: true });
      window.addEventListener('pointerdown', once, { passive: true, once: true });
      interactionCleanup = () => { window.removeEventListener('scroll', once); window.removeEventListener('touchstart', once); window.removeEventListener('pointerdown', once); };
    };
    const cancelReady = whenReady(() => { raf = window.requestAnimationFrame(() => idle(boot)); });

    return () => {
      disposed = true;
      cancelReady();
      interactionCleanup();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(checkTimer);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      scene?.dispose();
      document.documentElement.removeAttribute('data-scene');
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="scene-canvas" data-mode={mode} aria-hidden="true" />
      {mode === 'fallback' ? <SceneFallback note={noWebglNote} /> : null}
    </>
  );
}
