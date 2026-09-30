/*
 * Przepływ (automatyzacje) and Proces (4 stages): graphite plates on one line, joined by a tube;
 * a single comet travels from the first plate to the last and lights each plate as it passes.
 * Open tube: the comet enters from nothing and leaves past the end, so the loop has no seam.
 */
import { CatmullRomCurve3, Mesh, PointLight, TubeGeometry, Vector3 } from 'three';
import type { ObjectDef, Variant } from '../stage';
import type { Ramp } from '../palette';
import { cometMaterial, darkMetal } from '../materials';
import { blackScene, fill, framedCamera, plate, RED_BLOOM } from './shared';

function flow(id: string, nodes: number, spacing: number, seconds: number): ObjectDef {
  return {
    id,
    seconds,
    build({ ramp, variant, width, height }: { ramp: Ramp; variant: Variant; width: number; height: number }) {
      const scene = blackScene();
      const span = (nodes - 1) * spacing;
      const centers = Array.from({ length: nodes }, (_, i) => new Vector3(-span / 2 + i * spacing, 0, (i % 2 ? -1 : 1) * 0.18));
      centers.forEach((c) => { const p = plate(0.3, 0.05); p.position.copy(c); scene.add(p); });

      // the tube dips under each plate's edge and rises between them, entering and leaving off-plate
      const pts: Vector3[] = [new Vector3(-span / 2 - spacing * 0.9, 0.05, 0.5)];
      centers.forEach((c, i) => {
        pts.push(new Vector3(c.x - 0.28, 0.06, c.z + 0.28));
        pts.push(new Vector3(c.x + 0.28, 0.06, c.z - 0.28));
        if (i < nodes - 1) pts.push(new Vector3(c.x + spacing / 2, 0.32, (c.z + centers[i + 1].z) / 2));
      });
      pts.push(new Vector3(span / 2 + spacing * 0.9, 0.05, -0.5));
      const path = new CatmullRomCurve3(pts, false, 'centripetal');
      scene.add(new Mesh(new TubeGeometry(path, 800, 0.01, 8, false), darkMetal()));
      const tail = 0.22;
      const mat = cometMaterial(ramp, { tail, gain: 7, open: true });
      scene.add(new Mesh(new TubeGeometry(path, 800, 0.0115, 8, false), mat));
      const light = new PointLight(ramp.light, 1.2, 0, 2);
      scene.add(light);
      fill(scene, ramp, 0.9);

      const wide = variant === 'wide';
      return {
        scene,
        camera: framedCamera(variant, width, height, { dist: wide ? 1.4 + span * 0.95 : 3.0 + span * 1.45, elev: 0.55, target: [0, -0.05, 0] }),
        bloom: RED_BLOOM,
        update(t) {
          const h = -0.02 + t * (1 + tail + 0.04); // from just before the start to past the end + tail
          mat.setHeads([h]);
          const hc = Math.min(1, Math.max(0, h));
          light.position.copy(path.getPointAt(hc)).add(new Vector3(0, 0.12, 0));
          light.intensity = h < 0 || h > 1 ? 0 : 1.2;
        },
      };
    },
  };
}

export const przeplyw = flow('przeplyw', 3, 1.05, 10);
export const proces = flow('proces', 4, 1.25, 14);
