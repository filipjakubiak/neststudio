# Plan implementacji: strona Nest Studio

> Wg skilla `writing-plans`, wykonywany inline (`executing-plans`) przez sesję Claude Fable 5.1. Zadania mają pliki, kroki i weryfikację. Spec: `BRIEF.md`, `docs/concept.md`, `DESIGN.md`, `docs/copy.md`, `docs/brand.md`, `docs/decisions.md`. Postęp: `docs/STAN.md`.

**Cel:** jedna strona (PL + EN) będąca showreelem studia: jedna historia scrolla, własna animacja w każdej sekcji, jedna scena Three.js (nici + chrome) spinająca całość, Lighthouse ≥ 90 desktop, pełne `prefers-reduced-motion`, działa od 360 px, polskie znaki wszędzie.

**Architektura:** Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript, Tailwind v4 (tokeny z `DESIGN.md` jako zmienne CSS + `@theme`), GSAP 3.13 (ScrollTrigger, SplitText, DrawSVG, MorphSVG, CustomEase, ScrollTo, Flip) przez `@gsap/react`, Lenis, Three.js (własna scena, dynamiczny import). Sekcje to klienckie liście (`'use client'`) z własnym `useGSAP` i sprzątaniem; layout i treść to komponenty serwerowe. Treść w `src/content/{pl,en}.ts` o wspólnym typie. Hosting: Cloudflare Workers static assets (`wrangler.jsonc`).

**Stack (wersje sprawdzone w npm 28.09.2026):** next 16.3.6, gsap 3.15.0, lenis 1.3.26, three (najnowsza), tailwindcss 4.3.3, @fontsource-variable/space-grotesk 5.3.0, @fontsource/space-mono, @phosphor-icons/react, vitest, playwright-core (lab).

## Ograniczenia globalne

- Każda wartość wizualna z `DESIGN.md` (zmienne CSS). Zero magicznych liczb w komponentach.
- Zero em-dash/en-dash w treści i UI. Zero emoji. Zero `window.addEventListener('scroll')`. Zero `100vh` (tylko `100dvh`). Zero `transition: all`.
- Każda animacja w `gsap.matchMedia()` z wariantem `(prefers-reduced-motion: reduce)`: treść widoczna od razu, bez pinów, bez sceny.
- Fonty self-hosted, subsety `latin` + `latin-ext`, `font-display: swap`.
- Placeholdery: `data-placeholder="true"` w DOM + wpis w `docs/placeholders.md`.
- Commit + push po każdym kamieniu milowym (K1 do K6). `docs/STAN.md` aktualizowany przy każdym kamieniu.

## Punkty uwagi (Review Focus)

1. Scroll pin + Lenis na iOS Safari: pasek adresu zmienia wysokość; używamy `100dvh`, `ScrollTrigger.normalizeScroll` wyłączone (konflikt z Lenis), `invalidateOnRefresh: true` na każdym pinie; test na 390×844 w Playwright (emulacja) + zapis w STAN, że prawdziwy iPhone jest do sprawdzenia przez Filipa.
2. Brak WebGL / wolne GPU: `NestScene` ma test `WebGL2RenderingContext` i pomiar FPS przez pierwszą sekundę; poniżej progu przełącza na fallback SVG; strona musi wyglądać kompletnie bez sceny.
3. Reduced motion: pinowane sekcje zamieniają się w zwykłe bloki; test Playwright `reducedMotion: 'reduce'` sprawdza, że każdy nagłówek jest widoczny bez scrolla po sekcji (opacity 1).
4. Klawiatura: overlay menu ma pułapkę fokusu i `Escape`; akordeony i FAQ to `<button aria-expanded>`; rail to lista linków; magnetyzm nie przesuwa focus ringa.
5. Polskie znaki: test wizualny "Zażółć gęślą jaźń" w `lab/fonts.html` dla 300/400/500 Space Grotesk i 400/700 Space Mono; sprawdzenie, że subset latin-ext jest w `out/_next/static/media`.

