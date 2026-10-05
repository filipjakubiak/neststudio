# STAN prac: Nest Studio

> Aktualizowany na każdym kamieniu milowym. Filip: zacznij czytać tutaj.

## 05.10.2026 (wieczór): poprawki Filipa + proces z HyperFrames

- **Statyczne animacje, przyczyny (debug z dowodami, `lab/*-probe.mjs`):** (1) obiekt widoczny od razu dostawał `play()` przed `load()` z drugiego obserwatora, `load()` przerywał odtwarzanie i obiekt stał na pierwszej klatce (wyścig, stąd „niektóre”; najczęściej hero na telefonie), naprawione w `ObjectLoop`; (2) CSS `scroll-behavior: smooth` animował skok do `#kotwicy` przy wejściu, a odświeżenie ScrollTriggera go przerywało: `/#uslugi` lądowało w hero, naprawione w `ScrollRefresh`; (3) puste cele GSAP (szum w konsoli).
- **Oddech między tekstami:** trzy stopnie rytmu (`--gap-related/sequence/group` w `sections.css`), kafle usług w trzech grupach (opis / obiekt / zakres + link pod linią, linki w rzędzie na jednej wysokości), projekty z metką pod linią, kafle kierunku z numerem u góry i tekstem na dole, CTA, studio, kontakt, bloki podstron.
- **CTA:** tekst do lewej, gniazdo po prawej.
- **Opinie (3.3):** sekcja po realizacjach, na siatce z liniami i krzyżykami; do czasu prawdziwych opinii nawiasy z dokumentu (test tego pilnuje).
- **Siatka strony:** 6 bardzo słabych linii kolumn (2 na telefonie), stała w tle, wygaszana u góry i dołu ekranu (`GridGuides`).
- **Proces = film HyperFrames:** `videos/proces` (kompozycja, `npm run check`/`render` przez plugin hyperframes), render `public/v3/proces` (MP4 z klatkami kluczowymi do przewijania w obie strony + 4 kadry). Sekcja przypięta, scroll steruje czasem filmu (wygładzanie bez przestrzału), po puszczeniu osiada na najbliższym ukończonym etapie z uwzględnieniem pędu, klik w etap przewija do niego; reduced motion: lista z kadrami. Opis: `docs/v3/system.md`.
- Zainstalowane skille: `landing-page-guide` (projekt).

## 05.10.2026: v3, czerń + magenta, układ wg apple-design, gałąź `nest-v2`

Filip: teksty tylko z dokumentu strategii (nic nie dopisywać), potem humanize-text tam, gdzie brzmią jak AI; cały układ od nowa; czarne tło, główny kolor magenta pink; projektować wg `apple-design` + `apple-hig-expert` (zainstalowany: `.agents/skills/apple-hig-expert`, link w `.claude/skills`).

- **Struktura = dokument:** strona główna (hero, realizacje, jeden kierunek, usługi, proces, studio, FAQ, CTA, stopka), 5 podstron usług, realizacje, studio, kontakt; PL + EN. Wypadły rzeczy spoza dokumentu: sekcja liczb, wymyślone opisy projektów.
- **Teksty:** 14 zdań poprawionych humanize (ocena 66% → 90%), wszystkie półpauzy usunięte. Lista przed/po: `src/content/edits.ts`, opis: `docs/v3/teksty-humanize.md`. Test pilnuje, że każdy tekst jest z dokumentu albo z tej listy.
- **Wygląd i ruch:** `docs/v3/system.md` (tokeny z kontrastem, Inter opsz / SF Pro, kafle, materiał nawigacji, jedna sprężyna bez odbicia, natywny scroll, magentowa nić jako motyw, ruch każdej sekcji). Obiekty przerenderowane na magentę. Pasy WebGL wyłączone (kod został).
- **Sprawdzone w Chrome:** desktop 1440, telefon 390, reduced motion, wszystkie podstrony; menu (fokus, Escape), walidacja formularza inline, FAQ; zero błędów konsoli; 17 testów, typecheck, build OK.
- **Placeholdery i czego potrzebuję:** `docs/placeholders.md` (sekcja v3).
- Podgląd: `npm run dev` → http://localhost:3000/ albo build + `node lab/serve.mjs 4801 ../out` → http://localhost:4801/. Strona nie jest jeszcze nigdzie publicznie wdrożona (gotowy `wrangler.jsonc`, `npm run deploy`).

