/* Folded strip geometry for the v2 background bands (pure, no three.js: testable in Node). */

const reflect2 = (t, a) => { const k = 2 * (t[0] * a[0] + t[1] * a[1]); return [k * a[0] - t[0], k * a[1] - t[1]]; };
const norm2 = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };

/**
 * points: axis-aligned polyline in page px; radii: fold radius per corner; width in px.
 * Returns raw arrays { pos (xyz, world y up), uv (material u in px, v 0..1), index, length, cols, rows }.
 */
export function foldedStrip(points, radii, width) {
  const legs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const d = [points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]];
    legs.push({ dir: norm2(d), len: Math.hypot(d[0], d[1]) });
  }
  const d0 = legs[0].dir;
  const nIn = [-d0[1], d0[0]]; // across the strip
  const e = radii.map((r) => Math.SQRT1_2 * Math.PI * r); // how far a fold of radius r pulls the corner back

  // Fold k sits on the centerline at material distance M[k], its line is a[k] (flat frame).
  const folds = [];
  let M = legs[0].len - e[0];
  for (let k = 0; k < radii.length; k++) {
    let t = legs[k + 1].dir;
    for (let j = 0; j < k; j++) t = reflect2(t, folds[j].a); // outgoing direction seen in the flat frame
    const a = norm2([d0[0] + t[0], d0[1] + t[1]]);
    let n = [-a[1], a[0]];
    if (n[0] * d0[0] + n[1] * d0[1] < 0) n = [-n[0], -n[1]];
    const F = [points[0][0] + d0[0] * M, points[0][1] + d0[1] * M];
    folds.push({ a, n, F, r: radii[k], M });
    if (k + 1 < radii.length) M += e[k] + legs[k + 1].len - e[k + 1];
  }
  const length = folds.length ? folds[folds.length - 1].M + e[e.length - 1] + legs[legs.length - 1].len : legs[0].len;

  const segU = Math.max(2, Math.ceil(length / 3));
  const segV = 10;
  const cols = segU + 1, rows = segV + 1;
  const pos = new Float32Array(cols * rows * 3);
  const uv = new Float32Array(cols * rows * 2);
  const p = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } };
  for (let i = 0; i < cols; i++) {
    const u = (i / segU) * length;
    for (let j = 0; j < rows; j++) {
      const v = j / segV;
      const off = (v - 0.5) * width;
      // flat frame position
      p.set(points[0][0] + d0[0] * u + nIn[0] * off, points[0][1] + d0[1] * u + nIn[1] * off, 0);
      const flat = [p.x, p.y];
      // apply folds last to first; region decided in the flat (material) frame
      for (let k = folds.length - 1; k >= 0; k--) {
        const f = folds[k];
        const dist = (flat[0] - f.F[0]) * f.n[0] + (flat[1] - f.F[1]) * f.n[1];
        if (dist <= 0) continue;
        if (dist < Math.PI * f.r) {
          const s = Math.sin(dist / f.r) * f.r, h = f.r * (1 - Math.cos(dist / f.r));
          p.x += f.n[0] * (s - dist);
          p.y += f.n[1] * (s - dist);
          p.z += h;
        } else {
          // rigid: pull back by the arc, then turn 180° about the fold axis lifted to z = r
          const qx = p.x - f.n[0] * Math.PI * f.r - f.F[0];
          const qy = p.y - f.n[1] * Math.PI * f.r - f.F[1];
          const qz = p.z - f.r;
          const k2 = 2 * (qx * f.a[0] + qy * f.a[1]);
          p.set(f.F[0] + k2 * f.a[0] - qx, f.F[1] + k2 * f.a[1] - qy, f.r - qz);
        }
      }
      const idx = i * rows + j;
      // page y is down, world y is up
      pos[idx * 3] = p.x; pos[idx * 3 + 1] = -p.y; pos[idx * 3 + 2] = p.z;
      uv[idx * 2] = u; uv[idx * 2 + 1] = v;
    }
  }
  const index = [];
  for (let i = 0; i < segU; i++) for (let j = 0; j < segV; j++) {
    const a = i * rows + j, b = (i + 1) * rows + j;
    index.push(a, b, a + 1, b, b + 1, a + 1);
  }
  return { pos, uv, index, length, cols, rows, segV };
}

