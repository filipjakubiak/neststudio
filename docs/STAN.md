# STAN prac: Nest Studio

> Aktualizowany na każdym kamieniu milowym. Filip: zacznij czytać tutaj.

## 29.09.2026: chrom z Remotion (D15)

Kropla liczona na żywo w Three.js zastąpiona sekwencją 240 klatek z Remotion (`remotion/`, render `npm run chrome:render`). Chrom prowadzi oko przez całą stronę: kropla w nagłówku, pęknięcie na linii napięcia, soczewka w showreelu, nić wskazująca projekt / usługę / stację procesu, lądowanie w gnieździe przy CTA. Szczegóły: DESIGN.md §7a, decyzja D15. Do decyzji Filipa: czy nić w sekcjach środkowych ma być większa (teraz subtelna, 180 do 250 px), i czy zostawiamy 240 klatek (jest zapas budżetu na 300+).

## Gdzie jesteśmy (28.09.2026, wieczór)

**K1 do K6 zrobione: strona działa w całości, zweryfikowana w przeglądarce, gotowa do deployu.** Szczegóły pomiarów: `docs/verification.md`. Lighthouse (renderowanie programowe): desktop perf 0,80, a11y/BP/SEO 1,0; mobile perf 0,55 (analiza: D14). Decyzje dodane w tej sesji: D13 (scena na dotyku po geście), D14 (preloader zostaje, LCP mobile to podmiana fontu).

Co jest:
- Next.js 16 static export, PL na `/`, EN na `/en/`, tokeny z `DESIGN.md`, fonty self-hosted (latin + latin-ext).
- Jedna scena Three.js pod całą stroną: nici (instancjonowane wstęgi, shader chaos → gniazdo → tunel) ; chrom to od 29.09 osobna kanwa 2D z klatkami Remotion (D15). Stan sceny sterowany przez GSAP z każdej sekcji; przesunięcie gniazda komponowane sekcja po sekcji (tekst po lewej, gniazdo po prawej).
- Preloader (2014 → rok, rysowanie znaku, raz na sesję), hero (intro maską, kropla w nagłówku, reaguje na kursor), napięcie (pin, rozsypane znaki wracają na miejsce), showreel (pin 400vh, cięcia w głąb, player z timecode i Odtwórz, cięcie na biel), projekty (biały blok, sticky stack, covery rysowane DrawSVG), usługi (akordeon poziomy z czterema mikro-animacjami), AI demo (przepływy składają się same, pakiet płynie po węzłach), proces (pin, nić rysuje się przez pięć stacji), studio (paralaksa, licznik lat), FAQ (GSAP height), finał (pin, kropla ląduje w gnieździe i trzyma), stopka (wordmark scrub, "Zapytaj Claude / ChatGPT / Perplexity").
- Nić-rail po prawej (desktop), menu overlay (clip-path, focus trap, Escape), Lenis + ScrollTrigger na jednym tickerze, pełne `prefers-reduced-motion`, fallback bez WebGL.
- Znak A + wordmark + lockup (SVG), favicon, OG, `wrangler.jsonc`, `_headers`, README.

Poprzednio (K1):

- `docs/concept.md`: brainstorm z briefu, tezy (wizualna, interakcyjna), motyw "nić", gramatyka strony, krzywa emocji z peakiem (showreel), signature move (persystentna scena nici + nić-rail), Design DNA JSON.
- `DESIGN.md`: jedyne źródło tokenów (kolor, typografia, przestrzeń, kształt, komponenty, ruch, zakazy).
- `docs/decisions.md`: 12 decyzji (m.in. Space Mono do labelek, PL+EN, mailto zamiast formularza, jedna scena Three.js zamiast Paper Shaders, bez custom cursora, preloader raz na sesję).
- `docs/brand.md` + `public/brand/*.svg`: głos, messaging, znak. **Rekomendacja: znak A "N z trzech nici"** (propozycja do akceptacji), B jako alternatywa, C jako favicon.
- `docs/copy.md`: wszystkie teksty PL i EN, autoaudyt.
- `docs/plan.md`: 18 zadań w 6 kamieniach (K2 szkielet → K6 weryfikacja i deploy).
- `docs/placeholders.md`: co jest tymczasowe i czym podmienić.

## Co dalej (wymaga Filipa)

1. **Test na prawdziwym sprzęcie**: iPhone (Safari) i desktop z GPU. W kontenerze WebGL szedł na CPU (SwiftShader). Lista w `docs/verification.md`.
2. **Deploy**: `npx wrangler login && npm run deploy` (Cloudflare Workers, static assets). Potem PageSpeed Insights dla potwierdzenia perf ≥ 90.
3. **Podmiana placeholderów** (`docs/placeholders.md`): domena, mail, telefon, NIP, social, zdjęcie, nazwy i metryki projektów, ewentualnie plik showreela (`SHOWREEL_SRC`).
4. Decyzje z listy poniżej.

Możliwe kolejne kroki po akceptacji: formularz kontaktowy przez Workera, prawdziwy model w AI demo (Worker + limit), podstrony case study, podmiana `--font-display` na Neue Plak po licencji.

## Otwarte pytania do Filipa (nie blokują; przyjęte wartości domyślne w `docs/decisions.md`)

1. Znak: A (N z nici), B (splot) czy inny kierunek?
2. Nazwy i metryki projektów (Perun Tac, TCC Global, Oboda Group): można pokazać? Jakie liczby?
3. Kontakt: mailto wystarczy na start, czy od razu Cal.com / formularz? Jaki adres e-mail?
4. Domena i dane do stopki (NIP, social).
5. Zdjęcie do sekcji Studio.
6. Zgoda na Three.js (chunk 555 kB raw, ok. 140 kB brotli, ładowany po preloaderze w `requestIdleCallback`; Turbopack nie wycina nieużywanych części three) w zamian za scenę 3D nici + chrome. Alternatywa: fallback SVG na stałe (perf 0,98 w Lighthouse).
7. Czy showreel ma zostać generatywny (obecnie: "To nie jest film" jako świadoma teza), czy podmieniamy na materiał wideo, gdy powstanie.

## Jak uruchomić

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static export do out/
npm test         # vitest
```
