/*
 * Look-dev v2 #1: "Splot" (hero object).
 * Three threads woven into a nest rim around a matte graphite slab. On every thread a comet of
 * light travels; the comet is the only real light source (point light at its head), so the slab
 * and the dark threads are lit by the object itself, like the reference render.
 * Seamless loop: every motion is periodic in t = frame / durationInFrames.
 * Rendered on pure black; the site composites it with mix-blend-mode: screen on Noir.
 */
import { useLayoutEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useFrame, useThree } from '@react-three/fiber';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  ShaderMaterial,
  Shape,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export type SplotProps = { palette: 'nest' | 'red' };

/* Light ramp, linear RGB. Core -> body -> tail. Nest: Bone -> Rim Warm -> dark amber. */
const RAMPS = {
  nest: {
    core: new Color(1.0, 0.96, 0.9),
    body: new Color(1.0, 0.48, 0.16),
    tail: new Color(0.45, 0.09, 0.01),
    light: new Color(1.0, 0.7, 0.45),
  },
  red: {
    core: new Color(1.0, 0.85, 0.7),
    body: new Color(1.0, 0.2, 0.05),
    tail: new Color(0.35, 0.01, 0.0),
    light: new Color(1.0, 0.3, 0.12),
  },
} as const;

const THREADS = 3;
const COMETS_PER_THREAD = 1;
const TAIL = 0.24; // fraction of the loop

function threadCurve(i: number) {
  const phase = (i / THREADS) * Math.PI * 2;
  const pts: Vector3[] = [];
  const N = 240;
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2;
    // weave: height and radius both oscillate 3x per lap, offset per thread -> over/under crossings
    const r = 1.12 + 0.05 * Math.cos(3 * a + phase + Math.PI / 2);
    const y = 0.2 * Math.sin(3 * a + phase);
    pts.push(new Vector3(r * Math.cos(a), y, r * Math.sin(a)));
  }
  return new CatmullRomCurve3(pts, true, 'centripetal');
}

const cometVertex = /* glsl */ `
  varying float vS;
  varying float vFacing;
  void main() {
    vS = uv.x;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;
const cometFragment = /* glsl */ `
  uniform float uHeads[${COMETS_PER_THREAD}];
  uniform float uTail;
  uniform float uGain;
  uniform vec3 uCore, uBody, uTailCol;
  varying float vS;
  varying float vFacing;
  void main() {
    vec3 col = vec3(0.0);
    float neon = 0.25 + 0.75 * pow(vFacing, 1.8); // hot core line, dimmer toward the tube's silhouette
    for (int i = 0; i < ${COMETS_PER_THREAD}; i++) {
      float d = fract(uHeads[i] - vS);           // 0 at the head, grows behind it
      float k = clamp(1.0 - d / uTail, 0.0, 1.0);
      float body = pow(k, 1.5);
      float head = exp(-d * 260.0);
      vec3 c = mix(uTailCol, uBody, smoothstep(0.15, 0.75, k));
      c = mix(c, uCore, smoothstep(0.88, 1.0, k));
      col += c * body + uCore * head * 0.35;
    }
    gl_FragColor = vec4(col * uGain * neon, 1.0);
  }
`;

/* Film grain + gentle vignette after tone mapping: dithers gradients for video encoding. */
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
      // grain only where there is light: pure black must stay 0 so screen-blending leaves no box
      float luma = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb += (h(vUv * 1000.0) - 0.5) * 0.012 * smoothstep(0.01, 0.06, luma);
      // frame edge fades to true black
      vec2 e = abs(vUv - 0.5);
      c.rgb *= smoothstep(0.5, 0.4, max(e.x, e.y));
      gl_FragColor = vec4(max(c.rgb, 0.0), 1.0);
    }
  `,
};

