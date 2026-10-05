# v3: czerń + magenta, układ wg apple-design (05.10.2026)

Decyzja Filipa (05.10): teksty wyłącznie z dokumentu strategii (`docs/v2/source/copywriting-strategia.html`), poprawione skillem humanize-text tam, gdzie brzmiały jak AI (`docs/v3/teksty-humanize.md`); cała strona w nowym układzie; tło czarne, główny kolor magenta pink; projektowanie wg skilli `apple-design` i `apple-hig-expert`.

## Kolor (kontrast sprawdzony wzorem WCAG z apple-hig-expert)

| Token | Wartość | Kontrast | Do czego |
|---|---|---|---|
| `--canvas` | `#000000` | | tło strony |
| `--tile` | `#101012` | | kafle (jedyna „powierzchnia” strony) |
| `--tile-2` / `--tile-3` | `#1c1c1e` / `#2c2c2e` | | pola formularza, chipy, hover |
| `--ink` | `#f5f5f7` | 19,3:1 | tekst główny |
| `--ink-2` | `#a1a1a6` | 8,2:1 (7,0:1 na kaflu) | tekst drugorzędny |
| `--ink-3` | `#6e6e73` | 4,1:1 | tylko dekoracja, duży tekst, [placeholdery] |
| `--accent` | `#ff3d9e` | 6,4:1 (5,5:1 na kaflu) | etykiety, linki, nić, przycisk |
| `--on-accent` | `#0a0a0a` | 6,4:1 na magencie | tekst na przycisku (biały dawał 3,5:1, za mało) |

Jeden akcent. Kolory projektów (zrzuty) są jedyną inną barwą, jak w dokumencie (rozdz. 7).

## Typografia

SF Pro na urządzeniach Apple (`-apple-system`), wszędzie indziej Inter Variable z osią optycznego rozmiaru (`opsz`, latin + latin-ext). Zgodnie z apple-design §15: rozmiar, interlinia i tracking idą parami (duże: ciasno i ujemnie, do −0,038em; tekst 17 px: −0,011em). Hierarchia z wagi + rozmiaru (700 nagłówki, 600 etykiety, 500 lead).

## Układ

- Otwarcia sekcji w stylu keynote: etykieta w akcencie, nagłówek w liniach z dokumentu, lead; wyśrodkowane (realizacje, usługi, proces, CTA) albo w lewej kolumnie ze sticky (jeden kierunek, FAQ, bloki podstron).
- Kafle `#101012` z promieniem 22–30 px, odstęp 12–20 px. Bento usług: branding i strony duże (rdzeń oferty, rozdz. 1), grafika, automatyzacje, AI małe.
- Realizacje wg wireframe'u (rozdz. 6): projekt 01 na całą szerokość, 02 i 03 obok siebie.
- Nawigacja: przezroczysty materiał (`blur(20px) saturate(180%)`), miękka krawędź pod paskiem dopiero gdy treść pod nim przewija się; na telefonie arkusz zjeżdża z paska i wraca tą samą drogą.
- Cele dotyku min. 44 px (HIG): przyciski 48 px, mały przycisk 36 px z obszarem 44 px, linki w nawigacji i stopce.

## Ruch (apple-design)

- Natywne przewijanie (Lenis usunięty): treść porusza się 1:1 z ręką.
- Jedna sprężyna krytycznie tłumiona (damping 1.0, bez odbicia, nic tu nie jest rzucane) jako CSS `linear()`, trzy odpowiedzi: 440 / 590 / 810 ms. Przejścia CSS startują od bieżącej wartości, więc są przerywalne.
- Reakcja na wciśnięcie (`:active`, 100 ms), nie na puszczenie.
- Każda sekcja ma swój ruch: hero się „materializuje” (blur + wznoszenie), scena rośnie przy scrollu; projekt 01 otwiera się z wciętej karty na pełny kafel (scrub, „mocniejszy moment” z dokumentu); tekst „jednego kierunku” rozjaśnia się słowo po słowie pod scrollem; nić przebiega 01 → 02 → 03; kafle usług wjeżdżają rzędami; linia procesu jest sterowana scrollem (cofasz, cofa się); zdjęcie studia odsłania się od dołu; FAQ otwiera się na sprężynie; pytanie CTA wychodzi z ciemności.
- Motyw własny (rozdz. 7, „jeden charakterystyczny detal”): magentowa nić. Pojawia się w trzech elementach kierunku, w linii procesu, przy wierszach list i w zasadach studia.
- `prefers-reduced-motion`: zero podróży i skalowania, treść od razu widoczna, przełącznik ruchu startuje zatrzymany. `prefers-reduced-transparency`: pasek pełny czarny. `prefers-contrast: more`: jaśniejszy tekst i obwódki kafli.

## Obiekty

Te same obiekty z Remotion (`remotion/src/v2`), przerenderowane paletą `magenta` (`remotion/src/v2/palette.ts`, `scripts/render-magenta.sh`, 9 renderów, ok. 5 min): jasnoróżowe światła zamiast złota, więc poświata nie żółknie. Pasy WebGL w tle zostały wyłączone (apple-design §14: żadnych ruchomych teł na cały ekran; kod został w `src/scene/bands`).

## Sprawdzanie

- `node lab/serve.mjs 4801 ../out` po `npm run build`, potem `MSYS_NO_PATHCONV=1 node lab/site-shot.mjs / pl` (desktop, telefon, reduced motion) i `node lab/pages-shot.mjs` (podstrony, menu, walidacja formularza, FAQ).

## Dopisane wieczorem 05.10

- **Rytm tekstu:**  (12 px: etykieta i tytuł),  (24 px: tytuł i tekst, akapity),  (48 px: tekst i metka/akcje, zawsze z cienką linią). Jeden odstęp na wszystko jest zakazany.
- **Siatka:** 6 kolumn wyrównanych do , linie , stałe w tle, maska u góry i dołu ekranu; sekcja opinii rysuje na nich swoje linie i krzyżyki.
- **Proces:** film z HyperFrames (, 1080×1080, 12 s, 4 rozdziały po 3 s; nić zbiera fakty w węzeł, rysuje strukturę i wybiera kierunek, struktura staje się makietą z testami, paczka idzie dalej i rośnie). Na stronie: tor 400svh, scena sticky,  z pościgiem krytycznie tłumionym (stała 70 ms), etap = rozdział, w którym jest film, przyciąganie do kadrów końcowych (2,85 / 5,9 / 8,9 / 11,9 s) z rzutem pędu (wzór Apple, d = 0,998). Wideo kodowane z GOP 2, inaczej przewijanie wstecz szarpie.
