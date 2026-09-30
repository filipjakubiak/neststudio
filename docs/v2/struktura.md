# Nest Studio v2: struktura, warstwy, spoiwo

> Szkielet przebudowy. Źródła: kolejność sekcji od Filipa (30.09), teksty i strategia `docs/v2/source/copywriting-strategia.html`, referencja renderu `docs/v2/source/referencja-render.mp4`. Teksty strony głównej w wersji Nest: `docs/v2/copy.md`.

## 1. Ustalenia Filipa (30.09)

- **Paleta Nest** (Noir, Bone, chrom, światło krawędziowe ciepłe). Światło z look-devu „Splot” jest w porządku.
- **Ruch:** wolny, subtelny. Obiekty minimalistyczne, ładne, proste.
- **Warstwa tła całej strony:** zamiast nici (strands) **szerokie pasy**: zawinięte albo zgięte pod 90°, wjeżdżają między teksty. Przez pas przechodzi światło (jak kafel „Selective Privacy” w referencji).
- **Bento:** tak, ale punktowo, nie w każdej sekcji.
- **Teksty:** kierunek z dokumentu strategii, podciągnięty do Nest.

## 2. Trzy warstwy strony

| Warstwa | Co to jest | Technika |
|---|---|---|
| **Tło: pasy** | 2 do 3 szerokie, matowo-satynowe wstęgi w ciemnym grafitowym odcieniu, które wjeżdżają zza krawędzi ekranu między bloki tekstu, zginają się lub zawijają. Przez wstęgę wolno przechodzi pasmo ciepłego światła. | **WebGL na żywo** (jedna kanwa pod stroną, jak dotychczasowa scena nici): kształt i pozycja pasa zależą od scrolla, więc nie da się tego wyrenderować z góry jako wideo. Prototyp: `lab/v2-bands/`. |
| **Obiekty sekcji** | Pojedynczy, prosty obiekt przy wybranych sekcjach (hero, usługi, proces, CTA). | **Remotion**, pętla wideo 8 do 12 s, `mix-blend-mode: screen`. Look-dev: `remotion/src/lookdev/`. |
| **Treść** | Typografia, realizacje, zdjęcia, formularz. | HTML/CSS, bento tylko tam, gdzie treść jest kaflowa (usługi, stats). |

Zasada kompozycji: pas i obiekt nie spotykają się w jednym kadrze. Sekcja ma albo pas, albo obiekt, nigdy oba naraz. Dzięki temu każdy ekran ma jeden akcent świetlny.

## 3. Mapa sekcji

| # | Sekcja | Tekst (źródło) | Układ | Akcent |
|---|---|---|---|---|
| 1 | Hero | strategia 3.2 | tekst 6/12 lewo, obiekt prawo, 100svh | obiekt **Splot** (wolny) |
| 2 | Stats & facts | brak w źródle: liczby od Filipa | 4 liczby w jednym rzędzie, bez kafli | pas wjeżdża od prawej pod liczbami |
| 3 | Who we are | 3.4 „To, co widać. I to, co dzieje się dalej.” + 01 do 03 | duży nagłówek, trzy kolumny | pas zgięty pod 90° przechodzi między nagłówkiem a kolumnami |
| 4 | Portfolio | 3.3 „Najpierw zobacz, jak projektujemy.” | duży projekt na całą szerokość + dwa mniejsze | brak (mówią realne projekty) |
| 5 | What we do | 3.5, pięć usług | **bento**: 1 duży kafel + 4 mniejsze | mini-obiekt w każdym kaflu |
| 6 | About + why choose us | 3.7 Studio + trzy zasady z 5.2 | historia lewo, zasady prawo (lista, bez kafli) | pas zawija się za tekstem |
| 7 | Testimonials | szablon 3.3; potrzebne prawdziwe opinie | jeden cytat na ekran | brak |
| 8 | Meet the team | 5.2 „Ludzie” | portrety | brak |
| 9 | Process | 3.6, cztery etapy | lista pozioma desktop / pionowa mobile, bez pinu | jedna kometa przechodzi przez 4 stacje |
| 10 | Pricing + FAQ | 3.8 FAQ („Ile kosztuje…”); widełki tylko prawdziwe | FAQ akordeon; ewentualnie 2 do 3 przedziały | brak |
| 11 | Partners & clients | logotypy za zgodą | ściana logotypów, monochrom | brak |
| 12 | CTA | 3.9 „Co chcesz zmienić w swojej firmie?” | pełna szerokość | obiekt **Gniazdo** (finał) |
| 13 | Get in touch | 5.3 formularz + „Co dalej?” | formularz lewo, dane prawo | brak |
| 14 | Stopka | 3.10 | kolumny + wordmark | brak |

