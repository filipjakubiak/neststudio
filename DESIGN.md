# Design System: Nest Studio

> Jedyne źródło prawdy dla tokenów (odpowiednik `MASTER.md` ze skilla `paint`). Kod odwzorowuje ten plik w `src/styles/tokens.css` (zmienne CSS) i w `@theme` Tailwinda. Każda wartość w komponencie ma pochodzić stąd. Zero magicznych liczb.

## 1. Atmosfera

Czarna, przestronna scena typograficzna. Monumentalny grotesk z ciasnym trackingiem i mono mikro-labelki. Jeden materiałowy akcent zamiast koloru: płynny chrom, używany oszczędnie jako bohater. Suwaki: wariancja 9 (asymetria, kotwica zmienia się sekcja po sekcji), ruch 10 (scroll jako playhead, jedna scena 3D pod stroną), gęstość 3 (galeria). Strona ma jeden motyw: ciemny. Jedyne odwrócenie to blok Projektów na bieli, wprowadzone jako moment fabuły (cięcie na papier), nie jako naprzemienność sekcji.

## 2. Kolor i role

Monochrom. Sześć ról, jeden akcent-materiał.

| Rola | Nazwa | Wartość | Użycie |
|---|---|---|---|
| canvas | Noir | `#0A0A0B` | tło strony, nigdy `#000000` |
| surface | Graphite | `#141416` | overlay menu, stopka, pola formularza |
| ink | Bone | `#F4F4F5` | tekst główny, wordmark, primary CTA (tło) |
| ink-soft | Ash | `#8A8A90` | tekst drugorzędny, labelki (kontrast 5.4:1 na Noir) |
| ink-faint | Slate | `#3A3A3F` | disabled, siatka, ślady nici w tle |
| hairline | Hairline | `rgba(244,244,245,0.12)` | separatory 1 px, obrys ghost-pigułek |
| accent | Chrome | materiał (WebGL); fallback: `linear-gradient(135deg,#F5F5F5 0%,#8C8C90 38%,#2B2B2E 58%,#E8E8EA 100%)` | kropla w hero i CTA, rama portretu, hover znaku |

Blok jasny (Projekty) odwraca role: canvas `#F4F4F5`, surface `#EAEAEC`, ink `#0A0A0B`, ink-soft `#5C5C63` (7.1:1), hairline `rgba(10,10,11,0.12)`. Jeden motyw na sekcję, redefinicja zmiennych na `[data-theme="light"]`.

Semantyczne (tylko formularz i status demo AI): success `#8FE3B0`, warning `#F2D479`, error `#F08A8A`. Nigdy jako dekoracja.

Zakazy: żaden drugi kolor, żaden gradient poza fallbackiem chromu, żaden neon, żaden glow, żadne pure black.

## 3. Typografia

Dwie rodziny, obie self-hosted (woff2, subsety latin + latin-ext, `font-display: swap`):

- **Display i tekst:** Space Grotesk Variable, wagi 300 do 700, używane: 400 (tekst), 500 (display, nagłówki, przyciski). Nigdy 600+ w display: autorytet ze skali i trackingu (zasada z Revolut/GSAP). Zmienna `--font-display` osobna od `--font-text`, żeby Neue Plak dało się podmienić jedną linią.
- **Mono:** Space Mono 400 i 700. Mikro-labelki, timecode playera, numery stacji procesu, metryki w case studies (tabular).

| Token | Rozmiar | Interlinia | Tracking | Waga |
|---|---|---|---|---|
| `--t-display` | `clamp(3.4rem, 10vw, 11rem)` | 0.92 | -0.04em | 500 |
| `--t-h1` | `clamp(2.6rem, 6.5vw, 6.5rem)` | 0.96 | -0.035em | 500 |
| `--t-h2` | `clamp(2rem, 4.5vw, 4.25rem)` | 1.0 | -0.03em | 500 |
| `--t-h3` | `clamp(1.375rem, 2.2vw, 2rem)` | 1.1 | -0.015em | 500 |
| `--t-lead` | `clamp(1.125rem, 1.5vw, 1.375rem)` | 1.45 | -0.005em | 400 |
| `--t-body` | `1.0625rem` | 1.6 | 0 | 400 |
| `--t-small` | `0.9375rem` | 1.55 | 0 | 400 |
| `--t-caption` | `0.8125rem` | 1.4 | 0.01em | 400 |
| `--t-label` | `0.6875rem` | 1.2 | 0.14em | mono 400, uppercase |

