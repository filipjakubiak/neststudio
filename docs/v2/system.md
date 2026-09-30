# Nest v2: jak budować pasy i obiekty pod różne scenariusze

> Dwa systemy, oba sterowane danymi: strona mówi CO i GDZIE, system liczy JAK. Paleta czerwona 1:1 z referencji (decyzja Filipa 30.09), wartości zmierzone na klatkach `docs/v2/source/referencja-render.mp4`.

## Paleta (zmierzona)

| Rola | Hex | Skąd |
|---|---|---|
| tło | `#000000` | tło referencji |
| linia kafla | `#150205` | ramki kart |
| czerwień gorąca | `#EB2E2A` | najjaśniejsze miejsce pasa „Selective Privacy” |
| czerwień środkowa | `#49181B` | gradient pasa |
| rdzeń światła | `#F8CCB8` / złoto `#E7C180` | głowy komet, krawędź kostki |
| pomarańcz / czerwień / ogon | `#B45123` / `#C22428` / `#5F200A` | orbity „Contract Shield” |
| żar | `#3A0007` | kropki „Implementation” |

Źródło w kodzie: `remotion/src/v2/palette.ts` (obiekty) i `lab/v2-bands/bands.js` (pasy). Tekst: Bone `#F4F4F5`, Ash `#8A8A90`.

## 1. Pasy w tle (WebGL na żywo)

Pliki: `lab/v2-bands/` (docelowo `src/scene/bands/`).

- `fold.js` geometria: taśma składana jak papier, każdy zakręt 90° to fałd pod 45°. Czysta funkcja, bez three.js, testowalna w Node.
- `recipes.js` przepisy kształtów: `cross` (prosto przez przerwę), `drop` (wzdłuż przerwy A, w dół, wzdłuż przerwy B; `from == to` daje U, `from != to` daje S/L), `hook` (w dół i koniec przy kolumnie). Style fałdu: `crisp` 6 px, `soft` 46 px, `roll` 90 px.
- `layout.js` dopasowanie planu do żywego układu: mierzy przerwy (ostatni element sekcji A → pierwszy element sekcji B), zwęża pas do najwęższej przerwy, **przesuwa pionowy odcinek do najbliższej wolnej kolumny**, gdy wszedłby na tekst, a gdy wolnej nie ma, zamienia pas na `cross`. Raport w konsoli jako `[bands]`.
- `bands.js` render, wjazd ze scrollem (taśma wsuwa się wzdłuż drogi), wędrujące czerwone światło, reduced-motion (pasy statyczne, światło w miejscu).

**Nowa strona lub nowy układ = tylko plan**, bez kodu:

```html
<script type="application/json" id="band-plan">
[
  { "name": "liczby", "recipe": "drop", "gaps": ["hero/stats", "stats/who"], "from": "right", "to": "left",
    "x": 0.8, "folds": ["crisp", "soft"], "period": 22,
    "mobile": { "recipe": "cross", "gap": "hero/stats" } }
]
</script>
```

`"hero/stats"` to przerwa między sekcjami o tych `id`. `x` to preferowana pozycja pionowego odcinka (ułamek szerokości); system i tak przesunie go z tekstu. `mobile` nadpisuje pola poniżej 900 px albo `false` wyłącza pas.

Zasady kompozycji: najwyżej jeden pas na dwie sekcje; sekcja z obiektem nie dostaje pasa w tym samym kadrze; na telefonie pasy tylko poziome (tekst ma całą szerokość).

## 2. Obiekty sekcji (Remotion)

Pliki: `remotion/src/v2/`.

- `palette.ts` rampy światła (`red` domyślna, `nest` do porównań).
- `materials.ts` wspólne materiały: `cometMaterial` (światło biegnące po rurce: żar → czerwień → złoto → rdzeń, z tłumieniem złota, żeby poświata została czerwona), `graphite`, `darkMetal`.
- `stage.tsx` wspólna scena: mapowanie tonów Neutral (trzyma czerwień, ACES ciągnie ją w pomarańcz), bloom z niskim progiem (czerwień ma małą luminancję), ziarno tylko na świetle, krawędź do czystej czerni, deterministyczne klatki.
- `objects/<nazwa>.ts` sam obiekt: scena + kamera + `update(t)` dla fazy pętli `t ∈ [0,1)`. Musi być okresowy: nic nie może się obracać, jeśli obrót nie jest symetrią całej sceny.
- `objects/index.ts` rejestr. Każdy obiekt dostaje kompozycje `v2-<obiekt>-<kadr>-<paleta>` dla kadrów `square` (1200², kafel / bok hero), `wide` (1920×1080, pełna szerokość), `tall` (1080×1440, wąska kolumna / telefon).

**Nowy obiekt:** plik w `objects/`, wpis w rejestrze, potem:

```bash
npm run v2:render -- <obiekt> <square|wide|tall> [red]
```

Skrypt renderuje, sprawdza szew pętli (ostatnia → pierwsza klatka musi być tak gładka jak sąsiednie, inaczej kończy się błędem), koduje `-d` (desktop) i `-m` (mobile) do WebM + MP4, plakat AVIF i dopisuje `public/v2/objects/<obiekt>/manifest.json` (rozmiary, sekundy, szew). Na stronie: wideo z `mix-blend-mode: screen` na czarnym tle, leniwie, pauza poza ekranem, reduced-motion = plakat.

Stan: `splot` (hero) wyrenderowany w `square` i `tall` na czerwono, WebM 354 / 186 kB.
