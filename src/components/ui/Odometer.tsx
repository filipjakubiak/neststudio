'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MOTION_OK } from '@/lib/motion';

/*
 * Rolling number: every digit is a 0-9 strip (twice, so it can spin a full turn) that lands on its
 * value, left digits first. The resting state is the final number in CSS, so without JS, with reduced
 * motion or before the trigger fires, the reader always sees the real value. Non-digits stay static;
 * a placeholder like "[00]" is shown as plain text.
 */
export function Odometer({ value, className = '', delay = 0 }: { value: string; className?: string; delay?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const placeholder = value.startsWith('[');

  useGSAP(() => {
    if (placeholder) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const strips = gsap.utils.toArray<HTMLElement>('.odo-strip', root.current);
      // animate the CSS variable only (the transform stays in CSS), from 0 to the digit's resting value
      strips.forEach((el, i) => {
        gsap.fromTo(el, { '--odo': 0 }, {
          '--odo': Number(el.dataset.to),
          duration: 1.6 + i * 0.22,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 92%', once: true },
        });
      });
    });
  }, { scope: root, dependencies: [value] });

  if (placeholder) return <span className={`odo ${className}`.trim()} data-placeholder>{value}</span>;

  return (
    <span ref={root} className={`odo ${className}`.trim()} aria-label={value} role="text">
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo-digit" aria-hidden="true">
            <span className="odo-strip" data-to={10 + Number(ch)} style={{ '--odo': 10 + Number(ch) } as React.CSSProperties}>
              {'01234567890123456789'.split('').map((d, k) => <span key={k}>{d}</span>)}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">{ch}</span>
        ),
      )}
    </span>
  );
}
