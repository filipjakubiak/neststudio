# Weryfikacja (K6), 28.09.2026

Wszystko poniżej zostało **zmierzone**, nie założone. Środowisko: kontener Linux, Chromium 1194 (Playwright) z renderowaniem programowym WebGL (SwiftShader), czyli najgorszy możliwy GPU. Na prawdziwej maszynie scena będzie tylko szybsza.

## Co sprawdzono

| Test | Narzędzie | Wynik |
|---|---|---|
| Build static export | `next build` (16.3.6, Turbopack) | OK, `/`, `/en/`, `404.html` |
| Testy treści | `vitest` (7 testów) | zielone: parytet PL/EN, zero em/en-dash, 4 eyebrow, jedna etykieta CTA, 5 kroków w każdym presecie AI, `yearsInField(2026) === 12` |
| Typy | `tsc --noEmit` | zielone |
| Arkusz kontaktowy desktop 1440×900, 48 pozycji co pół ekranu | `lab/walk.mjs` | pełna narracja: hero → luka → showreel (tunel, kropla) → cięcie na biel → arkusze projektów (sticky stack) → usługi (gniazdo po prawej) → AI → proces (nić rysuje się na pinie) → studio → FAQ → finał (kropla ląduje w gnieździe) → stopka |
| Arkusz mobile 390×844, 30 pozycji | `lab/walk.mjs` | bez poziomego scrolla (`scrollWidth === clientWidth`), pin napięcia działa, kropla skalowana do wąskiego ekranu, projekty bez pinu, proces jako lista |
| Reduced motion, desktop | `lab/walk.mjs --reduce` | brak sceny WebGL (statyczny splot SVG + CSS-chrome w slocie), wszystkie nagłówki i treści widoczne bez animacji, brak pinów, brak preloadera, brak rail |
| Menu | `lab/menu.mjs` | otwarcie (clip-path z prawego górnego rogu, linki maską), fokus na pierwszym linku, `Escape` zamyka i zwraca fokus na przycisk |
| Błędy konsoli | Playwright `pageerror` | 0 na wszystkich przebiegach |
| Lighthouse desktop (SwiftShader, pomiar bez innych obciążeń) | lighthouse 13.5 | perf **0.80** (FCP 0,4 s, LCP 1,3 s, TBT 380 ms, CLS 0,007, SI 1,0 s), a11y **1.0**, best practices **1.0**, SEO **1.0** |
| Lighthouse desktop, reduced motion (bez WebGL) | lighthouse 13.5 | perf **0.98**, TBT 0 ms, LCP 1,2 s |
| Lighthouse mobile (emulacja Moto G, wolne 4G, CPU ×4, SwiftShader) | lighthouse 13.5 | perf **0.55** (FCP 1,8 s, LCP 6,5 s, TBT 870 ms, CLS 0, SI 3,5 s), a11y **1.0**, BP **1.0**, SEO **1.0**. Bez preloadera i bez sceny (reduced motion): perf 0.76, LCP 6,2 s, TBT 120 ms. Wniosek: symulowane LCP mobile to podmiana fontu po dociągnięciu Space Grotesk na wolnym łączu (element LCP: akapit lead), a TBT to hydracja i inicjalizacja GSAP pod CPU ×4 (ok. 200 ms realnie). Analiza i opcje: `docs/decisions.md` D13, D14. |
| Scena na dotyku | `lab/gesture.mjs` | przed gestem `data-mode="pending"`, po dotknięciu i scrollu `on`, bez błędów |
| Powtórna wizyta w sesji | `lab/revisit.mjs` | preloader pominięty przed pierwszym malowaniem (skrypt w `<head>`), hero widoczne od razu, bez mignięcia |
| Polskie znaki | zrzuty | ą ę ł ż ś ć ń widoczne w Space Grotesk 300/400/500 i Space Mono (labelki, licznik) |
| Znak | render 16 do 200 px, ciemne i jasne tło | czytelny od 16 px w wariancie w polu (favicon), splot widoczny od 40 px |

## Co poprawiono po pomiarach

