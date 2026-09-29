/* Stan sceny sterowany przez GSAP (tweeny na zwykłym obiekcie). Jednostki: świat Three.js, kamera w z=10, fov 35. */
export interface SceneState {
  weave: number;      // 0 chaos, 1 splecione gniazdo
  chaos: number;      // amplituda szumu nici
  speed: number;      // prędkość dryfu nici
  tunnel: number;     // 0..1 tunel (showreel)
  ink: number;        // 0 jasne nici na ciemnym, 1 ciemne na jasnym
  opacity: number;    // krycie nici
  nestX: number;      // przesunięcie gniazda w świecie (kompozycja: tekst po lewej, gniazdo po prawej)
  nestY: number;
  camZ: number;
  camRoll: number;
  camY: number;
  exposure: number;
}

export const initialState: SceneState = {
  weave: 0,
  chaos: 1,
  speed: 0.05,
  tunnel: 0,
  ink: 0,
  opacity: 1,
  nestX: 0,
  nestY: 0,
  camZ: 10,
  camRoll: 0,
  camY: 0,
  exposure: 1,
};

export interface SceneBus {
  state: SceneState;
  pointer: { x: number; y: number; active: number };
  status: 'idle' | 'loading' | 'on' | 'fallback';
}

const globalKey = '__nestSceneBus';

export function getSceneBus(): SceneBus {
  const g = globalThis as unknown as Record<string, SceneBus | undefined>;
  if (!g[globalKey]) {
    g[globalKey] = {
      state: { ...initialState },
      pointer: { x: 0, y: 0, active: 0 },
      status: 'idle',
    };
  }
  return g[globalKey]!;
}

/* Świat (płaszczyzna z=0) -> px ekranu, parametry kamery jak w NestScene (fov 35). Używa ChromeGuide,
   żeby posadzić chrom w gnieździe nici (nestX/nestY). */
export function worldToScreenStatic(x: number, y: number, camZ = 10): { x: number; y: number } {
  const w = window.innerWidth, h = window.innerHeight;
  const halfH = Math.tan((35 / 2) * (Math.PI / 180)) * camZ;
  const halfW = halfH * (w / h);
  return { x: ((x / halfW) + 1) / 2 * w, y: (1 - y / halfH) / 2 * h };
}
