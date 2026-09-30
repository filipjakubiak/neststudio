import { Composition } from 'remotion';
import { ChromeJourney } from './ChromeJourney';
import { FPS, FRAMES, RENDER_SIZE } from './journey';
import { Splot } from './lookdev/Splot';

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ChromeJourney"
        component={ChromeJourney}
        durationInFrames={FRAMES}
        fps={FPS}
        width={RENDER_SIZE}
        height={RENDER_SIZE}
      />
      {/* v2 look-dev: hero object, 4 s seamless loop */}
      <Composition id="Splot" component={Splot} durationInFrames={120} fps={30} width={1200} height={1200} defaultProps={{ palette: 'nest' as const }} />
      <Composition id="SplotRed" component={Splot} durationInFrames={120} fps={30} width={1200} height={1200} defaultProps={{ palette: 'red' as const }} />
    </>
  );
}
