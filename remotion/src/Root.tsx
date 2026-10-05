import { Composition } from 'remotion';
import { ChromeJourney } from './ChromeJourney';
import { FPS, FRAMES, RENDER_SIZE } from './journey';
import { Stage, VARIANTS, type PaletteName, type Variant } from './v2/stage';
import { OBJECTS } from './v2/objects';

const V2_FPS = 30;
const PALETTES: PaletteName[] = ['magenta', 'red', 'nest'];

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
      {/* v2 section objects: v2-<object>-<variant>-<palette>, e.g. v2-splot-square-red */}
      {OBJECTS.flatMap((def) =>
        (Object.keys(VARIANTS) as Variant[]).flatMap((variant) =>
          PALETTES.map((palette) => (
            <Composition
              key={`${def.id}-${variant}-${palette}`}
              id={`v2-${def.id}-${variant}-${palette}`}
              component={Stage}
              durationInFrames={Math.round(def.seconds * V2_FPS)}
              fps={V2_FPS}
              width={VARIANTS[variant].width}
              height={VARIANTS[variant].height}
              defaultProps={{ object: def.id, variant, palette }}
            />
          )),
        ),
      )}
    </>
  );
}
