/* Media queries i pomocniki dla gsap.matchMedia (DESIGN.md §7). */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 1024px)';
export const MOBILE = '(max-width: 1023px)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOTION_REDUCED).matches;
}

export function isFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(FINE_POINTER).matches;
}

/* Globalne zdarzenie gotowości (po preloaderze). */
export const READY_EVENT = 'nest:ready';
/* Tuż przed podniesieniem kurtyny preloadera: hero chowa linie pod maską, niewidocznie dla użytkownika. */
export const PREPARE_EVENT = 'nest:prepare';

declare global {
  interface Window { __nestReady?: boolean; __lenis?: import('lenis').default | null }
}

export function whenReady(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.__nestReady) { cb(); return () => {}; }
  const handler = () => cb();
  window.addEventListener(READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(READY_EVENT, handler);
}

export function whenPrepare(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => cb();
  window.addEventListener(PREPARE_EVENT, handler, { once: true });
  return () => window.removeEventListener(PREPARE_EVENT, handler);
}

export function markPrepare() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PREPARE_EVENT));
}

export function markReady() {
  if (typeof window === 'undefined') return;
  window.__nestReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}
