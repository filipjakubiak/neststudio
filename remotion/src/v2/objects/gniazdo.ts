/*
 * Gniazdo (CTA): many threads woven into a nest; three comets travel through it.
 * The finale of the page's light: same threads as Splot, now closed into a shape that holds.
 */
import { CatmullRomCurve3, Mesh, PointLight, TubeGeometry, Vector3 } from 'three';
import type { ObjectDef } from '../stage';
import { cometMaterial, darkMetal } from '../materials';
import { blackScene, fill, framedCamera, RED_BLOOM } from './shared';

// deterministic pseudo-random
const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function strand(i: number) {
  // a tilted ring around a flattened sphere (a bowl), wobbling in and out
  const tilt = (rand(i) - 0.5) * 2.4, yaw = rand(i + 7) * Math.PI * 2, wob = 2 + Math.floor(rand(i + 13) * 3);
  const pts: Vector3[] = [];
  for (let k = 0; k < 200; k++) {
    const a = (k / 200) * Math.PI * 2;
    const r = 1 + 0.06 * Math.sin(wob * a + i);
    const p = new Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.1, Math.sin(a) * r);
    p.applyAxisAngle(new Vector3(1, 0, 0), tilt).applyAxisAngle(new Vector3(0, 1, 0), yaw);
    p.y *= 0.78; // slightly flattened: a nest, not a ball
    pts.push(p);
  }
  return new CatmullRomCurve3(pts, true, 'centripetal');
}

export const gniazdo: ObjectDef = {
  id: 'gniazdo',
  seconds: 14,
  build({ ramp, variant, width, height }) {
    const scene = blackScene();
    const metal = darkMetal();
    const lit = [2, 7, 11];
    const comets: { curve: CatmullRomCurve3; mat: ReturnType<typeof cometMaterial>; light: PointLight; k: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const curve = strand(i);
      scene.add(new Mesh(new TubeGeometry(curve, 500, 0.011, 6, true), metal));
      const k = lit.indexOf(i);
      if (k >= 0) {
        const mat = cometMaterial(ramp, { tail: 0.3, gain: 6.5 });
        scene.add(new Mesh(new TubeGeometry(curve, 500, 0.0125, 6, true), mat));
        const light = new PointLight(ramp.light, 0.8, 0, 2);
        scene.add(light);
        comets.push({ curve, mat, light, k });
      }
    }
    fill(scene, ramp, 0.9);
    return {
      scene,
      camera: framedCamera(variant, width, height, { dist: 5.6, elev: 0.5, target: [0, -0.05, 0] }),
      bloom: RED_BLOOM,
      update(t) {
        comets.forEach(({ curve, mat, light, k }) => {
          const h = (t + k / 3) % 1;
          mat.setHeads([h]);
          light.position.copy(curve.getPointAt(h));
        });
      },
    };
  },
};
