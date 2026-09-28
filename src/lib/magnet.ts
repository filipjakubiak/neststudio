import { gsap } from './gsap';
import { isFinePointer } from './motion';

/* Magnetyzm ±12 px dla [data-magnetic], tylko przy precyzyjnym wskaźniku (DESIGN.md §6). */
export function attachMagnets(root: ParentNode = document): () => void {
  if (!isFinePointer()) return () => {};
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const cleanups = els.map((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(dx * 12); yTo(dy * 12);
    };
    const onLeave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
  });
  return () => cleanups.forEach((c) => c());
}
