/*
 * Nest v2 look-dev #2: background bands.
 * A band is one long strip of satin graphite, folded like paper: every 90° turn is a fold over a
 * 45° line (small radius = crisp folded corner, large radius = soft wrap with a gradient). Legs are
 * laid out from the real sections on the page, so bands always run through the gaps between texts.
 * Scroll slides the strip in along its path; a slow pool of warm light travels over its surface.
 * Page space: x right, y DOWN (px). Orthographic camera, the world group follows scrollY.
 */
import * as THREE from 'three';
import { foldedStrip } from './fold.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bands');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x0a0a0b, 1);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -4000, 4000);
const world = new THREE.Group();
scene.add(world);

/* ---------- geometry: see fold.js ---------- */

function stripMesh(points, radii, width) {
  const r = foldedStrip(points, radii, width);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(r.pos, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(r.uv, 2));
  geometry.setIndex(r.index);
  geometry.computeVertexNormals();
  // centerline samples for the travelling light
  const nrm = geometry.getAttribute('normal').array;
  const mid = Math.floor(r.segV / 2);
  const center = new Float32Array(r.cols * 3), normal = new Float32Array(r.cols * 3);
  for (let i = 0; i < r.cols; i++) {
    const idx = (i * r.rows + mid) * 3;
    center.set(r.pos.subarray(idx, idx + 3), i * 3);
    normal.set(nrm.subarray(idx, idx + 3), i * 3);
  }
  return { geometry, length: r.length, center, normal, cols: r.cols };
}

/* ---------- material: satin graphite lit by one warm travelling light ---------- */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * vec4(vPos, 1.0);
  }
`;
const fragmentShader = /* glsl */ `
  uniform float uReveal, uWidth, uGain;
  uniform vec3 uLight;      // world position of the travelling light
  uniform float uLightR;    // falloff radius (px)
  uniform vec3 uWarm, uCore, uSteel;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;

  vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

  void main() {
    if (vUv.x > uReveal) discard;
    vec3 N = normalize(vNormal);
    bool back = !gl_FrontFacing;
    if (back) N = -N;
    vec3 V = vec3(0.0, 0.0, 1.0);

    // satin graphite; the back of the strip a touch darker, so folds read
    vec3 albedo = back ? vec3(0.0105, 0.0105, 0.012) : vec3(0.017, 0.017, 0.019);

    // soft cool key from the upper left: gives the folds their shape even in the dark
    vec3 K = normalize(vec3(-0.45, 0.55, 0.7));
    float key = max(dot(N, K), 0.0);
    vec3 col = albedo * (0.55 + 1.1 * key) + uSteel * pow(max(dot(N, normalize(K + V)), 0.0), 18.0) * 0.012;

    // the warm light hovering over the band
    vec3 Lv = uLight - vPos;
    float dist = length(Lv);
    vec3 L = Lv / dist;
    float att = 1.0 / (1.0 + pow(dist / uLightR, 2.0));
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, normalize(L + V)), 0.0), 26.0);
    float I = (diff * 0.5 + spec * 0.55) * att * uGain * 0.8; // a pool of light, not a lamp
    vec3 lightCol = mix(uWarm, uCore, smoothstep(0.5, 1.4, I));
    col += lightCol * I;

    // thin bevel on both edges catches the light (and a trace of steel in the dark)
    float px = 1.0 / uWidth;
    float edge = 1.0 - smoothstep(0.0, 2.5 * px, min(vUv.y, 1.0 - vUv.y));
    col += edge * (uWarm * att * uGain * 0.9 + uSteel * 0.006);

    col = aces(col * 1.4);
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
  }
