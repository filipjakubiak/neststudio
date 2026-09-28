import { Group, Mesh, ShaderMaterial, ExtrudeGeometry, Vector3, ShapePath, type Shape } from 'three';
import { TITLE_GLYPHS } from './titleGlyphs';
import { layoutTitle, type TitleLayout } from './titleLayout';

/* Litery "NEST STUDIO": ekstruzja konturów Space Grotesk z fazą, jeden materiał z czerwonym światłem
   kluczowym (docs/titles.md §6). Jednostki lokalne: cap height = 1; grupa jest skalowana do boksu DOM. */

export interface LetterOffset { x: number; y: number; z: number; rx: number; ry: number; rz: number }

export const LETTER_DEPTH = 0.42;
const BEVEL_T = 0.035;
const BEVEL_S = 0.03;

/* Minimalny parser ścieżek glifów (M, L, H, V, Q, Z; współrzędne bezwzględne, tak generuje fontTools),
   zamiast SVGLoader (ok. 60 kB mniej w chunku three). Dziury (kontrwyginięcia) rozwiązuje ShapePath.toShapes(). */
function glyphToShapes(d: string): Shape[] {
  const sp = new ShapePath();
  const re = /([MLHVQZ])([^MLHVQZ]*)/g;
  const num = /-?\d*\.?\d+/g;
  let m: RegExpExecArray | null;
  let x = 0, y = 0;
  while ((m = re.exec(d))) {
    const n = (m[2].match(num) ?? []).map(Number);
    switch (m[1]) {
      case 'M':
        x = n[0]; y = n[1]; sp.moveTo(x, y);
        for (let i = 2; i + 1 < n.length; i += 2) { x = n[i]; y = n[i + 1]; sp.lineTo(x, y); }
        break;
      case 'L':
        for (let i = 0; i + 1 < n.length; i += 2) { x = n[i]; y = n[i + 1]; sp.lineTo(x, y); }
        break;
      case 'H':
        for (const v of n) { x = v; sp.lineTo(x, y); }
        break;
      case 'V':
        for (const v of n) { y = v; sp.lineTo(x, y); }
        break;
      case 'Q':
        for (let i = 0; i + 3 < n.length; i += 4) { sp.quadraticCurveTo(n[i], n[i + 1], n[i + 2], n[i + 3]); x = n[i + 2]; y = n[i + 3]; }
        break;
      case 'Z':
        sp.currentPath?.closePath();
        break;
    }
  }
  return sp.toShapes();
}

const vertexShader = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vWorldN;
varying vec3 vObjN;
void main() {
  vObjN = normal;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uLight;
uniform float uIntensity;
uniform vec3 uRed;
uniform vec3 uFace;
uniform float uRim;
uniform float uEdge;
uniform float uOpacity;
varying vec3 vWorldPos;
varying vec3 vWorldN;
varying vec3 vObjN;
void main() {
  vec3 N = normalize(vWorldN);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 Ld = uLight - vWorldPos;
  float dist = length(Ld);
  vec3 L = Ld / max(dist, 0.001);
  float att = 1.0 / (1.0 + 0.03 * dist * dist);
  float nz = abs(normalize(vObjN).z);
  float bevel = smoothstep(0.03, 0.3, nz) * smoothstep(0.985, 0.7, nz);
  float side = 1.0 - smoothstep(0.0, 0.08, nz);
  float ndl = dot(N, L);
  float wrap = clamp((ndl + 0.45) / 1.45, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 56.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);
  vec3 red = uRed * uIntensity;
  float edges = clamp(side + bevel, 0.0, 1.0);
  // lico: prawie czarny grafit z ledwie widocznym śladem czerwieni od światła
  vec3 col = uFace * (0.5 + 0.5 * wrap) + uRed * 0.045 * wrap * att * (1.0 - edges);
  // boki ekstruzji: rozproszone światło z owinięciem
  col += red * att * 0.3 * wrap * side;
  // faza: świecąca krawędź (to jest sygnatura: cienka, jasna linia wokół litery)
  col += red * att * bevel * uEdge * (0.45 + 0.75 * max(ndl, 0.0));
  // rim (fresnel): kanty widziane pod kątem
  col += red * fres * uRim * (0.2 + 0.8 * edges);
  // odbłysk: mocny na fazach i bokach, śladowy na licu
  col += mix(uRed, vec3(1.0), 0.35) * uIntensity * att * spec * 1.4 * (0.06 + edges);
  gl_FragColor = vec4(col, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export class Titles {
  group = new Group();
  letters: Mesh[] = [];
  offsets: LetterOffset[] = [];
  material: ShaderMaterial;
  layout: TitleLayout;

  constructor(curveSegments = 12) {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uLight: { value: new Vector3(0.4, 1.4, 3) },
        uIntensity: { value: 1.3 },
        uRed: { value: new Vector3(1.0, 0.027, 0.010) },   // #FF2E1A w przestrzeni liniowej (DESIGN.md §2)
        uFace: { value: new Vector3(0.0058, 0.0058, 0.0068) }, // grafit #141416 liniowo
        uRim: { value: 1 },
        uEdge: { value: 1 },
        uOpacity: { value: 1 },
      },
    });
    for (const g of TITLE_GLYPHS) {
      const geo = new ExtrudeGeometry(glyphToShapes(g.d), {
        depth: LETTER_DEPTH, bevelEnabled: true, bevelThickness: BEVEL_T, bevelSize: BEVEL_S, bevelOffset: 0, bevelSegments: 2, curveSegments,
      });
      geo.translate(0, 0, -(LETTER_DEPTH + BEVEL_T)); // lico z przodu w z = 0, bryła w głąb
      const mesh = new Mesh(geo, this.material);
      mesh.frustumCulled = false;
      this.letters.push(mesh);
      this.offsets.push({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
      this.group.add(mesh);
    }
    this.layout = layoutTitle(false);
    this.group.visible = false;
  }

  setLayout(stacked: boolean) {
    if (this.layout.stacked !== stacked) this.layout = layoutTitle(stacked);
  }

  /* Pozycja litery = układ (środek boksu w origin grupy) + offset sekwencji. Wołane co klatkę. */
  apply() {
    const { letters, width, height } = this.layout;
    for (let i = 0; i < this.letters.length; i++) {
      const p = letters[i], o = this.offsets[i], m = this.letters[i];
      m.position.set(p.x - width / 2 + o.x, p.y - height / 2 + o.y, o.z);
      m.rotation.set(o.rx, o.ry, o.rz);
    }
  }

  resetOffsets() {
    for (const o of this.offsets) { o.x = 0; o.y = 0; o.z = 0; o.rx = 0; o.ry = 0; o.rz = 0; }
  }

  dispose() {
    for (const m of this.letters) m.geometry.dispose();
    this.material.dispose();
  }
}
