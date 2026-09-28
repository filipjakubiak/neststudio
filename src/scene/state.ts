/* Stan sceny sterowany przez GSAP (tweeny na zwykłym obiekcie). Jednostki: świat Three.js, kamera w z=10, fov 35. */
export interface SceneState {
  weave: number;      // 0 chaos, 1 splecione gniazdo
  chaos: number;      // amplituda szumu nici
  speed: number;      // prędkość dryfu nici
  tunnel: number;     // 0..1 tunel (showreel)
  ink: number;        // 0 jasne nici na ciemnym, 1 ciemne na jasnym
  opacity: number;    // krycie nici
  dropVisible: number;// 0..1 krycie kropli
  dropScale: number;  // promień kropli w jednostkach świata
  dropX: number;
  dropY: number;
  dropZ: number;
  dropAmp: number;    // amplituda "płynności" kropli
  dropDetach: number; // 0 kropla trzyma się slotu w hero, 1 kropla w pozycji ze stanu
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
  dropVisible: 0,
  dropScale: 0.28,
  dropX: 0,
  dropY: 0,
  dropZ: 0.5,
  dropAmp: 0.12,
  dropDetach: 0,
  camZ: 10,
  camRoll: 0,
  camY: 0,
  exposure: 1,
};

export interface SceneAnchors {
  /* Slot kropli w hero, w px względem dokumentu (top uwzględnia scroll). */
  heroSlot: { x: number; y: number; r: number } | null;
}

export interface SceneBus {
  state: SceneState;
  anchors: SceneAnchors;
  pointer: { x: number; y: number; active: number };
  status: 'idle' | 'loading' | 'on' | 'fallback';
}

const globalKey = '__nestSceneBus';

export function getSceneBus(): SceneBus {
  const g = globalThis as unknown as Record<string, SceneBus | undefined>;
  if (!g[globalKey]) {
    g[globalKey] = {
      state: { ...initialState },
      anchors: { heroSlot: null },
      pointer: { x: 0, y: 0, active: 0 },
      status: 'idle',
    };
  }
  return g[globalKey]!;
}

/* Konwersja px ekranu -> świat (z=0) bez importu three; parametry kamery jak w NestScene (fov 35). */
export function screenToWorldStatic(x: number, y: number, camZ = 10): { x: number; y: number } {
  const w = window.innerWidth, h = window.innerHeight;
  const halfH = Math.tan((35 / 2) * (Math.PI / 180)) * camZ;
  const halfW = halfH * (w / h);
  return { x: ((x / w) * 2 - 1) * halfW, y: (1 - (y / h) * 2) * halfH };
}
export function pxToWorldStatic(px: number, camZ = 10): number {
  const halfH = Math.tan((35 / 2) * (Math.PI / 180)) * camZ;
  return (2 * halfH * px) / window.innerHeight;
}