## 30.09.2026 (4): STRONA v2 GOTOWA (do poprawek), gałąź `nest-v2`

Filip: „dowieź gotową stronę, potem poprawiamy; teksty w większości z .html”. Zrobione i sprawdzone w Chrome (desktop 1440, mobile 390, reduced motion), PL `/` i EN `/en/`, build statyczny OK, 15 testów OK, zero błędów konsoli.

- **Sekcje (kolejność Filipa):** hero, liczby, jeden kierunek (who), realizacje, usługi (bento, 5 kafli), studio + dlaczego my, opinie, zespół, proces, wycena + FAQ, klienci (marquee), CTA, kontakt (formularz), stopka. Teksty ze strategii (`docs/v2/copy.md`), EN = tłumaczenie.
- **Obiekty (Remotion, czerwone, pętle bez szwu):** splot (hero), skaner (branding), kostka (strony), przeplyw (automatyzacje), siatka (AI), proces (4 etapy, szeroki + pionowy), gniazdo (CTA). `npm run v2:render -- <obiekt> <kadr>`. Na stronie `ObjectLoop`: leniwie, gra tylko w widoku, pauza przełącznikiem.
- **Pasy (WebGL):** `src/scene/bands/` (fold, recipes, layout z omijaniem tekstu po realnym zasięgu tekstu, engine ładowany w idle), plan w `src/components/Site.tsx` (5 pasów; na telefonie tylko poziome).
- **Ruch:** przełącznik w nawigacji (czerwona kropka) zatrzymuje pętle, światło pasów i marquee (WCAG 2.2.2); reduced motion startuje zatrzymany. Proces: etap zapala się, gdy kometa w wideo mija jego płytkę.
- **Usunięte z v1:** preloader, scena nici, chrom-przewodnik, stare sekcje (historia w gicie; źródło chromu zostaje w `remotion/`).
- **Pułapka naprawiona:** `@layer components` deklarowane przed importem Tailwinda przegrywało z preflightem (zerowało paddingi sekcji). Teraz `@layer theme, base, components, utilities;` na początku `globals.css`.
- **Placeholdery i czego potrzebuję:** `docs/placeholders.md` (sekcja v2).
- Podgląd lokalny: `npm run build`, potem `node lab/serve.mjs 4801 ../out` → http://localhost:4801/ ; spacer ze zrzutami: `MSYS_NO_PATHCONV=1 node lab/site-shot.mjs / pl`.

## 30.09.2026 (3): czerwień 1:1 + systemy pasów i obiektów

Filip: Splot tempo OK, pasy OK, **kierunek czerwony 1:1 jak w referencji**; pasy i rendery mają się budować pod różne scenariusze. Opis obu systemów, paleta zmierzona na klatkach referencji: `docs/v2/system.md`.

- **Obiekty:** biblioteka `remotion/src/v2/` (paleta, materiały, wspólna scena z Neutral tone mapping + bloom o niskim progu, obiekty jako moduły, kadry square/wide/tall). Jedna komenda `npm run v2:render -- splot square red`: render, kontrola szwu pętli, WebM/MP4 desktop+mobile, plakat, manifest w `public/v2/objects/`. Splot czerwony wyrenderowany (square, tall). Stary `remotion/src/lookdev/` usunięty; `lab/v2-lookdev` zostaje jako historia (paleta Nest).
- **Pasy:** `lab/v2-bands/` = fold.js (geometria) + recipes.js (cross, drop, hook; fałdy crisp/soft/roll) + layout.js (przerwy mierzone z treści, zwężanie, automatyczne zjeżdżanie pionowego odcinka z tekstu albo degradacja do cross, raport `[bands]` w konsoli) + bands.js (czerwony materiał, szeroka gładka plama światła). Plan strony w JSON (`#band-plan`), z nadpisaniami na telefon.
- Sprawdzone w Chrome 1440 i 390: pasy w przerwach, gradient bez białej kropki, na telefonie pasy poziome.