Zasady: `text-wrap: balance` na nagłówkach, `pretty` na akapitach. Miara akapitu 62ch. Jasny tekst na ciemnym: interlinia +0.05 i tracking +0.005em względem wartości dla bieli (kompensacja). Hero na telefonie schodzi o rung: `--t-h1`. Nagłówki max 2 do 3 linie na desktopie. Emfaza wewnątrz nagłówka: waga 300 lub kursywa tej samej rodziny, nigdy inna rodzina. Zero em-dash i en-dash w treści.

## 4. Przestrzeń i siatka

Baza 4 px. Skala: `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32, `--s-7` 48, `--s-8` 64, `--s-9` 96, `--s-10` 128, `--s-11` 192.

- `--section: clamp(6rem, 12vw, 12rem)` odstęp między sekcjami; więcej nad nagłówkiem niż pod nim.
- `--gutter: clamp(1rem, 4vw, 4rem)`; treść nigdy do krawędzi, media (scena, showreel) tak.
- `--max-grid: 1440px`, `--max-text: 1200px`, `--measure: 62ch`.
- Siatka 12 kolumn, `gap: var(--s-5)`; cienka pionowa siatka w tle (6 linii, `--ink-faint` na 0.35) jak u Evolve, wyłączona pod 768 px.
- Breakpointy: 360 (minimum), 640, 768, 1024, 1280, 1536. Poniżej 768 każda wielokolumnowość staje się jedną kolumną.
- Pełna wysokość: `min-height: 100dvh`, nigdy `100vh`.

## 5. Kształt, krawędzie, głębia

- Kontenery, media, arkusze: radius 0. Elementy interaktywne (przyciski, chipy, przełącznik języka): pigułka 9999 px. To cały słownik kształtów; udokumentowana reguła, bez wyjątków.
- Separacja przez hairline 1 px i negatywną przestrzeń. Zero kart, zero cieni. Głębia tylko z WebGL, paralaksy i overlayu (blur 24 px na `#141416` 92%).
- Focus: `outline: 2px solid var(--ink); outline-offset: 3px`, nigdy usuwany.

## 6. Komponenty

- **Przycisk primary:** tło Bone, tekst Noir, pigułka, `padding: 14px 20px 14px 24px`, Space Grotesk 500 `--t-small`, strzałka w osobnym kółku 32 px (`rgba(10,10,11,0.08)`) po prawej. Hover: kółko przesuwa się o 2 px w prawo i 1 px w górę, tło kółka 0.16; active: `scale(0.98)`; focus: ring; disabled: opacity 0.4, `cursor: not-allowed`. Magnetyzm ±12 px tylko na `(hover: hover) and (pointer: fine)`.
- **Przycisk ghost:** przezroczysty, hairline, tekst Bone; hover: hairline 0.4.
- **Link tekstowy:** podkreślenie 1 px z `text-underline-offset: 0.2em`, hover: przesunięcie offsetu do 0.3em (200 ms).
- **Labelka (eyebrow):** mono `--t-label`, Ash, uppercase. Maksymalnie 4 na stronę: hero, showreel, usługi, kontakt.
- **Nav:** 64 px, sticky, przezroczysty; po 80 px scrolla `backdrop-filter: blur(16px)` i hairline dół. Wordmark lewo, prawo: przełącznik PL/EN, CTA primary, przycisk menu (dwie linie morfujące w X). Overlay: pełny ekran, linki `--t-h2` wchodzą maską ze staggerem 60 ms.
- **Nić-rail:** 1 px pionowa linia na prawej krawędzi (desktop ≥ 1024), 40 px od brzegu, od 20vh do 80vh; markery sekcji jako sploty 6 px; aktywny splot Bone, przeszłe Ash, przyszłe Slate. Klik przenosi do sekcji. Ukryty dla `prefers-reduced-motion` (zostaje statyczna lista kotwic w menu).
- **Arkusz projektu:** biały blok, siatka 12: nazwa `--t-h2` (kol. 1 do 7), metryka mono `--t-h1` tabular (kol. 8 do 12), zakres jako chipy ghost, rok mono. Cover: generatywny SVG splotu z seedem projektu.
- **Akordeon usług:** 4 pionowe pasma w `flex`, `flex: 1`; hover/focus/tap rozszerza do `flex: 3` (GSAP, 600 ms expo.out); pasmo ma tytuł obrócony? Nie: tytuł poziomy u dołu, po rozszerzeniu wjeżdża opis i mikro-animacja. Mobile: stack pionowy, każde pasmo 100% szerokości, rozwijane wysokością przez GSAP.
- **FAQ:** wiersze z hairline, pytanie `--t-h3`, ikona `+` obracająca się w `×` (200 ms), odpowiedź rozwijana GSAP (height auto), `aria-expanded`.
- **Player showreela:** pasek dolny: mono timecode `00:00:00`, progres 1 px, labelki cięć, przycisk Play/Pauza (pigułka ghost). Gotowy na `<video>`: gdy jest `src`, gra wideo; gdy nie ma, gra sekwencja generatywna.
- **Formularz kontaktowy (jeśli wybrany):** pola z hairline dołem, label nad, błąd pod polem w `error`, `aria-live`.
- **Ikony:** `@phosphor-icons/react`, weight `light` (1.5 px), rozmiary 16/20/24. Jedna rodzina. Zero emoji.