Rytm akcentów: obiekt, pas, pas, (realne prace), obiekty w bento, pas, (ludzie), kometa, (FAQ), obiekt. Żaden akcent nie powtarza się dwa razy pod rząd.

## 4. Świadome odstępstwa od dokumentu strategii

- **Kolor:** strategia proponuje jasne tło `#F5F4F0` i fioletowy akcent. Zostajemy przy ciemnej palecie Nest (decyzja Filipa). Z dokumentu bierzemy zasadę „jeden akcent, kolory projektów jako zmienność”.
- **Hero:** strategia odradza „losową kulę 3D” i zaleca prawdziwy projekt. Obiekt Splot nie jest losowy (gniazdo = nazwa studia), ale dokładamy pod hero od razu wjazd pierwszej realizacji, żeby dowód był w pierwszym scrollu.
- **Ruch:** strategia odradza przejmowanie scrolla i obowiązkowe intro. W v2: bez preloadera, bez długich pinów. Pasy reagują na scroll, ale go nie blokują. Pełne `prefers-reduced-motion` (pasy statyczne, obiekty jako plakat) i przycisk pauzy dla pętli (WCAG 2.2.2).
- **Usługi:** pięć zamiast czterech (dochodzi Projektowanie graficzne).
- **Stats, testimonials, team, pricing, partners:** strategia zastrzega, żeby nie wymyślać liczb, opinii ani klientów. Te sekcje ruszają dopiero z prawdziwymi danymi; do tego czasu placeholdery oznaczone w `docs/placeholders.md`.

## 5. Fakty do zebrania od Filipa

- **Stats:** rok założenia, liczba projektów/klientów, branże, kraje.
- **Portfolio:** 3 najmocniejsze realizacje (Perun Tac, TCC Global, Oboda Group?), zgody, cel/zmiana w jednym zdaniu, zakres, rok.
- **Testimonials:** 2 do 4 opinii z imieniem, stanowiskiem, firmą, zgodą.
- **Team:** kto, role, zdjęcia w jednym stylu. Model: studio założycielskie czy zespół + specjaliści.
- **Pricing:** czy pokazujemy przedziały; minimalna wartość projektu.
- **Partners & clients:** logotypy wektorowe.
- **Kontakt:** e-mail, telefon, dane firmy, formularz (Worker) czy mailto na start.
- **Zakres AI i automatyzacji:** tylko to, co faktycznie dostarczacie.

## 6. Kolejność prac

1. ~~Look-dev #1 Splot~~ (30.09), wersja wolna 12 s zrobiona.
2. ~~Look-dev #2: pasy w tle~~ (30.09, `lab/v2-bands/`). Czeka na akceptację Filipa.
3. Akceptacja Filipa → DESIGN.md v2 (pasy, bento punktowe, obiekty) → szkielet sekcji w Next.js na tekstach z `copy.md`.
4. Kolejne obiekty (Gniazdo do CTA, mini-obiekty usług, kometa procesu).
5. Dane od Filipa → sekcje stats/testimonials/team/pricing/partners → weryfikacja.
