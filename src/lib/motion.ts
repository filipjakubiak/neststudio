/* Media queries for gsap.matchMedia. Native scroll everywhere: input and content move 1:1 (apple-design §2). */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 1024px)';
export const MOBILE = '(max-width: 1023px)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOTION_REDUCED).matches;
}

/* GSAP stand-in for the CSS spring (tokens.css --spring): a critically damped curve, no overshoot. */
export const SPRING = 'expo.out';
