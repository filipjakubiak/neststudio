'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/* Scroll positions are measured with the final fonts: re-measure once they arrive (and after images settle). */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);
  return null;
}