Dalej: DESIGN.md v2 (czerwień, pasy, kafle), przeniesienie pasów do `src/scene/bands/` i szkielet sekcji w Next.js na `docs/v2/copy.md`; kolejne obiekty (Gniazdo do CTA, mini-obiekty usług, kometa procesu).

## 30.09.2026 (2): v2, teksty + pasy w tle

Filip: paleta Nest, światło OK, tempo za szybkie; obiekty minimalistyczne, ruch subtelny; w tle strony zamiast nici **szerokie pasy** (zgięte 90° / zawinięte, przez pas przechodzi światło); bento punktowo. Teksty i strategia: `docs/v2/source/copywriting-strategia.html` → wersja Nest w `docs/v2/copy.md`. Struktura, warstwy i świadome odstępstwa od strategii (ciemna paleta, obiekt w hero, bez pinów/preloadera): `docs/v2/struktura.md`.

- **Splot wolniejszy:** pętla 12 s (360 klatek), 1 kometa na nić, cichsze głowy. Szew bez skoku (PSNR 41,9 = jak sąsiednie klatki).
- **Look-dev #2 pasy, prototyp na żywo:** `lab/v2-bands/` (`fold.js` = czysta geometria taśmy składanej jak papier: fałd pod 45° na każdym zakręcie, mały promień = ostry narożnik, duży = miękkie zawinięcie; `bands.js` = three.js, kamera ortho w pikselach strony, pozycje pasów liczone z przerw między treścią sekcji, scroll wsuwa taśmę wzdłuż drogi, po satynie wolno sunie plama ciepłego światła; reduced-motion: pasy statyczne). Uruchom: `node lab/serve.mjs` → http://localhost:4800/v2-bands/, zrzuty `node lab/bands-shot.mjs`.
- Sprawdzone w Chrome desktop 1440 i mobile 390: pasy w przerwach, nie za tekstem; na telefonie pionowe odcinki przy prawej krawędzi.

Do decyzji Filipa: akceptacja pasów (kształt, ilość, jasność światła) i wolnego Splotu → potem DESIGN.md v2 i szkielet sekcji w Next.js. Fakty z `docs/v2/struktura.md` §5.

## 30.09.2026: v2, gałąź `nest-v2` (przebudowa sekcji + obiekty renderowane)

Filip przebudowuje stronę: nowa kolejność sekcji (hero, stats, who we are, portfolio, what we do, about + why us, testimonials, team, proces, pricing, partnerzy, CTA, kontakt, stopka) i nowy język wizualny wg referencji (bento z obiektami 3D, gdzie światłem jest sam obiekt). Szkielet, siatka, spoiwo i lista faktów do zebrania: `docs/v2/struktura.md`. Teksty dosyła Filip.

**Look-dev #1 „Splot” (hero), zrobiony:** `remotion/src/lookdev/Splot.tsx`, kompozycje `Splot` (paleta Nest: kość → Rim Warm → bursztyn) i `SplotRed` (czerwień z referencji). Trzy nici splecione w obręcz gniazda wokół grafitowej płyty; po każdej biegną 2 komety, które są jedynym światłem sceny (point light w głowie komety). Bloom, ACES, ziarno tylko na świetle, krawędź klatki do czystej czerni. Pętla 4 s / 120 klatek bez szwu (PSNR ostatnia→pierwsza = jak między sąsiednimi klatkami). Na stronie: wideo z `mix-blend-mode: screen` na Noir; WebM 960 px ≈ 420 kB, MP4 ≈ 630 kB, plakat AVIF 12 kB.
Podgląd w kontekście: `lab/v2-lookdev/index.html` (hero + kafle bento, przełącznik palet), zrzuty: `node lab/lookdev-shot.mjs`.
Render: `cd remotion && npx remotion render src/index.ts Splot out/lookdev/Splot --sequence --image-format=png --gl=angle --image-sequence-pattern=[frame].[ext]`, potem ffmpeg (komendy w historii sesji; do przeniesienia w skrypt przy kolejnych obiektach).