`;

const LIN = (hex) => new THREE.Color(hex); // three converts sRGB hex to linear
const palette = { warm: LIN('#e8c79a'), core: LIN('#f4f4f5'), steel: LIN('#6f8fb8') };

/* ---------- bands laid out from the page ---------- */

const bands = [];
function layout() {
  const W = innerWidth, H = innerHeight, mobile = W < 900;
  const w = mobile ? 54 : Math.min(150, Math.max(90, W * 0.085));
  // the empty space between two sections: last content of one, first content of the next
  const gap = (a, b) => {
    const A = document.querySelector(a), B = document.querySelector(b);
    const end = A.lastElementChild.getBoundingClientRect().bottom + scrollY;
    const start = B.firstElementChild.getBoundingClientRect().top + scrollY;
    return (end + start) / 2;
  };
  const hero = '#hero', stats = '#stats', who = '#who', services = '#services', about = '#about', cta = '#cta';
  return [
    {
      // enters from the right between hero and stats, folds down beside the numbers, folds away left
      points: [[W + w, gap(hero, stats)], [W * (mobile ? 0.86 : 0.8), gap(hero, stats)], [W * (mobile ? 0.86 : 0.8), gap(stats, who)], [-3 * w, gap(stats, who)]],
      radii: [6, mobile ? 10 : 34],
      width: w,
      period: 22, phase: 0,
    },
    {
      // enters from the left between services and about, soft wrap down the middle, crisp fold out right
      points: [[-w, gap(services, about)], [W * (mobile ? 0.88 : 0.5), gap(services, about)], [W * (mobile ? 0.88 : 0.5), gap(about, cta)], [W + 3 * w, gap(about, cta)]],
      radii: [mobile ? 14 : 46, 6],
      width: w,
      period: 26, phase: 0.45,
    },
  ];
}

function build() {
  for (const b of bands) { world.remove(b.mesh); b.mesh.geometry.dispose(); }
  bands.length = 0;
  for (const def of layout()) {
    const strip = stripMesh(def.points, def.radii, def.width);
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, side: THREE.DoubleSide,
      uniforms: {
        uReveal: { value: 0 }, uWidth: { value: def.width }, uGain: { value: 1.0 },
        uLight: { value: new THREE.Vector3() }, uLightR: { value: def.width * 1.6 },
        uWarm: { value: palette.warm }, uCore: { value: palette.core }, uSteel: { value: palette.steel },
      },
    });
    const mesh = new THREE.Mesh(strip.geometry, material);
    world.add(mesh);
    const ys = def.points.map((q) => q[1]);
    bands.push({ ...def, ...strip, mesh, material, top: Math.min(...ys), bottom: Math.max(...ys), reveal: REDUCED ? strip.length : 0 });
  }
}

function resize() {
  const W = innerWidth, H = innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H, false);
  camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
  camera.updateProjectionMatrix();
  build();
}

const tmp = new THREE.Vector3(), tmpN = new THREE.Vector3();
function frame(now) {
  const t = now / 1000, H = innerHeight;
  world.position.y = scrollY;
  for (const b of bands) {
    // slide in: the strip's head travels along its path while its section comes into view
    const span = b.bottom - b.top + H * 0.55;
    const p = Math.min(1, Math.max(0, (scrollY + H * 0.92 - b.top) / span));
    const target = REDUCED ? b.length : (1 - Math.pow(1 - p, 2)) * b.length * 1.02;
    b.reveal += (target - b.reveal) * 0.08;
    b.material.uniforms.uReveal.value = b.reveal;

    // one warm light drifting along the revealed strip, fading in and out at its ends
    const cyc = REDUCED ? 0.5 : ((t / b.period + b.phase) % 1);
    const u = cyc * Math.max(b.reveal, 1);
    const i = Math.min(b.cols - 1, Math.round((u / b.length) * (b.cols - 1)));
    tmp.fromArray(b.center, i * 3); tmpN.fromArray(b.normal, i * 3);
    if (tmpN.z < 0) tmpN.negate();
    b.material.uniforms.uLight.value.copy(tmp).addScaledVector(tmpN, b.width * 0.55).add(world.position);
    b.material.uniforms.uGain.value = Math.sin(Math.PI * cyc) ** 0.8 * Math.min(1, b.reveal / (b.width * 3));
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

addEventListener('resize', resize);
document.fonts.ready.then(() => { resize(); requestAnimationFrame(frame); });
