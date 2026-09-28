/* Generatywny wzór splotu (SVG) z seedem. Zastępuje screenshoty projektów, których nie mamy. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function weavePaths(seed: number, count = 36, w = 800, h = 600): string[] {
  const rnd = mulberry32(seed);
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const y0 = rnd() * h;
    const y1 = rnd() * h;
    const cx1 = w * (0.2 + rnd() * 0.3);
    const cy1 = rnd() * h;
    const cx2 = w * (0.5 + rnd() * 0.3);
    const cy2 = rnd() * h;
    const x0 = -w * 0.1 + rnd() * w * 0.2;
    const x1 = w * 0.9 + rnd() * w * 0.2;
    paths.push(`M${x0.toFixed(1)} ${y0.toFixed(1)}C${cx1.toFixed(1)} ${cy1.toFixed(1)} ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
  }
  return paths;
}
