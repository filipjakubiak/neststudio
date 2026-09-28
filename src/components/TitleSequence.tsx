'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { markPrepare, markReady, prefersReducedMotion, whenScene } from '@/lib/motion';
import { getSceneBus } from '@/scene/state';
import type { NestScene } from '@/scene/NestScene';
import { Lockup } from '@/components/ui/Lockup';

const KEY = 'nest_seen';
/* Moment locka (wszystkie litery na miejscu, kamera w spoczynku); docs/titles.md §3. */
const LOCK_T = 4.25;
const SCENE_WAIT_MS = 3500;
const HARD_TIMEOUT_MS = 6000;

/* Kamera na starcie sekwencji (świat). */
const CAM_START = { x: -0.6, y: 0.25, z: 3.0 };
/* Wejścia liter: pozycja startowa względem kamery startowej (x, y) i bezwzględne z, plus kolejność.
   Indeksy jak w TITLE_GLYPHS: N E S T S T U D I O. Pierwsze litery zaczynają tuż przed obiektywem
   (z do 2.45 przy kamerze w z = 3), po przeciwnej stronie niż ich miejsce w lockupie, więc przesuwają
   się przez kadr jako wielkie kanty; ostatnie "I" opada z góry na swoje miejsce. */
const ENTRIES = [
  { order: 0, x: 0.35, y: -0.15, z: 2.45, rx: 0.1, ry: -0.55, rz: 0 },  // N: pierwszy kant, w lewo
  { order: 2, x: 1.1, y: 0.5, z: 1.9, rx: 0, ry: -0.45, rz: 0 },       // E
  { order: 4, x: -1.5, y: 1.1, z: 1.4, rx: 0.3, ry: 0.3, rz: 0 },      // S
  { order: 6, x: 0.6, y: -1.6, z: 2.1, rx: 0.5, ry: 0, rz: 0 },        // T: z dołu
  { order: 8, x: 2.2, y: 0.2, z: 1.2, rx: 0, ry: -0.7, rz: 0 },        // S: z prawej
  { order: 7, x: -0.5, y: 1.6, z: 2.0, rx: -0.5, ry: 0, rz: 0 },       // T: z góry
  { order: 5, x: -1.4, y: -1.1, z: 1.5, rx: -0.3, ry: -0.3, rz: 0 },   // U: z dołu-lewej
  { order: 3, x: -1.2, y: -0.45, z: 1.8, rx: 0, ry: 0.45, rz: 0 },     // D: w prawo
  { order: 9, x: 3.3, y: 2.4, z: 1.6, rx: -0.2, ry: 0, rz: 0.15 },     // I: ostatnie, opada z góry
  { order: 1, x: -0.3, y: 0.35, z: 2.25, rx: -0.1, ry: 0.55, rz: 0 },  // O: drugi kant, w prawo
];

/* Sekwencja tytułowa: raz na sesję, nigdy przy reduced motion (D8, D15). Markup jest w SSR;
   skrypt w <head> decyduje przed malowaniem, czy go pominąć. */
