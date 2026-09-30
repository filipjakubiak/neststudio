'use client';

import { useEffect, useState } from 'react';
import { MOTION_EVENT, motionPaused, setMotionPaused } from '@/lib/motionPref';

/* Pause / play all ambient motion on the page (object loops and the light in the bands). */
export function MotionToggle({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const sync = () => setPaused(motionPaused());
    sync();
    window.addEventListener(MOTION_EVENT, sync);
    return () => window.removeEventListener(MOTION_EVENT, sync);
  }, []);
  const label = paused ? play : pause;
  return (
    <button type="button" className="motion-toggle" aria-pressed={paused} aria-label={label} title={label} onClick={() => setMotionPaused(!paused)}>
      <span className="motion-dot" aria-hidden="true" />
    </button>
  );
}