1. Nici renderowały się jako drzazgi: wstęgi zmieniają kierunek nawinięcia wzdłuż krzywej i culling wycinał połowę trójkątów. Naprawa: `side: DoubleSide`.
2. Kropla mierzyła slot w hero, gdy linie były jeszcze pod maską (offset ~110 px). Naprawa: pomiar z offsetów layoutu, niezależny od transformów.
3. Pierścień gniazda był spleciony już w hero: `fromTo` na pozycji 0 w scrubowanej timeline kontaktu renderowało się przy starcie. Naprawa: tweeny stanu sceny nigdy na pozycji 0.
4. Lighthouse a11y 0.92 → 1.0: SplitText dodawał `aria-label` na `<p>/<span>` (`aria: 'none'`), wygaszone kroki procesu miały kontrast 2,3:1 (teraz zmiana koloru ink-soft → ink, min 5,4:1).
5. TBT 2 370 ms → 290 ms: scena startuje po preloaderze i w `requestIdleCallback`, splitowanie tekstu po `document.fonts.ready`.
6. Overlay menu przykrywał przycisk X: `--z-overlay` poniżej `--z-nav`.
7. Preloader renderował się dopiero po hydracji (mignięcie hero → preloader → hero): teraz jest w HTML, a skrypt w `<head>` decyduje przed malowaniem (powtórna wizyta, reduced motion) o jego pominięciu.
8. Linie hero chowane CSS-em były wczytywane przez GSAP jako `y: 88px` i po intro zostawały pod maską (nagłówek znikał): chowanie tylko pod kurtyną preloadera (`nest:prepare`), h1 maluje się od razu.
9. CSS 93,6 KB → 34,8 KB: Tailwind v4 skanował całe repo (markdown skilli) i emitował utility dla każdej wspomnianej klasy; skan ograniczony do `src/`.
10. Na dotyku scena startuje po pierwszym geście (D13), budżet 900 do 1 400 nici, DPR ≤ 1,25, kropla o niższej rozdzielczości.

## Pre-Flight (design-taste-frontend §14), stan

- [x] Design read i suwaki zapisane (`docs/concept.md`).
- [x] Zero em-dash na stronie (test).
- [x] Jeden motyw + jedno świadome cięcie na biel (Projekty), reszta ciemna.
- [x] Jeden akcent (chrome jako materiał), jeden system kształtów (kontenery 0, pigułki 9999).
- [x] Kontrast CTA: Bone na Noir / Noir na Bone.
- [x] CTA nie łamie się w dwie linie (desktop 1440 i mobile 390 sprawdzone).
- [x] Hero: h1 3 linie, lead 11 słów, 2 CTA, eyebrow jako jedyny mały element.
- [x] Eyebrow: 4 na 12 sekcji.
- [x] Jedna etykieta na intencję kontakt ("Rozpocznij projekt": nav, hero, finał).
- [x] Brak marquee, brak scroll cue, brak liczników sekcji, brak custom cursora.
- [x] Każda animacja ma uzasadnienie (tabela w `docs/concept.md` §4), żadnego fade-up jako domyślnego wejścia.
- [x] Reduced motion wszędzie (`gsap.matchMedia`), scena wyłączona.
- [x] `min-height: 100dvh`, zero `window.addEventListener('scroll')` (Lenis + ScrollTrigger).
- [x] Ikony z jednej rodziny (Phosphor light), własne SVG tylko dla znaku i mikro-ilustracji usług.
- [x] Placeholdery oznaczone `data-placeholder` i opisane.

## Czego NIE dało się sprawdzić w kontenerze (do zrobienia przez Filipa)

1. **Prawdziwy telefon** (iOS Safari): pasek adresu przy pinach, płynność sceny (budżet 1 800 nici, DPR ≤ 1,5, strażnik FPS przełącza na fallback poniżej ~25 fps). Kontener emuluje tylko szerokość.
2. **Prawdziwe GPU**: Lighthouse perf 0,80 to wynik z renderowaniem programowym (kompilacja i pierwsze klatki sceny liczone na CPU); na desktopie z GPU TBT powinien spaść wyraźnie poniżej 200 ms. Cel z briefu (≥ 90) do potwierdzenia po wdrożeniu (PageSpeed Insights). Mobile: patrz tabela i D14.
3. **Hover i magnetyzm**: przetestowane logicznie (tylko `(hover: hover) and (pointer: fine)`), nie wizualnie w ruchu.
4. **Odtwórz w showreelu**: przewijanie przez pin sterowane Lenis; w headless działa, na iOS wymaga sprawdzenia dotyku (przerwanie odtwarzania gestem jest obsłużone).
5. **Deploy** na Cloudflare (konfiguracja gotowa, brak konta w sesji).

## Jak powtórzyć

```bash
npm run build && (cd out && python3 -m http.server 4173)
# w drugim terminalu, z katalogu lab (npm i playwright-core lighthouse):
node walk.mjs http://localhost:4173/ desktop.png 1440 900 no 0.5 4
node walk.mjs http://localhost:4173/ mobile.png 390 844 no 0.75 8
node walk.mjs http://localhost:4173/ reduced.png 1440 900 reduce 1 4
npx lighthouse http://localhost:4173/ --preset=desktop
```

Skrypty labu (`walk.mjs`, `menu.mjs`, `spots.mjs`, `og.mjs`) są w `lab/` (poza buildem, ignorowane przez git poza plikami źródłowymi).