## Kamienie milowe

- **K1** dokumenty koncepcji, marki, tekstów, planu (ten commit).
- **K2** szkielet: build przechodzi, layout PL/EN, tokeny, fonty, nav, stopka, treść statyczna wszystkich sekcji (bez animacji). Strona czytelna i kompletna bez JS.
- **K3** infrastruktura ruchu + scena Three.js + preloader + hero + napięcie.
- **K4** showreel + projekty + usługi + AI demo.
- **K5** proces + studio + FAQ + kontakt + rail + menu.
- **K6** weryfikacja (screenshoty, reduced motion, Lighthouse), audyt, wrangler, assety marki (favicon, OG), STAN końcowy.

---

### Zadanie 1: Szkielet projektu (K2)

**Pliki:** `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/[lang]/layout.tsx`? Nie: dla static export prościej dwie trasy: `src/app/page.tsx` (pl) i `src/app/en/page.tsx` (en), wspólny `src/app/layout.tsx` z `lang` z props. `src/styles/tokens.css`, `src/styles/globals.css` (Tailwind `@import "tailwindcss"; @theme {...}`), `src/app/fonts.ts` (import fontsource subsetów), `public/brand/*`, `.gitignore` (już jest).

Kroki:
1. `npm init -y`; instalacja: `next react react-dom typescript @types/react @types/node tailwindcss @tailwindcss/postcss gsap @gsap/react lenis three @types/three @fontsource-variable/space-grotesk @fontsource/space-mono @phosphor-icons/react`; dev: `vitest @vitejs/plugin-react jsdom`.
2. `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`, `reactStrictMode: true`.
3. `globals.css`: import Tailwind, `@theme` mapujące tokeny na klasy (`--color-canvas`, `--font-display`, …), `tokens.css` (z `DESIGN.md` §9), reset: `body { background: var(--canvas); color: var(--ink); }`, `:focus-visible` ring, `.sr-only`, `text-wrap` reguły, klasy `.t-display .t-h1 …`.
4. Fonty: `import '@fontsource-variable/space-grotesk/wght.css'` ładuje wszystkie subsety; zamiast tego importować pliki `latin.css` i `latin-ext.css` z pakietu (sprawdzić ścieżki w `node_modules/@fontsource-variable/space-grotesk/`), analogicznie `@fontsource/space-mono/400.css` i `700.css` mają subsety w jednym CSS z `unicode-range`; zostawić (Next wytnie nieużywane pliki fontów? Nie, ale przeglądarka pobierze tylko subsety potrzebne przez `unicode-range`). Preload `latin` woff2 display.
5. `layout.tsx`: `<html lang>`, metadata z `docs/copy.md` §0, `hreflang` (alternates), skip link, `<main id="tresc">`.
6. `page.tsx` + `en/page.tsx`: renderują `<Site content={pl} lang="pl" />`.
7. `npm run build` → `out/index.html`, `out/en/index.html` istnieją, brak błędów.

Weryfikacja: `ls out out/en`, `grep -c 'lang="pl"' out/index.html`.

### Zadanie 2: Model treści + testy (K2)

**Pliki:** `src/content/types.ts`, `src/content/pl.ts`, `src/content/en.ts`, `src/content/site.ts` (SITE_URL, EMAIL, PHONE, CAL_URL, SHOWREEL_SRC, FOUNDED_YEAR = 2014, `yearsInField()`), `src/content/projects.ts`, `tests/content.test.ts`, `vitest.config.ts`.

Kroki:
1. Typ `Content` z sekcjami: meta, nav, hero, tension, showreel, projects, services, aiDemo, process, studio, faq, contact, footer, system.
2. Przepisać `docs/copy.md` do `pl.ts` i `en.ts`.
3. Test: (a) klucze i długości tablic PL == EN, (b) żaden string nie zawiera `—` ani `–`, (c) eyebrow count == 4, (d) `yearsInField(2026) === 12`.
4. `npx vitest run` zielone.

