'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { getSceneBus, type SceneState } from '@/scene/state';

/* Stany sceny dla sekcji bez własnej choreografii (sekcje pinowane sterują sceną same). */
const STATES: Record<string, Partial<SceneState>> = {
  showreel: { weave: 0.35, speed: 0.12, opacity: 1, nestX: 0, nestY: 0 },
  projects: { ink: 1, weave: 0.5, speed: 0.04, dropVisible: 0, tunnel: 0, opacity: 0.6, nestX: -1.6, nestY: 0.4 },
  services: { ink: 0, weave: 0.62, speed: 0.06, opacity: 0.6, nestX: 2.4, nestY: -0.3 },
  ai: { weave: 0.7, speed: 0.08, opacity: 0.5, nestX: 2.8, nestY: 0.6 },
  process: { weave: 0.82, speed: 0.05, opacity: 0.45, nestX: 2.2, nestY: 1.2 },
  studio: { weave: 0.88, speed: 0.04, opacity: 0.5, nestX: -2.4, nestY: 0 },
  faq: { weave: 0.92, speed: 0.03, opacity: 0.4, nestX: 2.6, nestY: -0.4 },
  contact: { weave: 1, speed: 0.02, opacity: 0.85, nestX: 2.3, nestY: 0 },
  footer: { weave: 1, speed: 0.02, opacity: 0.3, dropVisible: 0, nestX: 2.3, nestY: 2.2 },
};

/* Wąski ekran (< 768 px): kadr ma ~1,45 jednostki od środka do krawędzi, więc gniazdo z pozycji desktopowych
   (x ≈ 2,3) zniknęłoby za krawędzią. 70% przesunięcia = gniazdo wchodzi w kadr bokiem, mniej pod tekstem; w kontakcie
   środek, zgodnie z choreografią Contact.tsx (inaczej ten tween nadpisywał jej nestX). */
function narrowNest(name: string, target: Partial<SceneState>): Partial<SceneState> {
  if (typeof window === 'undefined' || window.innerWidth >= 768 || target.nestX === undefined) return {};
  return { nestX: name === 'contact' ? 0 : target.nestX * 0.7 };
}

export function SceneDirector() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const bus = getSceneBus();
    const triggers: ScrollTrigger[] = [];
    Object.entries(STATES).forEach(([name, target]) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
      if (!el) return;
      const apply = () => gsap.to(bus.state, { ...target, ...narrowNest(name, target), duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' });
      triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', onEnter: apply, onEnterBack: apply }));
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return null;
}
