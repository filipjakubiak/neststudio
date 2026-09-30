'use client';

import { useEffect, useRef } from 'react';
import type { PlanEntry } from '@/scene/bands/recipes';
import { motionPaused } from '@/lib/motionPref';

/*
 * The background bands (docs/v2/system.md): one fixed canvas under the page. three.js loads after the
 * first paint (idle), so it never blocks the hero. Rebuilds when the page height changes (FAQ, fonts).
 * Without WebGL the page simply has no bands.
 */
export function BandLayer({ plan }: { plan: PlanEntry[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stopped = false;
    let engine: { stop(): void; rebuild(): void } | null = null;
    let ro: ResizeObserver | null = null;
    let timer = 0;
    const start = async () => {
      const test = document.createElement('canvas');
      if (!test.getContext('webgl2') && !test.getContext('webgl')) return;
      const { startBands } = await import('@/scene/bands/engine');
      await document.fonts?.ready;
      if (stopped || !canvas.current) return;
      engine = startBands(canvas.current, plan, motionPaused);
      canvas.current.dataset.ready = 'true';
      let lastH = document.documentElement.scrollHeight;
      ro = new ResizeObserver(() => {
        const h = document.documentElement.scrollHeight;
        if (Math.abs(h - lastH) < 2) return;
        lastH = h;
        clearTimeout(timer);
        timer = window.setTimeout(() => engine?.rebuild(), 150);
      });
      ro.observe(document.body);
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void start(), { timeout: 1500 });
    else setTimeout(() => void start(), 300);
    return () => { stopped = true; clearTimeout(timer); ro?.disconnect(); engine?.stop(); };
  }, [plan]);

  return <canvas ref={canvas} className="bands" aria-hidden="true" />;
}
