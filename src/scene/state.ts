/* Stan sceny sterowany przez GSAP (tweeny na zwykłym obiekcie). Jednostki: świat Three.js, kamera w z=10, fov 35. */
export interface SceneState {
  weave: number;      // 0 chaos, 1 splecione gniazdo
  chaos: number;      // amplituda szumu nici
  speed: number;      // prędkość dryfu nici
  tunnel: number;     // 0..1 tunel (showreel)
  ink: number;        // 0 jasne nici na ciemnym, 1 ciemne na jasnym
  opacity: number;    // krycie nici
  glow: number;       // 0..1 żar: nici w gnieździe świecą czerwono (finał)
  nestX: number;      // przesunięcie gniazda w świecie (kompozycja: tekst po lewej, gniazdo po prawej)
  nestY: number;
  camX: number;
  camY: number;
  camZ: number;
  camRoll: number;
  exposure: number;
  /* litery "NEST STUDIO" */
  titlesHero: number;   // krycie liter zakotwiczonych w hero
  titlesFooter: number; // krycie liter zakotwiczonych w stopce (gdy > 0, litery są w stopce)
  titlesRecede: number; // 0 lockup w hero, 1 litery cofnięte w głąb i zgaszone (scroll przez hero)
  lightX: number;       // światło kluczowe (świat)
  lightY: number;
  lightZ: number;
  lightIntensity: number;
  lightFollow: number;  // 0..1 ile światło podąża za wskaźnikiem / krąży
  flicker: number;      // amplituda migotania światła (sekwencja)
  rim: number;          // siła rim light
  edge: number;         // siła świecenia faz
  /* post-processing */
  bloom: number;        // siła bloomu
  chroma: number;       // aberracja chromatyczna (frakcja ekranu)
  grain: number;        // ziarno
  vignette: number;     // winieta (tylko sekwencja, na czarnym)
}

export const initialState: SceneState = {
  weave: 0,
  chaos: 1,
  speed: 0.05,
  tunnel: 0,
  ink: 0,
  opacity: 1,
  glow: 0,
  nestX: 0,
  nestY: 0,
  camX: 0,
  camY: 0,
  camZ: 10,
  camRoll: 0,
  exposure: 1,
  titlesHero: 0,
  titlesFooter: 0,
  titlesRecede: 0,
  lightX: 2.2,
  lightY: 2.0,
  lightZ: 1.4,
  lightIntensity: 1.4,
  lightFollow: 0.35,
  flicker: 0,
  rim: 1,
  edge: 1,
  bloom: 0.7,
  chroma: 0.0012,
  grain: 0.035,
  vignette: 0,
};

/* Boks lockupu w px dokumentu (top uwzględnia scroll), lewy górny róg + rozmiar; stacked = dwie linie. */
export interface TitleAnchor { x: number; y: number; w: number; h: number; stacked: boolean }

export interface SceneAnchors {
  hero: TitleAnchor | null;
  footer: TitleAnchor | null;
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
      anchors: { hero: null, footer: null },
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

/* Pomiar boksu DOM z layoutu (offsety), niezależny od transformów animacji. */
export function measureAnchor(el: HTMLElement, stacked: boolean): TitleAnchor {
  let x = 0, y = 0, node: HTMLElement | null = el;
  while (node) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight, stacked };
}