### Zadanie 3: Komponenty statyczne wszystkich sekcji (K2)

**Pliki:** `src/components/Site.tsx` (kolejność sekcji, `data-theme` na projektach), `src/components/sections/{Hero,Tension,Showreel,Projects,Services,AiDemo,Process,Studio,Faq,Contact,Footer}.tsx`, `src/components/ui/{Button,Eyebrow,Wordmark,Mark}.tsx`, `src/components/nav/{Nav,MenuOverlay,LangSwitch}.tsx`.

Kroki: każdy komponent renderuje pełną treść semantycznie (h1/h2, listy, `<button aria-expanded>` w FAQ/usługach jako progressive enhancement: bez JS wszystko rozwinięte). Bez GSAP. Wygląd wg `DESIGN.md`. Build + screenshot Playwright desktop 1440 i mobile 390: brak poziomego scrolla (`document.documentElement.scrollWidth === clientWidth`).

**Commit K2.**

### Zadanie 4: Infrastruktura ruchu (K3)

**Pliki:** `src/lib/gsap.ts` (rejestracja pluginów, `CustomEase.create('weave', 'M0,0 C0.2,0 0.1,1 1,1')`, eksport `gsap`, `ScrollTrigger`, `SplitText`…), `src/lib/motion.ts` (`MOTION_QUERY = '(prefers-reduced-motion: no-preference)'`, `REDUCED_QUERY`, helper `withMotion(cb)` oparty na `gsap.matchMedia`), `src/components/motion/SmoothScroll.tsx` (Lenis + `ScrollTrigger.update` na `lenis.on('scroll')`, `gsap.ticker.add`, `lagSmoothing(0)`; wyłączony przy reduced motion), `src/components/motion/Reveal.tsx` (wejście liniami przez maskę: SplitText `type: 'lines'`, `mask: 'lines'`, `yPercent: 110 → 0`, stagger 0.05, `once`), `src/lib/magnet.ts` (magnetyzm ±12 px, tylko `(hover: hover) and (pointer: fine)`).

Weryfikacja: hero tekst wjeżdża maską; przy `reducedMotion: 'reduce'` w Playwright tekst od razu widoczny (`opacity: 1`, brak `transform`).

### Zadanie 5: Scena Three.js "Nić" (K3)

**Pliki:** `src/scene/NestScene.ts` (klasa: renderer, kamera, `ThreadField`, `ChromeDrop`, `state`, `setState(partial)`, `resize`, `dispose`, `frame(t)`), `src/scene/ThreadField.ts` (instancjonowane linie: `InstancedBufferGeometry` z segmentami; shader wierzchołków: pozycja bazowa na torusie (gniazdo) vs. pozycja chaosu (szum simplex), mieszane przez `uWeave`; kolor `uInk`, alfa; `uSpeed` przesuwa fazę), `src/scene/ChromeDrop.ts` (Icosahedron(1, 6), `MeshPhysicalMaterial` metalness 1, roughness 0.08, clearcoat 1, env z `RoomEnvironment` + PMREM; `onBeforeCompile` dodaje przemieszczenie simplex `uAmp`, `uTime`; `uMouse` jako lekkie przyciąganie), `src/scene/noise.glsl.ts` (simplex 3D), `src/scene/state.ts` (typ `SceneState`: `weave, chaos, speed, ink(0..1), dropScale, dropX, dropY, dropZ, dropAmp, camZ, exposure, visible`), `src/components/scene/SceneCanvas.tsx` (`'use client'`, `dynamic(() => import(...), { ssr: false })`, fixed canvas `z-scene`, `pointer-events: none`, detekcja WebGL2 + reduced motion + `navigator.hardwareConcurrency`, pomiar FPS 1 s → budżet nici 6000/3000/1500 lub fallback), `src/components/scene/SceneFallback.tsx` (statyczny SVG splotu + CSS chrome), `src/scene/controller.ts` (singleton `sceneBus`: sekcje wywołują `sceneBus.tween(state, opts)` lub `sceneBus.scrub(trigger, from, to)`; jeżeli scena nie istnieje, no-op).

