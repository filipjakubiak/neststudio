/*
 * Skaner (branding): concentric arcs, like the reference fingerprint; a line of light slowly scans
 * up and down, and the arcs above it glow while the ones below fall back to embers.
 */
import { AdditiveBlending, Curve, Mesh, PlaneGeometry, ShaderMaterial, TubeGeometry, Vector3 } from 'three';
import type { ObjectDef } from '../stage';
import { blackScene, framedCamera, RED_BLOOM } from './shared';

class Arc3 extends Curve<Vector3> {
  constructor(private r: number, private a0: number, private a1: number) { super(); }
  getPoint(u: number, target = new Vector3()) {
    const a = this.a0 + (this.a1 - this.a0) * u;
    return target.set(Math.cos(a) * this.r, Math.sin(a) * this.r, 0);
  }
}

export const skaner: ObjectDef = {
  id: 'skaner',
  seconds: 10,
  build({ ramp, variant, width, height }) {
    const scene = blackScene();
    const arcMat = new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: { uScan: { value: 0 }, uHot: { value: ramp.body }, uCore: { value: ramp.core }, uTail: { value: ramp.tail } },
      vertexShader: /* glsl */ `varying float vY; void main(){ vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uScan; uniform vec3 uHot, uCore, uTail; varying float vY;
        void main(){
          float above = smoothstep(uScan - 0.02, uScan + 0.12, vY);      // lit side of the scan line
          float near = exp(-pow((vY - uScan) / 0.05, 2.0));               // hottest right at the line
          vec3 c = uTail * 0.25 + uHot * above * 0.55 + mix(uHot, uCore, 0.5) * near * 1.4;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    // arcs open at the bottom, a few gaps, like a stylised print
    const radii = [0.22, 0.36, 0.5, 0.64, 0.78, 0.92];
    radii.forEach((r, i) => {
      const gap = 0.55 + i * 0.05;
      const curve = new Arc3(r, -Math.PI / 2 + gap, Math.PI * 1.5 - gap);
      scene.add(new Mesh(new TubeGeometry(curve, 160, 0.014, 8, false), arcMat));
    });
    // the scan line: a thin bright bar
    const barMat = new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: { uHot: { value: ramp.body }, uCore: { value: ramp.core } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uHot, uCore; varying vec2 vUv;
        void main(){
          float x = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 3.0);
          float y = exp(-pow((vUv.y - 0.5) / 0.18, 2.0));
          gl_FragColor = vec4(mix(uHot, uCore, y * x) * x * y * 2.2, 1.0);
        }`,
    });
    const bar = new Mesh(new PlaneGeometry(2.05, 0.04), barMat);
    bar.position.z = 0.02;
    scene.add(bar);

    const camera = framedCamera(variant, width, height, { dist: 5.2, elev: 0, target: [0, 0, 0] });
    return {
      scene,
      camera,
      bloom: RED_BLOOM,
      update(t) {
        const y = 1.02 * Math.cos(2 * Math.PI * t); // top -> bottom -> top, slow
        arcMat.uniforms.uScan.value = y;
        bar.position.y = y;
      },
    };
  },
};
