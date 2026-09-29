# Nest Studio: marka (głos, messaging, znak)

> Etap 2 wg CLAUDE.md (skille `brand`, `svg-design`, `brandkit`). Znak jest **propozycją do akceptacji Filipa**. Wszystko poniżej jest zapisane tak, żeby dało się przenieść 1:1 do kodu (`src/content/*`) i do stopki.

## 1. Rdzeń marki

- **Misja:** Projektujemy marki i budujemy ich maszynownię: identyfikację, stronę i automatyzacje, żeby firma wyglądała na tyle, ile jest warta, i działała szybciej.
- **Pozycjonowanie:** Nest Studio to studio projektowe dla founderów i firm, które chcą wyglądać na tyle, ile naprawdę są warte, bo łączy strategię, branding, web i AI w jednej pracowni, od 2014.
- **Wyróżnik (jedno zdanie):** Studio, które projektuje markę i od razu buduje jej maszynownię.
- **Obietnica:** Z luźnych nici splatamy jedną strukturę, w której marka może rosnąć.
- **Idea przewodnia (od 29.09.2026, pełna strategia w `docs/copy.md`):** Splecione trzyma, luźne się rwie. Hasło: *Projektujemy marki i budujemy wszystko, co je trzyma.*
- **Dowody (proof points):** od 2014 w branży; cztery filary w jednej pracowni (strategia, branding, www, AI); sama strona jako case study (ruch, kod, wydajność, dostępność); wybrane projekty (po akceptacji nazw i metryk: `docs/placeholders.md`).

## 2. Głos

Pięć cech (z pary "jest, a nie"):

| Cecha | Znaczenie | Tak | Nie |
|---|---|---|---|
| Pewny, nie arogancki | mówimy wprost, bez asekuracji i bez pouczania | "Twoja firma jest lepsza, niż wygląda." | "Jesteśmy liderem innowacyjnych rozwiązań." |
| Konkretny, nie ogólny | rzeczownik i czasownik, zero przymiotników-wypełniaczy | "Identyfikacja, strona, automatyzacja formularza." | "Kompleksowe usługi najwyższej jakości." |
| Krótki, nie skrótowy | krótkie zdania, ale pełne; rytm jak u Evolve | "Nie egzekucja. Nie osobne usługi. Jedna struktura." | "Realizujemy szeroki wachlarz działań." |
| Spokojny, nie zimny | żadnych wykrzykników, żadnych emoji; ciepło jest w "ty" | "Porozmawiajmy o tym, co robisz ręcznie." | "Zaufaj nam!!!" |
| Rzemieślniczy, nie mistyczny | mówimy, jak coś działa, nie "magia" | "Przepływ składa się z trzech węzłów." | "Odkryj magię AI." |

**Osoba gramatyczna:** studio mówi **"my"** (robimy, splatamy), bo tak mówią pracownie i tak brzmi zaproszenie do wspólnej roboty. Sekcja "O Filipie" mówi **"ja"**, bo za studiem stoi jedna osoba i nie udajemy korporacji. Konsekwencja: "my" wszędzie poza tą jedną sekcją. (BRIEF §6 prosił o wybór i uzasadnienie; szczegóły w `docs/copy.md`.)

**Zwroty do odbiorcy:** na "ty" (founder), nigdy "Państwo".

**Słowa zakazane:** innowacyjny, kompleksowy, najwyższej jakości, dedykowany, wyjątkowy, pasja, elevate, seamless, unleash, next-gen, game-changer, "magia". Zakazane znaki: em-dash, en-dash, wykrzykniki poza jednym w CTA (jeśli w ogóle), emoji.

**Ton wg kontekstu:** hero i manifest: najkrócej, największa skala; usługi i proces: rzeczowo, listy czasownikowe; FAQ: rozmowa, pełne zdania; AI demo: język interfejsu (etykiety, statusy), nie marketing; stopka: dane bez ozdób.

## 3. Architektura komunikatu

