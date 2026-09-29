/*
 * Liquid chrome, raymarched. One signed-distance field morphs between four forms
 * (drop, stretched pair that splits, lens, thread), so topology can change (the split)
 * without seams. Shading is a physically based mirror metal (Schlick Fresnel with a chrome F0)
 * lit by an analytic HDR studio: long strip lights and softboxes with values well above 1,
 * so the specular bands stay crisp after tone mapping. Near the silhouette the three colour
 * channels read the studio along slightly different directions: a subtle chromatic falloff.
 */

export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform vec4 uW;          // weights: drop, pair, lens, thread
uniform float uRadius, uTear, uSep, uNeck, uTwist, uAmp, uFreq, uEnv, uSquash, uPhase;
uniform mat3 uRot;        // object rotation (world -> object)

const float FOV_T = 0.2679492; // tan(15 deg)
const float CAM_Z = 4.0;

// ---------- noise (Ashima simplex 3D, MIT) ----------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ---------- shapes ----------
float smin(float a, float b, float k) {
  if (k <= 1e-4) return min(a, b);
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-5);
}

float sdDrop(vec3 p) {
  // teardrop: narrower towards the top
  float taper = 1.0 + uTear * smoothstep(-0.5, 0.9, p.y / uRadius) * 0.45;
  vec3 q = vec3(p.x * taper, p.y * (1.0 - uTear * 0.06), p.z * taper);
  return (length(q) - uRadius) / taper;
}

float sdPair(vec3 p) {
  vec3 q = p;
  q.yz = rot2(uTwist * q.x) * q.yz;
  float s = smoothstep(0.0, 0.6, uSep);
  float r = uRadius * mix(1.0, 0.8, s);           // volume goes into two lobes
  vec3 e = vec3(1.0, mix(1.0, 0.86, s), mix(1.0, 0.92, s)); // lobes a touch elongated while pulling apart
  float a = sdEllipsoid(q - vec3(uSep, 0.0, 0.0), r * e);
  float b = sdEllipsoid(q + vec3(uSep, 0.0, 0.0), r * e);
  return smin(a, b, uNeck) + uNeck * 0.25 * (1.0 - s);
}

float sdLens(vec3 p) {
  vec3 q = p;
  q.xy = rot2(uTwist * 0.4 * q.z) * q.xy;
  return sdEllipsoid(q, vec3(0.74, 0.74, 0.15));
}

float sdThread(vec3 p) {
  const float L = 0.88;
  float x = clamp(p.x, -L, L);
  float u = (x + L) / (2.0 * L);                  // 0 tail .. 1 tip (points to +x)
  float k = 4.2;
  float A = 0.085 * (0.35 + 0.65 * sin(3.14159 * clamp(u * 1.1, 0.0, 1.0)));
  float cy = A * sin(k * x - uPhase);
  float cz = 0.06 * cos(k * 0.6 * x - uPhase * 0.7);
  float dy = A * k * cos(k * x - uPhase);
  vec2 q = vec2(p.y - cy, p.z - cz);
  q.x /= sqrt(1.0 + dy * dy);
  q = rot2(uTwist * x + uPhase * 0.35) * q;
  float r = 0.085 * pow(clamp(1.0 - u, 0.0, 1.0), 0.55) * (0.3 + 0.7 * smoothstep(0.0, 0.3, u)) + 0.002;
  vec2 ab = vec2(r * 1.45, r * 0.72);             // flat ribbon section
  float dc = (length(q / ab) - 1.0) * min(ab.x, ab.y);
  float dx = p.x - x;
  return dx == 0.0 ? dc : length(vec2(dx, max(dc, 0.0)));
}

float map(vec3 pw) {
  vec3 p = uRot * pw;
  // squash & stretch, volume preserving-ish
  float sy = 1.0 - uSquash;
  float sxz = 1.0 / sqrt(max(sy, 0.2));
  p.y /= sy;
  p.xz /= sxz;
  float scale = min(sy, sxz);

  float d = 0.0;
  float wsum = uW.x + uW.y + uW.z + uW.w;
  if (uW.x > 0.001) d += uW.x * sdDrop(p);
  if (uW.y > 0.001) d += uW.y * sdPair(p);
  if (uW.z > 0.001) d += uW.z * sdLens(p);
  if (uW.w > 0.001) d += uW.w * sdThread(p);
  d /= max(wsum, 1e-3);

  if (uAmp > 0.0005) {
    vec3 np = p * uFreq + vec3(uTime * 0.21, uTime * 0.33, -uTime * 0.17);
    float n = snoise(np) + 0.35 * snoise(np * 2.3 + 7.1);
    d -= n * uAmp * 0.5;
  }
  return d * scale;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0009;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.012 + 0.07 * float(i) / 4.0;
    occ += (h - map(p + h * n)) * sca;
    sca *= 0.8;
  }
  return clamp(1.0 - 2.4 * occ, 0.0, 1.0);
}