Kroki: (1) statyczna scena z nićmi w chaosie (weave 0), kropla w hero; (2) `setState` przez GSAP tween obiektu state (`gsap.to(scene.state, {...})`), scena czyta state w `frame`; (3) budżet i fallback; (4) `visibilitychange` pauza; (5) dispose w cleanup.

Weryfikacja: screenshot hero z kroplą; `performance.now()` w konsoli: ≥ 50 fps na desktopie labu (headless: sprawdzić tylko brak błędów); fallback renderuje się po `--disable-webgl`? W Playwright: `chromium.launch({ args: ['--disable-gpu', '--disable-webgl'] })` → widoczny `SceneFallback`.

### Zadanie 6: Preloader (K3)

**Pliki:** `src/components/Preloader.tsx`. Licznik 2014 → rok (GSAP `snap`, 1.1 s, `expo.inOut`), znak N rysowany DrawSVG w trzech nitkach, potem kurtyna w górę (`yPercent: -100`, 0.6 s), `sessionStorage.nest_seen`, `aria-busy`, blokada scrolla (Lenis `stop()`), reduced motion: brak. Hero startuje po zdarzeniu `nest:ready`.

### Zadanie 7: Hero (K3)

**Pliki:** `src/components/sections/Hero.tsx` (+ `hero.css` jeśli potrzebne). Eyebrow, h1 3 linie z miejscem na kroplę (pusty `span.drop-slot` inline o szerokości `1.1em`, scena pozycjonuje kroplę na jego `getBoundingClientRect()` przy resize i scrollu), lead, dwa CTA. Wejście: linie maską, CTA fade+y, kropla skaluje się z 0. Kursor: `uMouse` z `pointermove` (throttle rAF). Scroll: hero paralaksa lekka (`yPercent: -10`), kropla zjeżdża do sekcji napięcia (`dropY`).

### Zadanie 8: Napięcie (K3)

**Pliki:** `src/components/sections/Tension.tsx`. Pin 200vh. Dwie kolumny: lewa "Widoczność" (SplitText chars, każdy znak `x/y` losowo ±40 px, `rotate` ±8°, `opacity 0.25`), prawa "Wartość" stała. Scrub: znaki wracają na miejsce (`--e-weave`), labelki, potem h2 i akapit; na końcu zdanie "Nie egzekucja…" wchodzi słowo po słowie (highlight-text). Scena: `weave 0 → 0.2`, `chaos 1 → 0.6`. Mobile: kolumny jedna pod drugą, pin 160vh. Reduced: bez pinu, znaki na miejscu.

**Commit K3.**

### Zadanie 9: Showreel (K4)

**Pliki:** `src/components/sections/Showreel.tsx`, `src/components/sections/showreel/Player.tsx`, `src/components/sections/showreel/ReelLayers.tsx`. Pin 400vh. Timeline scrubowana (scrub 1): (0) h2 "To nie jest film." rozjeżdża się w głąb (`z`), (1..5) pięć cięć: labelka + zdanie wchodzą z `translateZ(-600px)` do 0 przez `perspective: 1200px`, znikają do `+300px`; scena: `speed 0.05 → 1`, `camZ` zjazd, `weave 0.2 → 0.8` (tunel), `dropScale` rośnie i pęka do `dropAmp 0.35`; (6) cięcie na biel: `ink 0 → 1`, overlay `data-theme=light` fade. Player: timecode z `progress * 150 s`, progres 1 px, labelki cięć podświetlane, Odtwórz = `gsap.to(window, { scrollTo, duration: (1-p)*24, ease: 'none' })` + Zatrzymaj (`kill`). Gdy `SHOWREEL_SRC`: `<video>` z `currentTime = progress * duration` (scrub) zamiast warstw. Reduced: statyczna lista cięć z nagłówkiem.

