/*
 * Kostka (strony www): a graphite block; light runs around its top edge and spills down the front
 * corner, like the reference's "Transaction Guardian". Static block, only the light moves.
 */
import { CatmullRomCurve3, Mesh, PointLight, TubeGeometry, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { ObjectDef } from '../stage';
import { cometMaterial, darkMetal, graphite } from '../materials';
import { blackScene, fill, framedCamera, RED_BLOOM } from './shared';

const H = 0.62; // half size

export const kostka: ObjectDef = {
  id: 'kostka',
  seconds: 12,
  build({ ramp, variant, width, height }) {
    const scene = blackScene();
    const block = new Mesh(new RoundedBoxGeometry(H * 2, H * 2, H * 2, 5, 0.035), graphite());
    block.rotation.y = Math.PI / 4;
    scene.add(block);

    // the top edge as a closed loop, just proud of the surface
    const e = H + 0.004, y = H + 0.004;
    const corners = [[-e, -e], [e, -e], [e, e], [-e, e]].map(([x, z]) => {
      const c = Math.cos(Math.PI / 4), s = Math.sin(Math.PI / 4);
      return new Vector3(x * c + z * s, y, -x * s + z * c);
    });
    const pts: Vector3[] = [];
    for (let i = 0; i < 4; i++) for (let k = 0; k < 20; k++) pts.push(corners[i].clone().lerp(corners[(i + 1) % 4], k / 20));
    const loop = new CatmullRomCurve3(pts, true, 'catmullrom', 0.02);
    scene.add(new Mesh(new TubeGeometry(loop, 600, 0.008, 8, true), darkMetal()));
    const mat = cometMaterial(ramp, { count: 2, tail: 0.3, gain: 7 });
    scene.add(new Mesh(new TubeGeometry(loop, 600, 0.0095, 8, true), mat));
    const lights = [0, 1].map(() => { const l = new PointLight(ramp.light, 0.9, 0, 2); scene.add(l); return l; });

    fill(scene, ramp, 1.0); // the block must read as a solid, not only its glowing edge
    return {
      scene,
      camera: framedCamera(variant, width, height, { dist: 6, elev: 0.5, target: [0, -0.1, 0] }),
      bloom: RED_BLOOM,
      update(t) {
        const heads = [t, t + 0.5];
        mat.setHeads(heads);
        heads.forEach((h, i) => lights[i].position.copy(loop.getPointAt(h % 1)).add(new Vector3(0, 0.08, 0)));
      },
    };
  },
};
