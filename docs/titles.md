# Sekwencja tytułowa: "NEST STUDIO" w czerwonym świetle

> Branch `claude/nest-studio-title-sequence-3yjej7`. Wersja z kroplą chromu zostaje na `claude/nest-studio-website-3yjej7`.

## 1. Brief Filipa (28.09.2026)

Wejściówka Stranger Things: rim light na literach, litery wjeżdżające z krawędzi kadru, czerwone światło na kantach, na końcu pełna nazwa. To samo na typografii Nest Studio, zamiast kropli chromu. Gniazdo z nici zostaje. Ma być "naprawdę wow". Kolor: czerwone światło, ale takie, które współgra z resztą strony.

## 2. Analiza referencji (co dokładnie robi czołówka Imaginary Forces)

| Element | Stranger Things | Nest Studio |
|---|---|---|
| Krój | ITC Benguiat, wersaliki | Space Grotesk, wersaliki: NEST waga 600, STUDIO waga 400 (kontrast wag jak w wordmarku) |
| Materiał liter | ciemne, grube płyty, prawie czarne lico | grafit `#141416`, lico prawie czarne, fazowane krawędzie |
| Światło | czerwone, od tyłu i z boku; świeci tylko na kantach i fazach | jedno czerwone światło kluczowe ("Żar"), które w trakcie sekwencji przechodzi z lewej na prawą; rim (fresnel) + faza (bevel) + odbłysk |
| Kamera | między literami, ekstremalne zbliżenia, powolny odjazd | start w z = 3 (litery przechodzą tuż przed obiektywem), odjazd do z = 10, gdzie stoi kamera całej strony |
| Ruch liter | proste przesuwy z różnych stron, różne głębokości, ostatnia litera wjeżdża z góry | 10 liter, każda z innej strony i głębokości, ostatnie "I" opada z góry między D a O |
| Obraz | ziarno 16 mm, aberracja chromatyczna, winieta, migotanie światła | bloom (UnrealBloomPass), ziarno, aberracja radialna, winieta, migotanie z szumu (nie random) |
| Finał | pełny tytuł, światło się uspokaja | lock: puls ekspozycji i bloomu, aberracja skacze i wraca, litery zostają w hero jako lockup |
| Dźwięk | syntezator | brak (strona) |

## 3. Storyboard (czas w sekundach od startu sekwencji)

| t | Kamera (x, y, z) | Litery | Światło | Obraz |
|---|---|---|---|---|
| 0.0 | (-0.6, 0.25, 3.0), roll 0.04 | poza kadrem, na pozycjach startowych | intensywność 0 → 1.2 (0.6 s) | ekspozycja 0 → 1, ziarno 0.09, winieta 0.35 |
| 0.2 | | N wjeżdża z lewej, blisko obiektywu (z = +2.2): widać tylko kant | z lewej, z dołu (-3, -1, 4) | |
| 0.34 | | O z prawej, blisko | | |
| 0.48 do 1.46 | odjazd zaczyna się (z 3 → 10 w 4 s, power2.inOut) | E, D, S, U, T, T, S wchodzą co 0.14 s, każda 2.5 s, z różnych stron i głębokości | przesuwa się w prawo i w górę (3, 2, 4) do t = 2.4 | migotanie 0.35 |
| 1.46 | | I opada z góry (ostatnia) | | |
| 3.96 | | wszystkie litery na miejscu | wraca nad środek (0.4, 1.4, 3) | migotanie gaśnie do 0 |
| 4.2 | (0, 0, 10), roll 0 | lock | intensywność 2.2 → 1.3 | |
| 4.3 | | | | puls: ekspozycja 1 → 1.45 → 1, bloom 1.2 → 1.8 → 1.0, aberracja 0.004 → 0.02 → 0.003 |
| 4.6 | | | | overlay przezroczysty, canvas wraca pod treść, `nest:ready` |
| 4.9 | | | | hero: linie nagłówka, lead, CTA; nici 0 → 0.6 (2 s) |

Pomiń: klik, dotyk, Enter, spacja, Escape albo przycisk "Pomiń" (widoczny od 1 s). Pominięcie dojeżdża do locka w 0.35 s, potem puls gra normalnie.

Timeouty: scena nie gotowa po 3.5 s od montażu (wolna sieć, wolna kompilacja): overlay zostaje jako statyczny preloader z labelką, po gotowości sceny lub po 6 s strona odsłania się bez sekwencji. Brak WebGL, reduced motion, powtórna wizyta w sesji: bez sekwencji (jak D8).

## 4. Po sekwencji: litery w hero

Lockup "NEST STUDIO" zostaje w hero jako obiekt 3D w tej samej pozycji, w której DOM ma pusty boks `.hero-lockup` (proporcje z glifów). Światło podąża za kursorem (desktop) albo powoli krąży (dotyk). Rim oddycha (sinus 0.06). Scroll przez hero: litery cofają się w głąb (z do -5), przechylają (x 0.35 rad), gasną (opacity 1 → 0 do 70% zjazdu), światło gaśnie. Nici przejmują kadr; dalej fabuła bez zmian: chaos → gniazdo.

Fallback (brak WebGL, reduced motion, chwila przed startem sceny przy powtórnej wizycie): w boksie stoi inline SVG tych samych konturów, grafitowe wypełnienie, czerwony obrys 1 px i poświata CSS (`drop-shadow`). Gdy scena rusza, SVG gaśnie (crossfade 1,2 s), litery 3D są w tym samym miejscu.

