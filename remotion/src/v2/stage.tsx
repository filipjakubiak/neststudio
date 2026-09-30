/*
 * v2 object stage: one renderer setup shared by every section object.
 * An object module only builds its scene + camera and says how it moves for a loop phase t in [0, 1).
 * The stage owns: tone mapping, bloom, grain (light-only, edges to true black), deterministic frames,
 * and the Remotion/R3F handshake (delayRender, no R3F auto-render over our composer).
 */
import { useLayoutEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useFrame, useThree } from '@react-three/fiber';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { NeutralToneMapping, ACESFilmicToneMapping, PerspectiveCamera, Scene, SRGBColorSpace, ToneMapping, Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RAMPS, Ramp } from './palette';
import { OBJECTS } from './objects';

/* Framings an object can be rendered in; the site picks the one its layout slot needs. */
export const VARIANTS = {
  square: { width: 1200, height: 1200 }, // bento tile, hero side
  wide: { width: 1920, height: 1080 }, // full-bleed band of a section
  tall: { width: 1080, height: 1440 }, // narrow column, mobile hero
} as const;
export type Variant = keyof typeof VARIANTS;
export type PaletteName = keyof typeof RAMPS;

export type ObjectCtx = { ramp: Ramp; variant: Variant; width: number; height: number };
export type SceneObject = {
  scene: Scene;
  camera: PerspectiveCamera;
  /** t: loop phase in [0, 1). Must be periodic: update(0) and update(1) look identical. */
  update(t: number): void;
  bloom?: { strength: number; radius: number; threshold: number };
  exposure?: number;
  toneMapping?: 'neutral' | 'aces';
};
export type ObjectDef = {
  id: string;
  /** loop length in seconds (slow and subtle: 8 to 14 s) */
  seconds: number;
  build(ctx: ObjectCtx): SceneObject;
};

/* Grain only where there is light (pure black must stay 0 for screen-blending) + vignette + edge fade. */
const GrainShader = {
  uniforms: { tDiffuse: { value: null }, uSeed: { value: 0 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uSeed; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uSeed) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float v = smoothstep(0.95, 0.35, length(vUv - 0.5));
      c.rgb *= mix(0.55, 1.0, v);
      float luma = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb += (h(vUv * 1000.0) - 0.5) * 0.012 * smoothstep(0.01, 0.06, luma);
      vec2 e = abs(vUv - 0.5);
      c.rgb *= smoothstep(0.5, 0.4, max(e.x, e.y));
      gl_FragColor = vec4(max(c.rgb, 0.0), 1.0);
    }
  `,
};

const TONE: Record<NonNullable<SceneObject['toneMapping']>, ToneMapping> = {
  neutral: NeutralToneMapping, // keeps saturated reds red (ACES drifts them to orange)
  aces: ACESFilmicToneMapping,
};

function StageInner({ def, variant, palette, frame, handle }: { def: ObjectDef; variant: Variant; palette: PaletteName; frame: number; handle: number }) {
  const { gl } = useThree();
  const { width, height, durationInFrames } = useVideoConfig();
  const obj = useMemo(() => def.build({ ramp: RAMPS[palette], variant, width, height }), [def, variant, palette, width, height]);

  const composer = useMemo(() => {
    const r = gl as unknown as WebGLRenderer;
    r.toneMapping = TONE[obj.toneMapping ?? 'neutral'];
    r.toneMappingExposure = obj.exposure ?? 1;
    r.outputColorSpace = SRGBColorSpace;
    const c = new EffectComposer(r);
    c.setPixelRatio(1);
    c.setSize(width, height);
    c.addPass(new RenderPass(obj.scene, obj.camera));
    const b = obj.bloom ?? { strength: 0.6, radius: 0.22, threshold: 1.0 };
    c.addPass(new UnrealBloomPass(new Vector2(width, height), b.strength, b.radius, b.threshold));
    c.addPass(new OutputPass());
    c.addPass(new ShaderPass(GrainShader));
    return c;
  }, [gl, obj, width, height]);

  // positive priority: R3F must not auto-render its own (empty) scene over ours
  useFrame(() => {}, 1);

  obj.update(frame / durationInFrames);

  useLayoutEffect(() => {
    const grain = composer.passes[composer.passes.length - 1] as ShaderPass;
    grain.uniforms.uSeed.value = (frame % 97) * 1.37;
    composer.render();
    gl.getContext().finish();
    continueRender(handle);
  }, [composer, gl, frame, handle]);

  return null;
}

/* Props travel as JSON (Remotion serializes them), so the object is referenced by id, not passed. */
export type StageProps = { object: string; variant: Variant; palette: PaletteName };

export function Stage({ object, variant, palette }: StageProps) {
  const def = OBJECTS.find((o) => o.id === object);
  if (!def) throw new Error(`Unknown v2 object "${object}"`);
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender(`${def.id} frame ${frame}`), [def.id, frame]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <ThreeCanvas width={width} height={height} dpr={1} gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}>
        <StageInner def={def} variant={variant} palette={palette} frame={frame} handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
}
