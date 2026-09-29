import { Composition } from 'remotion';
import { ChromeJourney } from './ChromeJourney';
import { FPS, FRAMES, RENDER_SIZE } from './journey';

export function RemotionRoot() {
  return (
    <Composition
      id="ChromeJourney"
      component={ChromeJourney}
      durationInFrames={FRAMES}
      fps={FPS}
      width={RENDER_SIZE}
      height={RENDER_SIZE}
    />
  );
}