## 5. Światło wraca: finał i stopka

Czerwień jest światłem, nie kolorem UI. Pojawia się trzy razy:

1. Sekwencja tytułowa (litery).
2. Finał (Kontakt): gniazdo domyka się i nici w gnieździe rozżarzają się od środka (`glow` 0 → 1, kolor nici w HDR, bloom). Zamiast lądującej kropli.
3. Stopka: lockup 3D wraca w boksie `.footer-lockup`, statyczny, rim za kursorem. Klamra: nazwa na początku i na końcu.

Poza tym strona zostaje monochromatyczna. Żadnych czerwonych przycisków, labelek, linków.

## 6. Technika

- `scripts/title-glyphs.py` (fontTools): kontury liter w jednostkach cap height = 1, y w górę, do `src/scene/titleGlyphs.ts`. Układ (jedna linia desktop, dwie linie mobile) liczy `src/scene/titleLayout.ts`, wspólny dla SVG fallbacku i sceny.
- `src/scene/Titles.ts`: `SVGLoader.createShapes` → `ExtrudeGeometry` (głębokość 0.42 cap, faza 0.035 cap, 2 segmenty fazy). Jeden `ShaderMaterial` dla wszystkich liter: lico grafitowe, światło kluczowe (diffuse z wrap 0.4, Blinn-Phong 48), rim fresnel^2.5, faza wykrywana z normalnej w przestrzeni obiektu (|n.z| między 0.05 a 0.95), migotanie liczone na CPU. Kolor światła w przestrzeni liniowej `(1.0, 0.027, 0.010)` = sRGB `#FF2E1A`, w HDR (intensywność do 2.5), żeby bloom rozjaśniał rdzeń do różowo-białego jak na taśmie.
- `src/scene/post.ts`: `EffectComposer` → `RenderPass` → `UnrealBloomPass` (pół rozdzielczości, próg 0.75) → `ShaderPass` (aberracja radialna, ziarno, winieta; alfa zachowana) → `OutputPass` (ACES, sRGB). Post włączony tylko gdy litery widoczne albo `glow` > 0.01; poza tym render bezpośredni jak dotąd. Żeby obie ścieżki wyglądały tak samo, shadery nici i liter mają `tonemapping_fragment` i `colorspace_fragment` (Three.js wyłącza je sam przy renderze do render targetu), a kolory nici są podane w przestrzeni liniowej.
- Canvas nad overlayem tylko w trakcie sekwencji (`html[data-preloading] .scene-canvas { z-index: 51 }`), potem wraca pod treść. Overlay czarny, bez własnej grafiki poza labelką i przyciskiem Pomiń.
- Pierwsza wizyta: scena bootuje od razu (bez czekania na `nest:ready` i idle), także na dotyku (zmiana D13: dotyczy tylko powtórnych wizyt). Strażnik FPS rusza dopiero po sekwencji.
- Stan sceny (`state.ts`): usunięte pola `drop*`; dodane `titlesHero`, `titlesFooter`, `titlesRecede`, `light{X,Y,Z}`, `lightIntensity`, `flicker`, `rim`, `bloom`, `chroma`, `grain`, `vignette`, `glow`, `camX`. Kotwice: `anchors.hero`, `anchors.footer` (px dokumentu, boks + czy dwie linie).

## 7. Ryzyka

- Koszt: chunk three rośnie o SVGLoader i postprocessing (ok. 25 kB brotli). Bloom to 6 przebiegów blur na pół rozdzielczości: na telefonie z DPR 1.25 do sprawdzenia na prawdziwym sprzęcie.
- TBT przy pierwszej wizycie rośnie (three parsuje się w trakcie ładowania). Świadomy koszt sekwencji; powtórne wizyty bez zmian.
- Czerwień na kantach na tle czarnym: kontrast liter zależy od bloomu; fallback SVG ma obrys, więc nazwa jest czytelna także bez WebGL.
- Bez prawdziwego GPU w kontenerze (SwiftShader) klatki sekwencji będą wolne; sprawdzam poprawność kompozycji klatka po klatce, nie płynność.

## 8. Stan po budowie (28.09.2026)

Zbudowane i zweryfikowane w headless Chromium (klatki, ścieżki awaryjne, arkusz strony); pomiary i lista rzeczy do sprawdzenia na prawdziwym sprzęcie: `docs/verification.md`, sekcja "Sekwencja tytułowa". Różnice względem storyboardu z §3: kamera i światło jak w tabeli, ale pozycje startowe liter są liczone względem kamery startowej (nie środka lockupu), żeby pierwsze kanty były w kadrze od razu; na wąskim ekranie wejścia są ściągane do osi kamery. Światło spoczynkowe stoi z prawej i nieco z przodu (2.2, 2.0, 1.4), bo tylne światło nie oświetla faz. Nici w hero po sekwencji mają krycie 0,55 (pełne przecinało litery zbyt gęsto).

Strojenie: `ENTRIES` i `CAM_START` w `TitleSequence.tsx` (skąd wjeżdżają litery), `LOCK_T` (moment locka), `initialState` w `state.ts` (światło, bloom, aberracja w spoczynku), shader w `Titles.ts` (proporcje lico / boki / faza / rim), `scripts/title-glyphs.py` (wagi liter).