### Zadanie 10: Projekty (K4)

**Pliki:** `src/components/sections/Projects.tsx`, `src/components/sections/projects/Sheet.tsx`, `src/lib/weavePattern.ts` (SVG generatywny z seedem: 40 krzywych Beziera, mulberry32). Sticky stack 3 arkuszy (`start: 'top top'`, `pin: true`, `pinSpacing: false`; poprzedni skaluje do 0.94 i opacity 0.6). Metryka mono w wielkiej skali (placeholder, `data-placeholder`). Cover: wzór splotu, hover: `scale 1.03`. Scena: `ink 1` (nici czarne), `weave 0.5`. Mobile: zwykły stos bez pinu.

### Zadanie 11: Usługi (K4)

**Pliki:** `src/components/sections/Services.tsx`, `src/components/sections/services/{ThreadStrategy,ThreadBrand,ThreadWeb,ThreadAi}.tsx` (SVG mikro-animacje: strategia = linia szuka kierunku i staje się strzałką (DrawSVG + MorphSVG); branding = trzy nici składają znak N (DrawSVG sekwencja); web = siatka 12 prostokątów układa się w layout (Flip); AI = trzy węzły łączą się krawędziami z pulsem (DrawSVG + `motionPath` po ścieżce przez `MotionPathPlugin`)). Akordeon: `flex: 1` → `flex: 3` (GSAP 0.6 s expo.out) na hover/focus/klik; `aria-expanded`; klawiatura strzałkami. Mobile: pionowo, `height` auto przez GSAP. Scena: `weave 0.6`, powrót `ink 0`.

### Zadanie 12: AI demo (K4)

**Pliki:** `src/components/sections/AiDemo.tsx`, `src/lib/flows.ts` (dane przepływów z `docs/copy.md` §8: preset → kroki → typ węzła), `src/components/sections/ai/FlowCanvas.tsx` (SVG: węzły jako pigułki z etykietą i ikoną Phosphor, krawędzie jako ścieżki z DrawSVG; layout poziomy z zawijaniem na mobile), `tests/flows.test.ts` (każdy preset ma 5 kroków, typy węzłów ze słownika, PL/EN parytet). Wybór presetu: stare węzły wychodzą (`scale 0.9, opacity 0`), nowe wchodzą ze staggerem 80 ms, krawędzie rysują się; "Uruchom przepływ": pakiet (kółko 6 px) płynie po krawędziach (`MotionPathPlugin`), węzły przechodzą stany Gotowe → Pracuje → Zakończone (`aria-live="polite"` log). Scena: `weave 0.7`, nici lekko przyspieszają przy uruchomieniu (`speed 0.3` na 1.5 s).

**Commit K4.**

### Zadanie 13: Proces (K5)

**Pliki:** `src/components/sections/Process.tsx`. Pin 250vh. Jedna ścieżka SVG (krzywa przez 5 stacji, responsywna przez `viewBox` + `preserveAspectRatio`), DrawSVG scrub 0 → 100%; każda stacja: kółko wypełnia się, tytuł i opis wchodzą, gdy ścieżka dociera (progress progi 0.1, 0.3, 0.5, 0.7, 0.9). Mobile: pion, ścieżka pionowa, bez pinu, stacje wchodzą na `ScrollTrigger` `once`. Scena: `weave 0.85`.

### Zadanie 14: Studio (K5)

**Pliki:** `src/components/sections/Studio.tsx`. Siatka 12: portret (kol. 1 do 5, placeholder: wzór splotu + labelka "zdjęcie"), rama chromu (CSS `--chrome` obrys 2 px, paralaksa +40 px), tekst (kol. 7 do 12). Paralaksa 3 warstw (scrub). Liczby: `yearsInField()`. Reduced: bez paralaksy.

### Zadanie 15: FAQ (K5)

