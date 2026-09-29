/* Układ nici w gnieździe liczony raz na CPU (bez three), żeby shader nie płacił za szum.
   Każda nić to łuk na zdeformowanej powłoce: kierunek d(t) krąży wokół własnej osi
   (baza u, v, oś a = u × v), z szerokością geograficzną dryfującą wzdłuż nici (spirala).
   Promień powłoki, garb i misa są w shaderze (tanie sinusy od d), tu tylko parametry nici. */

export interface NestLayout {
  count: number;
  seed: Float32Array;   // vec4: pozycja w chaosie, kolejność splatania (w), alfa (z)
  nestU: Float32Array;  // vec4: u.xyz, faza startowa (rad)
  nestV: Float32Array;  // vec4: v.xyz, długość łuku (rad)
  nestP: Float32Array;  // vec4: szerokość bazowa (rad), spirala (rad na nić), powłoka (0.7..1.08), ucieczka (0 = brak)
  lit: Float32Array;    // vec2: 0/1 nić niesie światło, faza własna 0..1
  litCount: number;
}

/* Udział nici ze światłem krawędziowym: DESIGN.md §2 (10 do 18%). */
export const LIT_SHARE = 0.14;

function lcg(seed: number) {
  let r = seed >>> 0;
  return () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; };
}

function basis(ax: number, ay: number, az: number, out: number[]) {
  // u ⟂ a, v = a × u (znormalizowane)
  const hx = Math.abs(ay) < 0.9 ? 0 : 1, hy = Math.abs(ay) < 0.9 ? 1 : 0;
  let ux = hy * az - 0 * ay, uy = 0 * ax - hx * az, uz = hx * ay - hy * ax;
  const ul = Math.hypot(ux, uy, uz) || 1;
  ux /= ul; uy /= ul; uz /= ul;
  const vx = ay * uz - az * uy, vy = az * ux - ax * uz, vz = ax * uy - ay * ux;
  out[0] = ux; out[1] = uy; out[2] = uz; out[3] = vx; out[4] = vy; out[5] = vz;
}

export function buildNestLayout(count: number): NestLayout {
  const rnd = lcg(1234567 + count);
  const seed = new Float32Array(count * 4);
  const nestU = new Float32Array(count * 4);
  const nestV = new Float32Array(count * 4);
  const nestP = new Float32Array(count * 4);
  const lit = new Float32Array(count * 2);
  const b = [0, 0, 0, 0, 0, 0];

  // najpierw losujemy wszystko, potem porządkujemy: nici ze światłem na końcu (rysowane ostatnie, addytywnie na wierzchu)
  const litFlags: boolean[] = [];
  const rows: number[][] = [];
  for (let i = 0; i < count; i++) {
    const s = [rnd(), rnd(), rnd(), rnd()];
    const kind = rnd();
    let ax: number, ay: number, az: number, lat0: number, spiral: number, arc: number, stray = 0;
    if (kind < 0.46) {
      // nawinięty brzeg: oś blisko pionu gniazda, rozrzut do ~40°
      const tilt = Math.pow(rnd(), 1.4) * 0.7, az0 = rnd() * Math.PI * 2;
      ax = Math.sin(tilt) * Math.cos(az0); ay = Math.cos(tilt); az = Math.sin(tilt) * Math.sin(az0);
      lat0 = (rnd() - 0.5) * 0.9;
      spiral = (rnd() - 0.5) * 0.9;
      arc = 1.2 + Math.pow(rnd(), 0.8) * 3.2;
    } else {
      // oplot kłębka: osie z całej sfery, łuki blisko kół wielkich
      const zc = rnd() * 2 - 1, ph = rnd() * Math.PI * 2, rr = Math.sqrt(1 - zc * zc);
      ax = rr * Math.cos(ph); ay = zc; az = rr * Math.sin(ph);
      lat0 = (rnd() - 0.5) * 0.5;
      spiral = (rnd() - 0.5) * 1.4;
      arc = 0.7 + Math.pow(rnd(), 0.9) * 2.8;
      if (kind > 0.93) { stray = 0.12 + rnd() * 0.45; arc = 0.5 + rnd() * 1.1; } // luźne końce uciekające na zewnątrz
    }
    basis(ax, ay, az, b);
    // powłoka: więcej nici przy powierzchni, mniej w głębi (nierówna grubość ściany)
    const shell = 0.7 + 0.38 * Math.sqrt(rnd());
    const phase = rnd() * Math.PI * 2;
    const litPhase = rnd();
    const isLit = rnd() < LIT_SHARE && stray === 0;
    litFlags.push(isLit);
    // nici ze światłem leżą w zewnętrznej warstwie (1.0..1.07): to one rysują sylwetkę
    const litShell = 1.0 + 0.07 * litPhase;
    rows.push([s[0], s[1], s[2], s[3], b[0], b[1], b[2], phase, b[3], b[4], b[5], arc, lat0, spiral, isLit ? litShell : shell, stray, isLit ? 1 : 0, litPhase]);
  }
  const order = rows.map((_, i) => i).sort((a, c) => Number(litFlags[a]) - Number(litFlags[c]) || a - c);
  let litCount = 0;
  order.forEach((src, i) => {
    const r = rows[src];
    seed.set(r.slice(0, 4), i * 4);
    nestU.set(r.slice(4, 8), i * 4);
    nestV.set(r.slice(8, 12), i * 4);
    nestP.set(r.slice(12, 16), i * 4);
    lit.set(r.slice(16, 18), i * 2);
    if (r[16] > 0) litCount++;
  });
  return { count, seed, nestU, nestV, nestP, lit, litCount };
}