// ---------- studio (analytic HDR environment) ----------
float box(float az, float el, float az0, float el0, float hw, float hh, float soft) {
  float da = abs(mod(az - az0 + 3.14159265, 6.2831853) - 3.14159265);
  return smoothstep(hw, hw - soft, da) * smoothstep(hh, hh - soft, abs(el - el0));
}

vec3 studio(vec3 d) {
  float c = cos(uEnv), s = sin(uEnv);
  d.xz = mat2(c, -s, s, c) * d.xz;
  float az = atan(d.x, d.z);
  float el = asin(clamp(d.y, -1.0, 1.0));
  // studio: near-black floor, graphite walls rising into a lit cyclorama
  vec3 col = mix(vec3(0.004), vec3(0.09, 0.09, 0.095), smoothstep(-0.25, 0.25, d.y));
  col = mix(col, vec3(0.24, 0.24, 0.255), smoothstep(0.3, 0.95, d.y));
  col += vec3(0.55) * exp(-abs(el - 0.03) * 16.0);                          // bright horizon line
  col += vec3(0.12) * exp(-abs(el + 0.12) * 5.0);                           // its soft spill
  col *= 0.8 + 0.2 * sin(az * 2.0 + 0.6);                                   // walls are not uniform
  vec3 warm = vec3(1.0, 0.975, 0.94), cool = vec3(0.93, 0.965, 1.0);
  col += warm * 9.0 * box(az, el, 0.0, 1.02, 1.5, 0.11, 0.025);             // long overhead strip
  col += warm * 4.0 * box(az, el, 0.2, 0.64, 1.2, 0.035, 0.012);            // thin second strip
  col += warm * 6.5 * box(az, el, -0.78, 0.22, 0.3, 0.42, 0.07);            // key softbox, front left
  col += cool * 10.0 * box(az, el, 1.3, 0.12, 0.05, 0.75, 0.015);           // vertical strip, right
  col += cool * 3.2 * box(az, el, 1.62, 0.1, 0.022, 0.6, 0.008);            // its thin twin
  col += cool * 5.0 * box(az, el, 3.0, 0.25, 0.55, 0.13, 0.05);             // rim behind
  col += vec3(0.18) * box(az, el, -2.2, -0.2, 0.6, 0.25, 0.3);              // soft bounce card
  return col;
}

vec3 aces(vec3 x) {
  const float a = 2.51, b = 0.03, c2 = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c2 * x + d) + e), 0.0, 1.0);
}

vec3 shade(vec3 p, vec3 rd) {
  vec3 n = calcNormal(p);
  vec3 v = -rd;
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec3 r = reflect(rd, n);
  // chromatic falloff: channels read the studio along slightly spread directions towards the rim
  float rim = pow(1.0 - ndv, 2.0);
  vec3 tang = r - n * dot(r, n);
  float spread = 0.045 * rim;
  vec3 env = vec3(
    studio(normalize(r + tang * spread)).r,
    studio(r).g,
    studio(normalize(r - tang * spread)).b
  );
  vec3 F0 = vec3(0.78, 0.79, 0.8);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  float ao = calcAO(p, n);
  vec3 col = env * F * mix(0.35, 1.0, ao);
  col += vec3(0.012) * ao;                    // a whisper of ambient so the darks keep form
  return col;
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 ndc = (frag - 0.5 * uRes) / (0.5 * uRes.y);
  vec3 ro = vec3(0.0, 0.0, CAM_Z);
  vec3 rd = normalize(vec3(ndc * FOV_T, -1.0));
  float pix = 2.0 * FOV_T / uRes.y;           // angular size of one pixel

  float t = 2.4;
  float closest = 1e9;
  float tClosest = t;
  bool hit = false;
  for (int i = 0; i < 220; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    float ratio = d / (t * pix);
    if (ratio < closest) { closest = ratio; tClosest = t; }
    if (d < 0.00025 * t) { hit = true; break; }
    t += d * 0.62;
    if (t > 5.6) break;
  }

  float alpha;
  vec3 col;
  if (hit) {
    col = shade(ro + rd * t, rd);
    alpha = 1.0;
  } else {
    alpha = clamp(1.0 - closest, 0.0, 1.0);   // analytic edge coverage (antialiasing)
    col = alpha > 0.0 ? shade(ro + rd * tClosest, rd) : vec3(0.0);
  }
  col = aces(col * 1.05);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * alpha, alpha);    // premultiplied
}
`;