export function TitleSequence({ label, skipLabel }: { label: string; skipLabel: string }) {
  const [active, setActive] = useState<boolean>(true);
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const skip = html.hasAttribute('data-skip-preloader') || prefersReducedMotion();
    if (skip || !el) { html.removeAttribute('data-preloading'); markReady(); setActive(false); return; }
    html.setAttribute('data-preloading', 'true');

    const bus = getSceneBus();
    let done = false;
    let tl: gsap.core.Timeline | null = null;
    let seekTween: gsap.core.Tween | null = null;

    const finish = () => {
      if (done) return;
      done = true;
      try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
      html.removeAttribute('data-preloading');
      html.setAttribute('data-skip-preloader', '');
      markReady();
      setActive(false);
    };

    /* Bez sceny (timeout albo brak WebGL): odsłoń stronę bez sekwencji. */
    const bail = () => {
      if (done) return;
      markPrepare();
      gsap.to(el, { opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: finish });
    };

    const build = (scene: NestScene) => {
      const s = bus.state;
      const anchor = bus.anchors.hero;
      if (!anchor) { bail(); return; }
      const sc = scene.titleScale(anchor);
      const wu = scene.worldUnitsPerPixel(0);
      const titles = scene.titles;
      const layout = titles.layout;
      /* środek lockupu w świecie i cel każdej litery, żeby offset startowy był bezwzględny w świecie */
      const tlw = scene.screenToWorld(anchor.x, anchor.y - window.scrollY, 0);
      const cx = tlw.x + (anchor.w * wu) / 2, cy = tlw.y - (anchor.h * wu) / 2;

      /* zanim shadery się skompilują, klatki mają być czarne (litery już stoją, kamera w spoczynku) */
      s.titlesHero = 1; s.exposure = 0;
      tl = gsap.timeline({ paused: true, onComplete: finish });
      tl.set(s, {
        titlesHero: 1, titlesRecede: 0, exposure: 0, opacity: 0,
        camX: CAM_START.x, camY: CAM_START.y, camZ: CAM_START.z, camRoll: 0.04,
        lightX: -3.5, lightY: -0.5, lightZ: 1.0, lightIntensity: 1.2, lightFollow: 0, flicker: 0.35,
        rim: 1.3, edge: 1.2, bloom: 1.0, chroma: 0.004, grain: 0.08, vignette: 0.35,
      }, 0);
      tl.to(s, { exposure: 1, duration: 0.7, ease: 'power2.out' }, 0);
      /* wąski kadr (telefon): wejścia bliżej osi kamery w poziomie, żeby pierwsze kanty były w kadrze od razu */
      const narrow = Math.min(1, (window.innerWidth / window.innerHeight) / 1.6);
      ENTRIES.forEach((e, i) => {
        const p = layout.letters[i];
        const tx = cx + (p.x - layout.width / 2) * sc, ty = cy + (p.y - layout.height / 2) * sc;
        const from = { x: (CAM_START.x + e.x * narrow - tx) / sc, y: (CAM_START.y + e.y - ty) / sc, z: e.z / sc, rx: e.rx, ry: e.ry, rz: e.rz };
        tl!.fromTo(titles.offsets[i], from, { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, duration: 2.6, ease: 'power1.inOut' }, 0.2 + e.order * 0.14);
      });
      tl.to(s, { camX: 0, camY: 0, camZ: 10, camRoll: 0, duration: 4.0, ease: 'power2.inOut' }, 0.2)
        .to(s, { lightX: 3.5, lightY: 2.5, lightZ: 1.5, duration: 2.2, ease: 'sine.inOut' }, 0.2)
        .to(s, { lightX: 2.2, lightY: 2.0, lightZ: 1.4, duration: 1.8, ease: 'power2.inOut' }, 2.4)
        .to(s, { lightIntensity: 2.2, duration: 1.4, ease: 'sine.inOut' }, 2.0)
        .to(s, { flicker: 0, duration: 0.6 }, 3.8)
        /* lock: puls ekspozycji i bloomu, aberracja skacze i wraca */
        .to(s, { exposure: 1.45, bloom: 1.6, chroma: 0.02, duration: 0.12, ease: 'power2.in' }, LOCK_T + 0.05)
        .to(s, { exposure: 1, bloom: 0.7, chroma: 0.0012, duration: 0.6, ease: 'power2.out' }, LOCK_T + 0.17)
        .to(s, { lightIntensity: 1.4, grain: 0.035, vignette: 0, rim: 1, edge: 1, duration: 1.2 }, LOCK_T + 0.2)
        .to(s, { lightFollow: 0.35, duration: 1 }, LOCK_T + 0.4)
        .call(markPrepare, [], LOCK_T + 0.2)
        .to(el, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, LOCK_T + 0.35)
        .to(s, { opacity: 0.55, duration: 2.4, ease: 'power2.out' }, LOCK_T + 0.5)
        .call(finish, [], LOCK_T + 0.8);
      /* rozgrzewka: kompilacja shaderów zanim ruszy czas sekwencji */
      scene.warm().then(() => {
        if (done || !tl) return;
        window.__nestTitles = tl; // uchwyt lab (Playwright przewija sekwencję klatka po klatce), dostępny od startu odtwarzania
        tl.play();
      });
    };

    skipRef.current = () => {
      if (done || !tl || seekTween) return;
      if (tl.time() >= LOCK_T) return;
      tl.pause();
      seekTween = gsap.to(tl, { time: LOCK_T + 0.02, duration: 0.4, ease: 'power2.in', onComplete: () => { tl?.play(); } });
    };

    const waitTimer = window.setTimeout(() => { if (!tl && !done) el.setAttribute('data-static', 'true'); }, SCENE_WAIT_MS);
    const hardTimer = window.setTimeout(() => { if (!tl) bail(); }, HARD_TIMEOUT_MS);
    const cancelScene = whenScene((scene) => {
      if (done) return;
      window.clearTimeout(waitTimer);
      if (!scene) { bail(); return; }
      /* scena mogła przyjść po twardym timeoucie: wtedy strona już się odsłania */
      if (tl) return;
      window.clearTimeout(hardTimer);
      build(scene);
    });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); skipRef.current(); } };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(waitTimer);
      window.clearTimeout(hardTimer);
      cancelScene();
      window.removeEventListener('keydown', onKey);
      seekTween?.kill();
      tl?.kill();
    };
  }, []);

  if (!active) return null;
  return (
    <div ref={root} className="titles-overlay" role="status" aria-live="polite" aria-busy="true" aria-label={label} onClick={() => skipRef.current()}>
      <div className="titles-static wrap"><Lockup className="titles-lockup" /></div>
      <span className="titles-label t-label">Nest Studio</span>
      <button type="button" className="titles-skip t-label" onClick={(e) => { e.stopPropagation(); skipRef.current(); }}>{skipLabel}</button>
    </div>
  );
}
