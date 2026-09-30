/*
 * v2 material library, shared by every section object (so all renders read as one family).
 *  - cometMaterial: a light travelling along a tube (additive, hot core -> body -> tail, neon falloff)
 *  - graphite: matte ceramic slab; darkMetal: the unlit tubes the comets run on
 */
import { AdditiveBlending, Color, MeshPhysicalMaterial, MeshStandardMaterial, ShaderMaterial } from 'three';
import type { Ramp } from './palette';

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
const cometFragment = (count: number) => /* glsl */ `
  uniform float uHeads[${count}];
  uniform float uTail, uGain;
  uniform vec3 uCore, uGold, uBody, uTailCol;
  varying float vS;
  varying float vFacing;
  void main() {
    vec3 col = vec3(0.0);
    float neon = 0.25 + 0.75 * pow(vFacing, 1.8); // hot core line, dimmer toward the tube's silhouette
    for (int i = 0; i < ${count}; i++) {
      float d = fract(uHeads[i] - vS);             // 0 at the head, grows behind it
      float k = clamp(1.0 - d / uTail, 0.0, 1.0);
      float body = pow(k, 1.5);
      float head = exp(-d * 260.0);
      // tail (ember) -> body (red) -> gold -> core, as measured on the reference comets
      vec3 c = mix(uTailCol, uBody, smoothstep(0.05, 0.55, k));
      c = mix(c, uGold, smoothstep(0.86, 0.975, k));
      c = mix(c, uCore, smoothstep(0.975, 1.0, k));
      // gold/white carry far more luminance than red: damp them so the bloom halo stays red
      float hot = smoothstep(0.86, 1.0, k);
      col += c * body * mix(1.0, 0.42, hot) + uCore * head * 0.1;
    }
    gl_FragColor = vec4(col * uGain * neon, 1.0);
  }
`;

/** One or more comets on a tube whose uv.x runs 0..1 along its length. Set heads with setHeads(). */
export function cometMaterial(ramp: Ramp, opts: { count?: number; tail?: number; gain?: number } = {}) {
  const count = opts.count ?? 1;
  const mat = new ShaderMaterial({
    vertexShader: cometVertex,
    fragmentShader: cometFragment(count),
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uHeads: { value: new Array(count).fill(0) },
      uTail: { value: opts.tail ?? 0.24 },
      uGain: { value: opts.gain ?? 3.6 },
      uCore: { value: ramp.core },
      uGold: { value: ramp.gold },
      uBody: { value: ramp.body },
      uTailCol: { value: ramp.tail },
    },
  });
  return Object.assign(mat, {
    setHeads(heads: number[]) {
      const h = mat.uniforms.uHeads.value as number[];
      heads.forEach((v, i) => (h[i] = ((v % 1) + 1) % 1));
    },
  });
}

export const graphite = () =>
  new MeshPhysicalMaterial({ color: new Color('#6a6a70'), roughness: 0.5, metalness: 0.15, clearcoat: 0.35, clearcoatRoughness: 0.35 });

export const darkMetal = () => new MeshStandardMaterial({ color: new Color('#3a3a3e'), roughness: 0.4, metalness: 0.5 });