Do decyzji Filipa: paleta (Nest ciepła czy czerwona; ACES przesuwa czerwień w pomarańcz, prawdziwa czerwień wymaga innego mapowania tonów), akceptacja stylu przed kolejnymi obiektami, fakty z listy w `docs/v2/struktura.md` §4.

## 29.09.2026 wieczór: gałąź `nest-chrome-remotion` (scalenie trzech strumieni)

Wersja z chromem + nowe teksty + nowe gniazdo + chrom z Remotion, scalone i sprawdzone razem na GPU (Chrome, RX 9070 XT): desktop 1440×900 i mobile 390×844, 10 sekcji, klatki 0 → 239 bez cofania, zero błędów konsoli. Po scaleniu: soczewka w showreelu podniesiona i zmniejszona (nie gasi białych nagłówków), martwe `dropDetail` usunięte, `agentRules: false` w next.config. Znane drobiazgi: na telefonie w Kontakcie kropla ląduje nad nagłówkiem, nie w środku gniazda; przez chwilę w showreelu na telefonie soczewka nachodzi na "To nie jest film."; nić w sekcjach środkowych subtelna (180 do 250 px). Gałąź `claude/nest-studio-title-sequence-3yjej7` zostaje jako alternatywa, nie scalona.

## 29.09.2026: chrom z Remotion (D16)

Kropla liczona na żywo w Three.js zastąpiona sekwencją 240 klatek z Remotion (`remotion/`, render `npm run chrome:render`). Chrom prowadzi oko przez całą stronę: kropla w nagłówku, pęknięcie na linii napięcia, soczewka w showreelu, nić wskazująca projekt / usługę / stację procesu, lądowanie w gnieździe przy CTA. Szczegóły: DESIGN.md §7a, decyzja D16. Do decyzji Filipa: czy nić w sekcjach środkowych ma być większa (teraz subtelna, 180 do 250 px), i czy zostawiamy 240 klatek (jest zapas budżetu na 300+).

## 29.09.2026: nowe teksty (gałąź roboczy worktree, niewypchnięte)

Wszystkie teksty PL i EN napisane od nowa wokół jednej idei: **splecione trzyma, luźne się rwie**. Hero: "Projektujemy marki / i budujemy wszystko, / co je trzyma." Strategia, łuk narracji i uzasadnienia: `docs/copy.md`. Nowe: polska typografia (sieroty wiązane twardą spacją, `src/content/typography.ts`), testy zakazów stylu. Do decyzji Filipa: liczby i opisy projektów oraz obietnice procesu (`docs/placeholders.md`).

## Gdzie jesteśmy (28.09.2026, wieczór)

**K1 do K6 zrobione: strona działa w całości, zweryfikowana w przeglądarce, gotowa do deployu.** Szczegóły pomiarów: `docs/verification.md`. Lighthouse (renderowanie programowe): desktop perf 0,80, a11y/BP/SEO 1,0; mobile perf 0,55 (analiza: D14). Decyzje dodane w tej sesji: D13 (scena na dotyku po geście), D14 (preloader zostaje, LCP mobile to podmiana fontu).

Co jest:
- Next.js 16 static export, PL na `/`, EN na `/en/`, tokeny z `DESIGN.md`, fonty self-hosted (latin + latin-ext).
- Jedna scena Three.js pod całą stroną: nici (instancjonowane wstęgi, shader chaos → gniazdo → tunel) ; chrom to od 29.09 osobna kanwa 2D z klatkami Remotion (D16). Stan sceny sterowany przez GSAP z każdej sekcji; przesunięcie gniazda komponowane sekcja po sekcji (tekst po lewej, gniazdo po prawej).
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
