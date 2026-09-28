import { InstancedBufferGeometry, BufferAttribute, InstancedBufferAttribute, Sphere, Vector3, Vector2, ShaderMaterial, NormalBlending, DoubleSide, Mesh } from 'three';
import { simplex3 } from './noise.glsl';

const SEGMENTS = 22;

const vertexShader = /* glsl */ `
precision highp float;
attribute float aT;
attribute float aSide;
attribute vec4 aSeed;
attribute vec3 aTorus;
uniform float uTime, uWeave, uChaos, uSpeed, uTunnel, uSpread, uRm, uRr, uWidth, uInk;
uniform vec2 uResolution;
uniform vec3 uPointer;
uniform vec2 uNestOffset;
varying float vT;
varying float vSide;
varying float vAlpha;
varying float vDepth;
${simplex3}

vec3 chaosPos(float t) {
  vec3 base = (aSeed.xyz * 2.0 - 1.0) * vec3(uSpread * 1.7, uSpread, uSpread * 0.7);
  vec3 dir = normalize(vec3(sin(aSeed.w * 6.2832), cos(aSeed.x * 6.2832), (aSeed.y - 0.5) * 0.8));
  float len = 0.8 + aSeed.z * 1.8;
  vec3 p = base + dir * (t - 0.5) * len;
  float ph = uTime * uSpeed;
  vec3 n = vec3(
    snoise(p * 0.55 + vec3(ph, 0.0, aSeed.w * 9.0)),
    snoise(p * 0.55 + vec3(0.0, ph, aSeed.x * 9.0)),
    snoise(p * 0.55 + vec3(aSeed.y * 9.0, 0.0, ph)));
  p += n * uChaos * 0.9;
  // delikatne odpychanie od wskaźnika
  vec2 d = p.xy - uPointer.xy;
  float dist = length(d);
  p.xy += normalize(d + 0.0001) * (0.35 / (dist * dist + 0.35)) * uPointer.z * 0.35;
  return p;
}

vec3 nestPos(float t) {
  float theta = aTorus.x + (t - 0.5) * 1.1;
  float phi = aTorus.y + (t - 0.5) * aTorus.z;
  float r = uRm + uRr * cos(phi);
  vec3 p = vec3(r * cos(theta), r * sin(theta), uRr * sin(phi));
  float c = cos(0.55), s = sin(0.55);
  p = vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  p += vec3(snoise(p * 1.4 + uTime * 0.12), snoise(p * 1.4 + 3.1 + uTime * 0.12), 0.0) * 0.05;
  p.xy += uNestOffset;
  return p;
}

vec3 tunnelPos(float t) {
  float a = aSeed.w * 6.2832 + t * 0.6;
  float r = 1.4 + aSeed.x * 3.5;
  float z = fract(aSeed.y + uTime * (0.08 + aSeed.z * 0.12)) * 26.0 - 20.0 + t * 3.0;
  return vec3(r * cos(a), r * sin(a), z);
}

vec3 pathPos(float t) {
  float w = smoothstep(0.0, 1.0, clamp((uWeave - aSeed.w * 0.55) / 0.45, 0.0, 1.0));
  vec3 p = mix(chaosPos(t), nestPos(t), w);
  return mix(p, tunnelPos(t), uTunnel);
}

void main() {
  vT = aT;
  vSide = aSide;
  vAlpha = 0.06 + aSeed.z * 0.16;
  float dt = 1.0 / ${SEGMENTS}.0;
  vec3 p = pathPos(aT);
  vec3 pn = pathPos(min(aT + dt, 1.0));
  vec3 pp = pathPos(max(aT - dt, 0.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  vec4 cp = projectionMatrix * mv;
  vec4 cn = projectionMatrix * modelViewMatrix * vec4(pn, 1.0);
  vec4 cb = projectionMatrix * modelViewMatrix * vec4(pp, 1.0);
  vec2 sp = cp.xy / cp.w * uResolution * 0.5;
  vec2 sn = cn.xy / cn.w * uResolution * 0.5;
  vec2 sb = cb.xy / cb.w * uResolution * 0.5;
  vec2 dir = normalize((sn - sp) + (sp - sb) + vec2(0.0001, 0.0));
  vec2 nrm = vec2(-dir.y, dir.x);
  vec2 offset = nrm * aSide * uWidth * 0.5;
  cp.xy += offset / (uResolution * 0.5) * cp.w;
  gl_Position = cp;
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform float uInk, uOpacity;
varying float vT;
varying float vSide;
varying float vAlpha;
varying float vDepth;
void main() {
  float edge = 1.0 - abs(vSide);
  float a = smoothstep(0.0, 0.7, edge);
  float taper = smoothstep(0.0, 0.18, vT) * smoothstep(1.0, 0.82, vT);
  // bliższe nici wyraźniejsze, dalsze giną w tle
  float depthFade = clamp((15.0 - vDepth) / 9.0, 0.15, 1.0);
  a *= depthFade;
  vec3 light = vec3(0.957, 0.957, 0.961);
  vec3 dark = vec3(0.04, 0.04, 0.043);
  vec3 col = mix(light, dark, uInk);
  float alpha = a * taper * vAlpha * uOpacity;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`;

