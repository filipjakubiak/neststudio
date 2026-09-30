/*
 * Siatka (AI): a cube lattice of glowing points; a slow wave of light crosses it diagonally.
 * Loop-safe: the lattice turns 90° per loop (its own symmetry) and the wave starts and ends outside it.
 */
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Points, ShaderMaterial, Vector3 } from 'three';
import type { ObjectDef } from '../stage';
import { blackScene, framedCamera, RED_BLOOM } from './shared';

const N = 7, S = 0.62; // points per side, half extent

export const siatka: ObjectDef = {
  id: 'siatka',
  seconds: 12,
  build({ ramp, variant, width, height }) {
    const scene = blackScene();
    const pos: number[] = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
      const f = (v: number) => (v / (N - 1)) * 2 * S - S;
      pos.push(f(i), f(j), f(k));
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    const mat = new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: {
        uWave: { value: 0 }, uDir: { value: new Vector3(1, 0.6, 0.35).normalize() }, uScale: { value: height * 0.5 },
        uCore: { value: ramp.core }, uGold: { value: ramp.gold }, uBody: { value: ramp.body }, uTail: { value: ramp.tail },
      },
      vertexShader: /* glsl */ `
        uniform float uWave, uScale; uniform vec3 uDir;
        varying float vI;
        void main() {
          vec3 wp = (modelMatrix * vec4(position, 1.0)).xyz;
          float d = dot(wp, uDir) - uWave;
          vI = exp(-d * d / 0.16);                        // the passing wave
          vec4 mv = viewMatrix * vec4(wp, 1.0);
          gl_PointSize = uScale * (0.05 + 0.04 * vI) / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uCore, uGold, uBody, uTail;
        varying float vI;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.2, r);
          vec3 c = mix(uBody * 0.55, uBody, smoothstep(0.0, 0.5, vI));
          c = mix(c, uGold, smoothstep(0.75, 0.95, vI));
          c = mix(c, uCore, smoothstep(0.95, 1.0, vI) * smoothstep(0.5, 0.0, r));
          gl_FragColor = vec4(c * a * (0.75 + 2.8 * vI), 1.0); // every point stays visible, the wave lifts it
        }`,
    });
    const rig = new Group();
    rig.rotation.x = 0.42;
    const spin = new Group();
    spin.add(new Points(geo, mat));
    rig.add(spin);
    scene.add(rig);
    const reach = S * 1.8 + 1.3; // wave starts and ends clear of the lattice (seamless)
    return {
      scene,
      camera: framedCamera(variant, width, height, { dist: 6.4, elev: 0.3, target: [0, 0, 0] }),
      bloom: RED_BLOOM,
      update(t) {
        spin.rotation.y = t * (Math.PI / 2);
        mat.uniforms.uWave.value = -reach + 2 * reach * t;
      },
    };
  },
};