function buildWorld(palette: SplotProps['palette']) {
  const ramp = RAMPS[palette];
  const scene = new Scene();
  scene.background = new Color(0, 0, 0);
  const rig = new Group();
  scene.add(rig);

  // Slab: rounded square, beveled, matte graphite ceramic, laid flat as a diamond.
  const s = 0.66, rr = 0.08;
  const shape = new Shape();
  shape.moveTo(-s + rr, -s);
  shape.lineTo(s - rr, -s); shape.quadraticCurveTo(s, -s, s, -s + rr);
  shape.lineTo(s, s - rr); shape.quadraticCurveTo(s, s, s - rr, s);
  shape.lineTo(-s + rr, s); shape.quadraticCurveTo(-s, s, -s, s - rr);
  shape.lineTo(-s, -s + rr); shape.quadraticCurveTo(-s, -s, -s + rr, -s);
  const slabGeo = new ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 8 });
  slabGeo.center();
  const slab = new Mesh(
    slabGeo,
    new MeshPhysicalMaterial({ color: new Color("#45454c"), roughness: 0.48, metalness: 0.15, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
  );
  slab.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
  scene.add(slab); // 4-fold symmetric: stays still, only the 3-fold threads turn (keeps the loop seamless)

  const darkMat = new MeshStandardMaterial({ color: new Color('#1c1c20'), roughness: 0.32, metalness: 0.7 });
  const comets: { mat: ShaderMaterial; curve: CatmullRomCurve3; lights: PointLight[] }[] = [];
  for (let i = 0; i < THREADS; i++) {
    const curve = threadCurve(i);
    rig.add(new Mesh(new TubeGeometry(curve, 900, 0.011, 10, true), darkMat));
    const mat = new ShaderMaterial({
      vertexShader: cometVertex,
      fragmentShader: cometFragment,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uHeads: { value: new Array(COMETS_PER_THREAD).fill(0) },
        uTail: { value: TAIL },
        uGain: { value: 3.6 },
        uCore: { value: ramp.core },
        uBody: { value: ramp.body },
        uTailCol: { value: ramp.tail },
      },
    });
    rig.add(new Mesh(new TubeGeometry(curve, 900, 0.0125, 10, true), mat));
    const lights: PointLight[] = [];
    for (let c = 0; c < COMETS_PER_THREAD; c++) {
      const l = new PointLight(ramp.light, 0.42, 0, 2);
      rig.add(l);
      lights.push(l);
    }
    comets.push({ mat, curve, lights });
  }

  // Faint cool rim from behind (Rim Steel), so the dark side of the slab edge still reads.
  const rim = new DirectionalLight(new Color('#6f8fb8'), 0.18);
  rim.position.set(-2, 1.5, -3);
  scene.add(rim);

  return { scene, rig, comets };
}

function SplotObject({ frame, handle, palette }: { frame: number; handle: number; palette: SplotProps['palette'] }) {
  const { gl } = useThree();
  const { width, height, durationInFrames } = useVideoConfig();

  const world = useMemo(() => buildWorld(palette), [palette]);
  const camera = useMemo(() => {
    const cam = new PerspectiveCamera(28, width / height, 0.1, 50);
    cam.position.set(0, 2.6, 5.6);
    cam.lookAt(0, -0.05, 0);
    return cam;
  }, [width, height]);

  const composer = useMemo(() => {
    const r = gl as unknown as WebGLRenderer;
    r.toneMapping = ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.outputColorSpace = SRGBColorSpace;
    const c = new EffectComposer(r);
    c.setPixelRatio(1);
    c.setSize(width, height);
    c.addPass(new RenderPass(world.scene, camera));
    c.addPass(new UnrealBloomPass(new Vector2(width, height), 0.6, 0.22, 1.0));
    c.addPass(new OutputPass());
    c.addPass(new ShaderPass(GrainShader));
    return c;
  }, [gl, world, camera, width, height]);

  // A positive-priority subscriber stops R3F from auto-rendering its own (empty) scene over ours.
  useFrame(() => {}, 1);

  // Pure function of the frame: deterministic, parallel-safe, loops without a seam.
  const t = frame / durationInFrames;
  // No rig rotation: turning the rim would also shift the comets and break the seam. Light is the only motion.
  world.comets.forEach(({ mat, curve, lights }, i) => {
    const heads = mat.uniforms.uHeads.value as number[];
    for (let c = 0; c < COMETS_PER_THREAD; c++) {
      const h = (t + i / THREADS / COMETS_PER_THREAD + c / COMETS_PER_THREAD) % 1;
      heads[c] = h;
      lights[c].position.copy(curve.getPointAt(h));
    }
  });

  useLayoutEffect(() => {
    const grain = composer.passes[composer.passes.length - 1] as ShaderPass;
    grain.uniforms.uSeed.value = (frame % 97) * 1.37;
    composer.render();
    gl.getContext().finish();
    continueRender(handle);
  }, [composer, gl, frame, handle]);

  return null;
}

export function Splot({ palette }: SplotProps) {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender('splot frame ' + frame), [frame]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        <SplotObject frame={frame} handle={handle} palette={palette} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
}