export class ThreadField {
  mesh: Mesh;
  material: ShaderMaterial;
  count: number;

  constructor(count: number, resolution: Vector2, dpr: number) {
    this.count = count;
    const geo = new InstancedBufferGeometry();
    const points = SEGMENTS + 1;
    const positions = new Float32Array(points * 2 * 3);
    const aT = new Float32Array(points * 2);
    const aSide = new Float32Array(points * 2);
    for (let i = 0; i < points; i++) {
      for (let s = 0; s < 2; s++) {
        const idx = i * 2 + s;
        aT[idx] = i / SEGMENTS;
        aSide[idx] = s === 0 ? -1 : 1;
      }
    }
    const index: number[] = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      index.push(a, b, c, b, d, c);
    }
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aT', new BufferAttribute(aT, 1));
    geo.setAttribute('aSide', new BufferAttribute(aSide, 1));
    geo.setIndex(index);

    const seed = new Float32Array(count * 4);
    const torus = new Float32Array(count * 3);
    let r = 1234567 + count;
    const rnd = () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; };
    for (let i = 0; i < count; i++) {
      seed[i * 4] = rnd(); seed[i * 4 + 1] = rnd(); seed[i * 4 + 2] = rnd(); seed[i * 4 + 3] = rnd();
      torus[i * 3] = rnd() * Math.PI * 2;
      torus[i * 3 + 1] = rnd() * Math.PI * 2;
      torus[i * 3 + 2] = 1.5 + rnd() * 3.5;
    }
    geo.setAttribute('aSeed', new InstancedBufferAttribute(seed, 4));
    geo.setAttribute('aTorus', new InstancedBufferAttribute(torus, 3));
    geo.instanceCount = count;
    geo.boundingSphere = new Sphere(new Vector3(), 60);

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: DoubleSide, // wstęgi zmieniają kierunek nawinięcia wzdłuż krzywej; culling wyciąłby połowę
      blending: NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uWeave: { value: 0 },
        uChaos: { value: 1 },
        uSpeed: { value: 0.05 },
        uTunnel: { value: 0 },
        uSpread: { value: 4.2 },
        uRm: { value: 2.3 },
        uRr: { value: 0.9 },
        uWidth: { value: 1.0 * dpr },
        uInk: { value: 0 },
        uOpacity: { value: 1 },
        uResolution: { value: resolution },
        uPointer: { value: new Vector3(0, 0, 0) },
        uNestOffset: { value: new Vector2(0, 0) },
      },
    });
    this.mesh = new Mesh(geo, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