- **Komunikat główny:** Projektujemy marki i budujemy wszystko, co je trzyma. (Poprzedni, "Wyglądaj na tyle, ile jesteś wart", przeszedł do sekcji napięcia jako para Wygląd / Wartość.)
- **Wspierające:** (1) Jedna pracownia: strategia, branding, www, AI. (2) Strona, która jest dowodem, a nie obietnicą. (3) Automatyzacje, które widać w działaniu, nie w prezentacji. (4) Od 2014, konkretne projekty, jasny proces.
- **Pitch 10 s:** Nest Studio projektuje markę i od razu buduje jej maszynownię: identyfikację, stronę i automatyzacje AI.
- **Pitch 30 s:** Większość firm wygląda słabiej, niż jest. My domykamy tę lukę: strategia, identyfikacja, strona i automatyzacje w jednej pracowni, od 2014. Zamiast czterech wykonawców, jedna struktura, w której marka rośnie. Zacznij od rozmowy.

## 4. Znak

### Rekomendacja: A, "N z trzech nici"

Kategoria: litera + metafora. Litera N zbudowana z trzech osobnych nici (dwa piony i przekątna) o luźnych końcach, **splecionych** w dwóch punktach: przekątna przechodzi **nad** lewym pionem i **pod** prawym. To gniazdo w skali jednej litery: luźne elementy, które trzymają się dzięki splotowi. Monolinia, zaokrąglone końce (nić, nie belka), bez wypełnień, jeden kolor. Czytelna od 16 px (favicon w wariancie w polu), w 200 px widać przeploty.

Pliki (`public/brand/`):
- `mark-a-nic.svg`: znak, `currentColor`, viewBox 48.
- `mark-c-pole.svg`: znak w polu (favicon, app icon, awatar), pole `currentColor`, nici w kolorze tła przez `--mark-canvas`.
- `mark-b-splot.svg`: alternatywa "splot" (pierścień z trzech nici, gniazdo z góry), kategoria abstrakcyjno-geometryczna. Zostaje jako opcja i jako motyw dekoracyjny (np. marker nici-rail).

Odrzucone w trakcie: ptak (dosłowność), gniazdo jako ilustracja, "N" z gradientem chromu (chrome jest materiałem sceny, nie znaku), znak z kropką w środku pierścienia (klisza "oka").

### Wordmark i lockup

- Wordmark: **Nest Studio** w Space Grotesk 500, tracking -0.03em, "Studio" w wadze 300 (emfaza tej samej rodziny). Na stronie jako żywy tekst; pliki z konturami: `public/brand/wordmark.svg` i `public/brand/lockup.svg` (generowane przez `scripts/wordmark-svg.py` z fontu, działają bez fontu). Obraz OG: `public/og.png` (render `lab/og.html`).
- Lockup poziomy: znak (wysokość = wysokość wersalika × 1.15) + odstęp 0.6 × wysokość + wordmark. Lockup pionowy: znak nad wordmarkiem, odstęp 0.5 × wysokość.
- Pole ochronne: wysokość litery N znaku z każdej strony. Minimalny rozmiar: znak 16 px (tylko wariant w polu), lockup 96 px szerokości.

### Zasady

- Jeden kolor: Bone na Noir albo Noir na Bone. Chrome tylko jako stan hover w nav (przejście 240 ms) i w preloaderze, gdy nici sceny "wpadają" w kształt N.
- Nie obracać, nie pochylać, nie dodawać cieni i obrysów, nie zmieniać proporcji stemów, nie wypełniać przestrzeni między nićmi.
- Animacja znaku: trzy nici rysują się DrawSVG w kolejności lewy pion, przekątna, prawy pion (400 ms każda, nakładanie 50%), używana tylko w preloaderze i przy `focus`/`hover` na wordmarku w nav (skrócona do 300 ms).

## 5. Wizualna spójność (checklista przed publikacją)

- [ ] Tylko Space Grotesk + Space Mono, subsety latin-ext, test "Zażółć gęślą jaźń".
- [ ] Jeden akcent-materiał (chrome), zero drugiego koloru.
- [ ] Znak w jednym kolorze, pole ochronne zachowane, favicon z wariantu w polu.
- [ ] Głos: "my" poza sekcją o Filipie, na "ty", bez słów zakazanych, bez em-dash.
- [ ] Placeholdery (klienci, metryki, zdjęcie, mail, NIP, domena) oznaczone w `docs/placeholders.md` i `data-placeholder` w kodzie.
