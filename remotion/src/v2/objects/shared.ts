/* Helpers shared by v2 objects: plates, framing per variant, the quiet fill light every object gets. */
import { Color, DirectionalLight, ExtrudeGeometry, HemisphereLight, Mesh, PerspectiveCamera, Scene, Shape } from 'three';
import type { Ramp } from '../palette';
import type { Variant } from '../stage';
import { graphite } from '../materials';

export function roundedSquare(s: number, r: number) {
  const sh = new Shape();
  sh.moveTo(-s + r, -s);
  sh.lineTo(s - r, -s); sh.quadraticCurveTo(s, -s, s, -s + r);
  sh.lineTo(s, s - r); sh.quadraticCurveTo(s, s, s - r, s);
  sh.lineTo(-s + r, s); sh.quadraticCurveTo(-s, s, -s, s - r);
  sh.lineTo(-s, -s + r); sh.quadraticCurveTo(-s, -s, -s + r, -s);
  return sh;
}

/** A flat graphite plate lying in the XZ plane, turned 45° like the reference's "diamond". */
export function plate(half: number, depth = 0.06) {
  const g = new ExtrudeGeometry(roundedSquare(half, half * 0.12), { depth, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 8 });
  g.center();
  const m = new Mesh(g, graphite());
  m.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
  return m;
}

/** Camera at a fixed elevation; wider/taller frames step back so the object keeps its size. */
export function framedCamera(variant: Variant, width: number, height: number, opts: { dist?: number; elev?: number; target?: [number, number, number]; fov?: number } = {}) {
  const cam = new PerspectiveCamera(opts.fov ?? 28, width / height, 0.1, 60);
  const base = opts.dist ?? 5.6;
  const dist = variant === 'wide' ? base * 1.1 : variant === 'tall' ? base * 1.18 : base;
  const elev = opts.elev ?? 0.46;
  cam.position.set(0, dist * elev, dist);
  const [x, y, z] = opts.target ?? [0, -0.05, 0];
  cam.lookAt(x, y, z);
  return cam;
}

/** Warm rim from behind, soft top light, a whisper of ambient: plates read, tubes read as grey lines. */
export function fill(scene: Scene, ramp: Ramp, top = 0.55) {
  const rim = new DirectionalLight(ramp.tail, 0.25);
  rim.position.set(-2, 1.5, -3);
  scene.add(rim);
  const t = new DirectionalLight(new Color('#ffd9d2'), top);
  t.position.set(0.3, 4, 1);
  scene.add(t);
  scene.add(new HemisphereLight(new Color('#ffffff'), new Color('#000000'), 0.35));
}

export function blackScene() {
  const s = new Scene();
  s.background = new Color(0, 0, 0);
  return s;
}

export const RED_BLOOM = { strength: 0.95, radius: 0.18, threshold: 0.3 };
