/*
 * One switch for all ambient motion (object loops + the light in the bands): WCAG 2.2.2 pause control.
 * Reduced-motion users start paused; the choice is remembered per browser (a convenience only).
 */
export const MOTION_EVENT = 'nest:motion';
const KEY = 'nest_motion';

export function motionPaused(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.motion === 'paused';
}

export function setMotionPaused(paused: boolean) {
  document.documentElement.dataset.motion = paused ? 'paused' : 'on';
  try { localStorage.setItem(KEY, paused ? 'paused' : 'on'); } catch { /* private mode: not remembered */ }
  window.dispatchEvent(new Event(MOTION_EVENT));
}

/** Inline script for <head>: sets data-motion before the first paint. */
export const MOTION_BOOT = `(function(){try{var s=localStorage.getItem('${KEY}');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.dataset.motion=s?s:(r?'paused':'on');}catch(e){document.documentElement.dataset.motion='on';}})();`;
