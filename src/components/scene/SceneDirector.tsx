'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { getSceneBus, type SceneState } from '@/scene/state';

/* Stany sceny dla sekcji bez własnej choreografii (sekcje pinowane sterują sceną same). */
const STATES: Record<string, Partial<SceneState>> = {
  showreel: { weave: 0.35, speed: 0.12, opacity: 1 },
  projects: { ink: 1, weave: 0.5, speed: 0.04, dropVisible: 0, tunnel: 0, opacity: 0.7 },
  services: { ink: 0, weave: 0.62, speed: 0.06, opacity: 0.85 },
  ai: { weave: 0.7, speed: 0.08, opacity: 0.7 },
  process: { weave: 0.82, speed: 0.05, opacity: 0.6 },
  studio: { weave: 0.88, speed: 0.04, opacity: 0.55 },
  faq: { weave: 0.92, speed: 0.03, opacity: 0.45 },
  contact: { weave: 1, speed: 0.02, opacity: 0.9, dropVisible: 1, dropDetach: 1, dropX: 0, dropY: 0, dropZ: 0, dropScale: 0.9, dropAmp: 0.1 },
  footer: { weave: 1, speed: 0.02, opacity: 0.35, dropVisible: 0 },
};

export function SceneDirector() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const bus = getSceneBus();
    const triggers: ScrollTrigger[] = [];
    Object.entries(STATES).forEach(([name, target]) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
      if (!el) return;
      const apply = () => gsap.to(bus.state, { ...target, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' });
      triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', onEnter: apply, onEnterBack: apply }));
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return null;
}
