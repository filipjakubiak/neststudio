/*
 * Splot (hero): three threads woven into a nest rim around a matte graphite slab.
 * One comet per thread is the only real light (point light at its head). Slow: 12 s per lap.
 * Loop-safe: the slab (4-fold) and the rim (3-fold) never rotate; only the light moves.
 */
import { CatmullRomCurve3, Color, DirectionalLight, HemisphereLight, ExtrudeGeometry, Mesh, PerspectiveCamera, PointLight, Scene, Shape, TubeGeometry, Vector3 } from 'three';
import type { ObjectDef } from '../stage';
import { cometMaterial, darkMetal, graphite } from '../materials';

const THREADS = 3;

function threadCurve(i: number) {
  const phase = (i / THREADS) * Math.PI * 2;
  const pts: Vector3[] = [];
  for (let k = 0; k < 240; k++) {
    const a = (k / 240) * Math.PI * 2;
    // weave: height and radius oscillate 3x per lap, offset per thread -> over/under crossings
    const r = 1.12 + 0.05 * Math.cos(3 * a + phase + Math.PI / 2);
    pts.push(new Vector3(r * Math.cos(a), 0.2 * Math.sin(3 * a + phase), r * Math.sin(a)));
  }
  return new CatmullRomCurve3(pts, true, 'centripetal');
}

function roundedSquare(s: number, r: number) {
  const sh = new Shape();
  sh.moveTo(-s + r, -s);
  sh.lineTo(s - r, -s); sh.quadraticCurveTo(s, -s, s, -s + r);
  sh.lineTo(s, s - r); sh.quadraticCurveTo(s, s, s - r, s);
  sh.lineTo(-s + r, s); sh.quadraticCurveTo(-s, s, -s, s - r);
  sh.lineTo(-s, -s + r); sh.quadraticCurveTo(-s, -s, -s + r, -s);
  return sh;
}

export const splot: ObjectDef = {
  id: 'splot',
  seconds: 12,
  build({ ramp, variant, width, height }) {
    const scene = new Scene();
    scene.background = new Color(0, 0, 0);

    const slabGeo = new ExtrudeGeometry(roundedSquare(0.66, 0.08), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 8 });
    slabGeo.center();
    const slab = new Mesh(slabGeo, graphite());
    slab.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
    scene.add(slab);

    const metal = darkMetal();
    const threads = Array.from({ length: THREADS }, (_, i) => {
      const curve = threadCurve(i);
      scene.add(new Mesh(new TubeGeometry(curve, 900, 0.011, 10, true), metal));
      const mat = cometMaterial(ramp, { tail: 0.34, gain: 6.5 });
      scene.add(new Mesh(new TubeGeometry(curve, 900, 0.0125, 10, true), mat));
      const light = new PointLight(ramp.light, 1.1, 0, 2);
      scene.add(light);
      return { curve, mat, light };
    });

    // faint warm rim from behind so the dark side of the slab edge still reads
    const rim = new DirectionalLight(ramp.tail, 0.25);
    rim.position.set(-2, 1.5, -3);
    scene.add(rim);
    // soft top light: the slab reads as the light grey plate of the reference
    const top = new DirectionalLight(new Color('#ffd9d2'), 0.55);
    top.position.set(0.3, 4, 1);
    scene.add(top);
    // a whisper of ambient so the unlit tubes read as grey lines, like the reference rings
    scene.add(new HemisphereLight(new Color('#ffffff'), new Color('#000000'), 0.35));

    // framing per layout slot; the object stays the same size in the frame's short side
    const camera = new PerspectiveCamera(28, width / height, 0.1, 50);
    const dist = variant === 'wide' ? 6.2 : variant === 'tall' ? 6.6 : 5.6;
    camera.position.set(0, dist * 0.46, dist);
    camera.lookAt(0, -0.05, 0);

    return {
      scene,
      camera,
      bloom: { strength: 0.95, radius: 0.18, threshold: 0.3 }, // low threshold: red has little luminance but must glow
      update(t) {
        threads.forEach(({ curve, mat, light }, i) => {
          const h = (t + i / THREADS) % 1;
          mat.setHeads([h]);
          light.position.copy(curve.getPointAt(h));
        });
      },
    };
  },
};
