import { InstancedBufferGeometry, BufferAttribute, InstancedBufferAttribute, Sphere, Vector3, Vector2, ShaderMaterial, CustomBlending, AddEquation, OneFactor, OneMinusSrcAlphaFactor, DoubleSide, Mesh } from 'three';
import { simplex3 } from './noise.glsl';
import { buildNestLayout } from './nestLayout';

const SEGMENTS = 22;

/* Światło krawędziowe: gradient "chrome spectral" z DESIGN.md §2 (Rim Steel → Rim Bone → Rim Warm),
   w bloku jasnym Rim Sheen zamiast światła. Wartości sRGB, shader pisze je wprost (bez tone mappingu). */
const glsl3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `vec3(${(((n >> 16) & 255) / 255).toFixed(4)}, ${(((n >> 8) & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`;
};
export const RIM = { steel: '#6F8FB8', bone: '#F4F4F5', warm: '#E8C79A', sheen: '#46505C' } as const;

/* Promień gniazda w świecie; zwężany na wąskich ekranach (setAspect). */
const NEST_SCALE = 2.05;

const vertexShader = /* glsl */ `
precision highp float;
attribute float aT;
attribute float aSide;
attribute vec4 aSeed;
attribute vec4 aNestU;
attribute vec4 aNestV;
attribute vec4 aNestP;
attribute vec2 aLit;
uniform float uTime, uWeave, uChaos, uSpeed, uTunnel, uSpread, uNestScale, uWidth, uInk;
uniform vec2 uResolution;
uniform vec3 uPointer;
uniform vec2 uNestOffset;
varying float vT;
varying float vSide;
varying float vAlpha;
varying float vDepth;
varying float vLit;
varying vec3 vRimCol;
${simplex3}

const vec3 RIM_STEEL = ${glsl3(RIM.steel)};
const vec3 RIM_BONE = ${glsl3(RIM.bone)};
const vec3 RIM_WARM = ${glsl3(RIM.warm)};
const vec3 NEST_RADII = vec3(1.14, 0.7, 1.0);

vec3 gN = vec3(0.0, 0.0, 1.0); // przybliżona normalna gniazda w punkcie środkowym (świat)
vec3 gL = vec3(0.0);            // punkt w układzie gniazda (do przemiatania światła)

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

/* Gniazdo: łuk wokół własnej osi nici (u, v, a = u×v) na zdeformowanej powłoce.
   Bryła = elipsoida × garby niskiej częstotliwości × nierówna grubość ściany, z płytką misą u góry,
   pochylona do widza i powoli dryfująca. Zero snoise: same sinusy od kierunku, parametry z CPU. */
vec3 nestPos(float t) {
  float s = t - 0.5;
  float ang = aNestU.w + s * aNestV.w;
  float lat = aNestP.x + s * aNestP.y;
  vec3 ax = cross(aNestU.xyz, aNestV.xyz);
  vec3 d = normalize((cos(ang) * aNestU.xyz + sin(ang) * aNestV.xyz) * cos(lat) + ax * sin(lat));
  float tm = uTime * 0.045;
  float lump = 0.15 * sin(2.3 * d.x + 1.7 * d.y + tm + 0.4) * cos(1.9 * d.z - 1.1 * d.x + 0.7)
             + 0.09 * sin(3.7 * d.y + 2.9 * d.z - tm * 1.3 + 2.0)
             + 0.05 * sin(5.3 * d.x - 4.1 * d.z + tm * 0.7 + 1.3)
             + 0.05 * sin(4.6 * d.y - 3.8 * d.x + 2.4 * d.z - tm + 0.5)
             + 0.17 * max(dot(d, vec3(-0.62, -0.28, 0.73)), 0.0); // cięższy bok: sylwetka niesymetryczna
  float thick = 0.5 + 0.5 * sin(2.6 * d.x - 1.9 * d.z + 0.8 * d.y + 0.9);
  float r = (1.0 + lump) * mix(1.0, aNestP.z, thick);
  r *= 1.0 + 0.03 * sin(s * aNestV.w * 4.0 + aNestU.w * 3.0);           // ręczne nawinięcie
  r *= 1.0 + 0.025 * sin(uTime * 0.35 + d.x * 1.7 + d.z * 1.3);          // oddech bryły
  r += aNestP.w * smoothstep(0.45, 1.0, t) * smoothstep(0.45, 1.0, t);                               // luźne końce uciekają
  vec3 p = d * r * NEST_RADII;
  // płytka misa przesunięta od środka
  vec2 q = p.xz - vec2(0.14, -0.1);
  float bowl = max(0.0, 1.0 - dot(q, q) / 0.62);
  p.y -= 0.62 * bowl * bowl * smoothstep(-0.15, 0.55, d.y) * (0.75 + 0.25 * aNestP.z);
  gL = p;
  // dryf wokół osi gniazda, potem stałe pochylenie (misa lekko do widza) i przechył
  float yaw = uTime * 0.018 + 0.6;
  float cy = cos(yaw), sy = sin(yaw);
  vec3 n = normalize(d / NEST_RADII);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  n = vec3(cy * n.x + sy * n.z, n.y, -sy * n.x + cy * n.z);
  const float cx = 0.9111, sx = 0.4121;  // 0.425 rad wokół X
  const float cz = 0.9820, sz = -0.1889; // -0.19 rad wokół Z
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  n = vec3(n.x, n.y * cx - n.z * sx, n.y * sx + n.z * cx);
  p = vec3(p.x * cz - p.y * sz, p.x * sz + p.y * cz, p.z);
  gN = vec3(n.x * cz - n.y * sz, n.x * sz + n.y * cz, n.z);
  p *= uNestScale;
  p.xy += uNestOffset;
  return p;
}

vec3 tunnelPos(float t) {
  float a = aSeed.w * 6.2832 + t * 0.6;
  float r = 1.4 + aSeed.x * 3.5;
  float z = fract(aSeed.y + uTime * (0.08 + aSeed.z * 0.12)) * 26.0 - 20.0 + t * 3.0;
  return vec3(r * cos(a), r * sin(a), z);
}

vec3 pathPos(float t, float w) {
  // gałęzie spójne w obrębie instancji: w pełni splecione nici nie liczą szumu chaosu
  vec3 p;
  if (w <= 0.0) p = chaosPos(t);
  else if (w >= 1.0) p = nestPos(t);
  else p = mix(chaosPos(t), nestPos(t), w);
  if (uTunnel > 0.0) p = mix(p, tunnelPos(t), uTunnel);
  return p;
}

void main() {
  vT = aT;
  vSide = aSide;
  float w = smoothstep(0.0, 1.0, clamp((uWeave - aSeed.w * 0.55) / 0.45, 0.0, 1.0));
  // mniej nici niż kiedyś, więc każda trochę mocniejsza; w gnieździe gęściej niż w chaosie
  vAlpha = (0.07 + aSeed.z * 0.17) * mix(0.85, 1.0, w);
  float dt = 1.0 / ${SEGMENTS}.0;
  vec3 pn = pathPos(min(aT + dt, 1.0), w);
  vec3 pb = pathPos(max(aT - dt, 0.0), w);
  vec3 p = pathPos(aT, w); // ostatni: gN i gL dotyczą tego punktu

  // światło krawędziowe na wybranych niciach (aLit.x), tylko w splocie
  vLit = 0.0;
  vRimCol = RIM_BONE;
  float litW = aLit.x * w * (1.0 - uTunnel * 0.7);
  if (litW > 0.0) {
    vec3 v = normalize(cameraPosition - p);
    float rim = pow(1.0 - abs(dot(gN, v)), 3.0);
    vec2 toP = uPointer.xy - uNestOffset;
    vec3 L = normalize(mix(vec3(0.55, 0.62, 0.55), normalize(vec3(toP, 1.4)), uPointer.z * 0.6));
    float g = dot(gN, L);
    vec3 c = g < 0.0 ? mix(RIM_BONE, RIM_STEEL, smoothstep(0.0, -0.75, g)) : mix(RIM_BONE, RIM_WARM, smoothstep(0.15, 0.9, g));
    // wolne przemiatanie: pasmo światła przechodzi przez bryłę co ~30 s
    float sc = dot(gL, vec3(0.78, 0.42, 0.46));
    float band = mod(uTime * 0.13 + aLit.y * 0.08, 4.2) - 2.1;
    float sweep = exp(-pow((sc - band) / 0.3, 2.0));
    float near = exp(-dot(p.xy - uPointer.xy, p.xy - uPointer.xy) / 1.2) * uPointer.z;
    vLit = litW * (0.05 + rim * (1.0 + 0.6 * near) + sweep * 0.6);
    vRimCol = mix(c, RIM_BONE, sweep * 0.55);
  }

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  vec4 cp = projectionMatrix * mv;
  vec4 cn = projectionMatrix * modelViewMatrix * vec4(pn, 1.0);
  vec4 cb = projectionMatrix * modelViewMatrix * vec4(pb, 1.0);
  vec2 sp = cp.xy / cp.w * uResolution * 0.5;
  vec2 sn = cn.xy / cn.w * uResolution * 0.5;
  vec2 sb = cb.xy / cb.w * uResolution * 0.5;
  vec2 dir = normalize((sn - sp) + (sp - sb) + vec2(0.0001, 0.0));
  vec2 nrm = vec2(-dir.y, dir.x);
  vec2 offset = nrm * aSide * uWidth * (0.5 + 0.2 * min(vLit, 1.0));
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
varying float vLit;
varying vec3 vRimCol;
const vec3 RIM_SHEEN = ${glsl3(RIM.sheen)};
void main() {
  float edge = 1.0 - abs(vSide);
  float a = smoothstep(0.0, 0.7, edge);
  float taper = smoothstep(0.0, 0.18, vT) * smoothstep(1.0, 0.82, vT);
  // bliższe nici wyraźniejsze, dalsze giną w tle
  float depthFade = clamp((15.0 - vDepth) / 9.0, 0.15, 1.0);
  float shape = a * taper * depthFade * uOpacity;
  vec3 light = vec3(0.957, 0.957, 0.961);
  vec3 dark = vec3(0.04, 0.04, 0.043);
  float lit = min(vLit, 1.6);
  // blok jasny: zamiast blasku ciemniejszy, stalowy połysk
  vec3 col = mix(light, mix(dark, RIM_SHEEN, min(lit, 1.0) * 0.8), uInk);
  float alpha = shape * vAlpha * (1.0 + lit * 0.6 * uInk);
  // premultiplied: część "over" (kolor * alfa) + część addytywna (blask bez alfy) na ciemnym tle
  vec3 glow = vRimCol * lit * shape * 1.2 * (1.0 - uInk);
  if (alpha < 0.003 && lit * (1.0 - uInk) < 0.01) discard;
  gl_FragColor = vec4(col * alpha + glow, alpha);
}
`;