## 7. Ruch

| Token | Wartość | Użycie |
|---|---|---|
| `--d-micro` | 160 ms (hover), 240 ms (toggle) | stany, ikony |
| `--d-base` | 400 do 600 ms | akordeony, FAQ, nav |
| `--d-enter` | 800 ms | wejścia tekstu i mediów |
| `--d-macro` | 1200 ms | preloader, przejścia stanu sceny |
| `--e-out` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out) | wejścia |
| `--e-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | stany scrubowane, przełączenia |
| `--e-weave` | CustomEase `M0,0 C0.2,0 0.1,1 1,1` | splatanie nici |
| stagger | 40 do 60 ms linie, 8 ms znaki, 30 ms elementy list | |
| wyjścia | 60% czasu wejścia | |

Reguły: tylko `transform`, `opacity`, `clip-path` (i `height` wyłącznie w akordeonach przez GSAP na elemencie poza layoutem krytycznym). Scrub 0.8 do 1.2. Żadnego `linear`, `ease-in-out`, bounce, elastic. Każda animacja musi dać się uzasadnić jednym zdaniem (hierarchia, narracja, feedback, zmiana stanu). Wszystko w `gsap.matchMedia`: wariant `(prefers-reduced-motion: reduce)` pokazuje treść od razu, bez pinów, bez sceny WebGL, akordeony przełączają się natychmiast.

## 8. Anty-wzorce (zakazane)

Inter/Roboto/Arial jako font; pure black; drugi kolor; neon, glow, gradient text; karty na wszystkim; trzy równe karty w rzędzie; eyebrow nad każdą sekcją; liczniki sekcji `01/06`; scroll cue; custom cursor; em-dash i en-dash; wymyślone metryki bez oznaczenia; fałszywe screenshoty z divów; "Elevate/Seamless/Unleash" i polskie odpowiedniki ("innowacyjny", "kompleksowy", "najwyższej jakości"); lorem ipsum; emoji; `window.addEventListener('scroll')`; `100vh`; `transition: all`.

## 9. Zmienne CSS (do `src/styles/tokens.css`)

```css
:root {
  --canvas: #0A0A0B; --surface: #141416; --ink: #F4F4F5; --ink-soft: #8A8A90; --ink-faint: #3A3A3F;
  --hairline: rgba(244,244,245,0.12);
  --chrome: linear-gradient(135deg,#F5F5F5 0%,#8C8C90 38%,#2B2B2E 58%,#E8E8EA 100%);
  --ok: #8FE3B0; --warn: #F2D479; --err: #F08A8A;

  --font-display: 'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif;
  --font-text: 'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  --t-display: clamp(3.4rem, 10vw, 11rem); --t-h1: clamp(2.6rem, 6.5vw, 6.5rem); --t-h2: clamp(2rem, 4.5vw, 4.25rem);
  --t-h3: clamp(1.375rem, 2.2vw, 2rem); --t-lead: clamp(1.125rem, 1.5vw, 1.375rem); --t-body: 1.0625rem;
  --t-small: 0.9375rem; --t-caption: 0.8125rem; --t-label: 0.6875rem;

  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;
  --s-9: 96px; --s-10: 128px; --s-11: 192px;
  --section: clamp(6rem, 12vw, 12rem); --gutter: clamp(1rem, 4vw, 4rem);
  --max-grid: 1440px; --max-text: 1200px; --measure: 62ch;

  --r-0: 0; --r-pill: 9999px;

  --d-micro: 160ms; --d-toggle: 240ms; --d-base: 500ms; --d-enter: 800ms; --d-macro: 1200ms;
  --e-out: cubic-bezier(0.16, 1, 0.3, 1); --e-inout: cubic-bezier(0.65, 0, 0.35, 1);

  --z-scene: 0; --z-content: 1; --z-rail: 20; --z-nav: 30; --z-overlay: 40; --z-preloader: 50;
}
[data-theme="light"] {
  --canvas: #F4F4F5; --surface: #EAEAEC; --ink: #0A0A0B; --ink-soft: #5C5C63; --ink-faint: #C9C9CE;
  --hairline: rgba(10,10,11,0.12);
}
```
