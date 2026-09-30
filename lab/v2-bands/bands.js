/*
 * Nest v2 background bands (live WebGL layer under the page).
 *   fold.js    strip geometry, folded like paper at every corner
 *   recipes.js named shapes (cross, drop, hook) + fold styles
 *   layout.js  resolves the page's plan against the live layout (gaps, widths, collisions)
 *   bands.js   this file: rendering, scroll reveal, the travelling light
 * The page declares its plan in <script type="application/json" id="band-plan">.
 * Palette: measured on the reference render (red, 30.09).
 */
import * as THREE from 'three';
import { foldedStrip } from './fold.js';
import { resolvePlan } from './layout.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bands');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x000000, 1);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -4000, 4000);
const world = new THREE.Group();
scene.add(world);
const plan = JSON.parse(document.getElementById('band-plan').textContent);

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
  uniform float uReveal, uWidth, uGain, uLightR;
  uniform vec3 uLight;
  uniform vec3 uEmber, uMid, uHot, uCore;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;

  // same curve family as the rendered objects: ember -> mid -> hot red -> peach core
  vec3 ramp(float i) {
    vec3 c = mix(uEmber, uMid, smoothstep(0.0, 0.18, i));
    c = mix(c, uHot, smoothstep(0.15, 0.6, i));
    return mix(c, uCore, smoothstep(1.2, 2.4, i));
  }

  void main() {
    if (vUv.x > uReveal) discard;
    vec3 N = normalize(vNormal);
    bool back = !gl_FrontFacing;
    if (back) N = -N;
    vec3 V = vec3(0.0, 0.0, 1.0);

    // unlit strip: near black with a warm cast; the back side darker so folds read
    vec3 base = back ? vec3(0.006, 0.0025, 0.0025) : vec3(0.012, 0.005, 0.005);
    vec3 K = normalize(vec3(-0.45, 0.55, 0.7));
    vec3 col = base * (0.6 + 1.2 * max(dot(N, K), 0.0));

    // the red light passing through the band
    vec3 Lv = uLight - vPos;
    float dist = length(Lv);
    vec3 L = Lv / dist;
    float att = 1.0 / (1.0 + pow(dist / uLightR, 2.0));
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, normalize(L + V)), 0.0), 10.0);
    float I = (diff * 0.8 + spec * 0.25) * att * uGain; // broad smooth gradient, not a hotspot
    col += ramp(I) * I;

    // thin bevel on both edges: a red line of light where the pool reaches the edge
    float px = 1.0 / uWidth;
    float edge = 1.0 - smoothstep(0.0, 2.5 * px, min(vUv.y, 1.0 - vUv.y));
    col += edge * uHot * att * uGain * 0.7;

    gl_FragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2)), 1.0);
  }
`;

const C = (hex) => new THREE.Color(hex); // sRGB hex -> linear
const palette = { ember: C('#3a0007'), mid: C('#49181b'), hot: C('#eb2e2a'), core: C('#f8ccb8') };

const bands = [];
function build() {
  for (const b of bands) { world.remove(b.mesh); b.mesh.geometry.dispose(); b.material.dispose(); }
  bands.length = 0;
  for (const def of resolvePlan(plan)) {
    const strip = stripMesh(def.points, def.radii, def.width);
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, side: THREE.DoubleSide,
      uniforms: {
        uReveal: { value: 0 }, uWidth: { value: def.width }, uGain: { value: 1 },
        uLight: { value: new THREE.Vector3() }, uLightR: { value: def.width * 3.4 },
        uEmber: { value: palette.ember }, uMid: { value: palette.mid }, uHot: { value: palette.hot }, uCore: { value: palette.core },
      },
    });
    const mesh = new THREE.Mesh(strip.geometry, material);
    world.add(mesh);
    bands.push({ ...def, ...strip, mesh, material, reveal: REDUCED ? strip.length : 0 });
  }
}

function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.left = 0; camera.right = innerWidth; camera.top = 0; camera.bottom = -innerHeight;
  camera.updateProjectionMatrix();
  build();
}

const tmp = new THREE.Vector3(), tmpN = new THREE.Vector3();
function frame(now) {
  const t = now / 1000, H = innerHeight;
  world.position.y = scrollY;
  for (const b of bands) {
    // slide in: the strip's head travels along its path while its gaps come into view
    const span = b.bottom - b.top + H * 0.55;
    const p = Math.min(1, Math.max(0, (scrollY + H * 0.92 - b.top) / span));
    const target = REDUCED ? b.length : (1 - (1 - p) ** 2) * b.length * 1.02;
    b.reveal += (target - b.reveal) * 0.08;
    b.material.uniforms.uReveal.value = b.reveal;

    // one light drifting along the revealed strip, fading in and out at its ends
    const cyc = REDUCED ? 0.5 : (t / b.period + b.phase) % 1;
    const u = cyc * Math.max(b.reveal, 1);
    const i = Math.min(b.cols - 1, Math.round((u / b.length) * (b.cols - 1)));
    tmp.fromArray(b.center, i * 3);
    tmpN.fromArray(b.normal, i * 3);
    if (tmpN.z < 0) tmpN.negate();
    b.material.uniforms.uLight.value.copy(tmp).addScaledVector(tmpN, b.width * 0.7).add(world.position);
    b.material.uniforms.uGain.value = Math.sin(Math.PI * cyc) ** 0.8 * Math.min(1, b.reveal / (b.width * 3)) * 1.25;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

let pending = 0;
addEventListener('resize', () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(resize); });
document.fonts.ready.then(() => { resize(); requestAnimationFrame(frame); });