export class ThreadField {
  mesh: Mesh;
  material: ShaderMaterial;
  count: number;
  litCount: number;

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

    // nici ze światłem są na końcu bufora: rysują się ostatnie, blask ląduje na wierzchu
    const layout = buildNestLayout(count);
    this.litCount = layout.litCount;
    geo.setAttribute('aSeed', new InstancedBufferAttribute(layout.seed, 4));
    geo.setAttribute('aNestU', new InstancedBufferAttribute(layout.nestU, 4));
    geo.setAttribute('aNestV', new InstancedBufferAttribute(layout.nestV, 4));
    geo.setAttribute('aNestP', new InstancedBufferAttribute(layout.nestP, 4));
    geo.setAttribute('aLit', new InstancedBufferAttribute(layout.lit, 2));
    geo.instanceCount = count;
    geo.boundingSphere = new Sphere(new Vector3(), 60);

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: DoubleSide, // wstęgi zmieniają kierunek nawinięcia wzdłuż krzywej; culling wyciąłby połowę
      // premultiplied "over" + addytywny blask w jednym przebiegu (alfa 0 = czysty add)
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      uniforms: {
        uTime: { value: 0 },
        uWeave: { value: 0 },
        uChaos: { value: 1 },
        uSpeed: { value: 0.05 },
        uTunnel: { value: 0 },
        uSpread: { value: 4.2 },
        uNestScale: { value: NEST_SCALE },
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

  /* Wąski ekran: mniejsze gniazdo, żeby mieściło się w kadrze telefonu. */
  setAspect(aspect: number) {
    this.material.uniforms.uNestScale.value = NEST_SCALE * Math.min(1, Math.max(0.52, aspect / 1.1));
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