**Pliki:** `src/components/sections/Faq.tsx`, `src/components/ui/Accordion.tsx`. `<button aria-expanded aria-controls>`, panel `height: 0` → auto (GSAP `height: 'auto'`, 0.5 s expo.out), ikona `+` → `×` (rotate 45°, 200 ms). Pytania wchodzą maską (`Reveal`). Reduced: przełączenie natychmiastowe.

### Zadanie 16: Kontakt + stopka + rail + menu (K5)

**Pliki:** `src/components/sections/Contact.tsx`, `src/components/sections/Footer.tsx`, `src/components/nav/ThreadRail.tsx`, `src/components/nav/MenuOverlay.tsx` (dopięcie animacji do statycznego z zad. 3). Kontakt: pin 150vh, scena `weave 1`, `dropScale` do centrum, `speed 0.02` (zatrzymanie), h2 wchodzi maską, CTA magnetyczne; sekcja **trzyma** (ostatnie 30% pinu bez zmian). Stopka: wordmark w skali `--t-display` z lekkim `yPercent` scrub, przyciski "Zapytaj Claude/ChatGPT/Perplexity" (linki z promptem `encodeURIComponent`), placeholdery. Rail: `ScrollTrigger` per sekcja aktualizuje aktywny splot; klik → `scrollTo`. Menu: overlay `clip-path` z prawego górnego rogu, linki maską ze staggerem 60 ms, focus trap, `Escape`.

**Commit K5.**

### Zadanie 17: Weryfikacja i audyt (K6)

**Pliki:** `lab/shoot.mjs` (Playwright: pełna strona 1440×900 i 390×844, po 12 pozycjach scrolla, plus `reducedMotion: 'reduce'`), `lab/a11y.mjs` (axe-core przez CDN? lokalnie `npm i axe-core` w labie), Lighthouse (`npx lighthouse http://localhost:3000 --chrome-flags="--headless" --preset=desktop`), `docs/verification.md` (co sprawdzone, wyniki, co zostaje do sprawdzenia na prawdziwym telefonie).

Kryteria: brak poziomego scrolla; każdy nagłówek widoczny w reduced; kontrast ≥ 4.5:1 dla tekstu (axe); Lighthouse perf ≥ 90 desktop, a11y ≥ 95; brak błędów konsoli; `Zażółć gęślą jaźń` renderuje się w każdym kroju.

Audyt skillami: `impeccable` (polish), `review-animations` (każda animacja uzasadniona jednym zdaniem, timing z tokenów), lista Pre-Flight z `design-taste-frontend` §14 przepisana do `docs/verification.md` z odhaczeniem.

### Zadanie 18: Deploy i assety (K6)

**Pliki:** `wrangler.jsonc` (`name: neststudio`, `assets: { directory: './out', not_found_handling: '404-page' }`, `compatibility_date`), skrypt `npm run deploy` = `next build && wrangler deploy`, `public/favicon.svg` (z `mark-c-pole`), `public/og.png` (render Playwright z `lab/og.html`), `scripts/wordmark-svg.py` (fontTools: kontury "Nest Studio" → `public/brand/wordmark.svg`), `README.md` (jak uruchomić, jak podmienić placeholdery, jak wdrożyć), `docs/STAN.md` końcowy.

Uwaga: `wrangler deploy` wymaga konta Cloudflare i tokena; sesja tego nie ma. Zadanie kończy się na gotowej konfiguracji i instrukcji; deploy wykonuje Filip (`npx wrangler login && npm run deploy`).

## Zadania opcjonalne (po akceptacji Filipa)

- Formularz kontaktowy z Workerem (Resend/Mailchannels) zamiast mailto.
- Prawdziwe wywołanie modelu w AI demo (Worker z kluczem, limit zapytań) zamiast danych przykładowych.
- Strony case study (`/projekty/<slug>`) po dostarczeniu materiałów.
- Podmiana `--font-display` na Neue Plak po zakupie licencji.
