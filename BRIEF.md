# Nest Studio — brief strony

> Dokument źródłowy dla sesji budującej stronę. Czytaj razem z `CLAUDE.md` (jak pracujemy) i `docs/research.md` (rozbiór referencji).

## 1. Kto

**Nest Studio**: studio projektowe Filipa Jakubiaka. W branży od **2014**.

Filip robi:
- **branding**: identyfikacje, systemy marki,
- **strony www**: web design + development,
- **strategię marki**: pozycjonowanie, komunikacja, architektura marki,
- **AI i automatyzację procesów**: wdrożenia AI w firmach, automatyzacje, narzędzia. To wyróżnik na tle klasycznych studiów: „studio, które projektuje markę i od razu buduje jej maszynownię”.

Klienci docelowi: founderzy i firmy, które chcą wyglądać na tyle, ile naprawdę są warte, i działać szybciej dzięki AI.

## 2. Cel strony

1. Pokazać poziom „agency grade”: strona sama w sobie ma być najlepszym case study.
2. Zbudować zaufanie: 12 lat doświadczenia, konkretne projekty, jasny proces.
3. Prowadzić do jednej akcji: **rozpocznij projekt** (formularz / mail / kalendarz).

## 3. Kierunek wizualny

- **Minimalizm, czerń i biel.** Jedyny akcent: **liquid chrome** (płynny metal / rtęć). Używany oszczędnie, jako „bohater”, nie dekoracja wszędzie.
- **Kinetic typography** jako główny nośnik ekspresji. Typografia gra rolę obrazu.
- **Showreel motion design + web design**: strona ma pokazać, że studio robi ruch, nie tylko go opisuje.
- **Custom animacja dla każdej sekcji**, bez powtarzania tego samego fade-up.
- **Jedna historia.** Cały scroll to jedna narracja z wątkiem przewodnim (patrz §5). Sekcje wynikają z siebie nawzajem, przejścia są fabułą, a nie cięciem.
- To, co jest teraz na topie (2026): monochrom + jeden materiałowy akcent, ogromna typografia z precyzyjną mikro-typografią (mono labelki, siatka), scroll-scrubbed storytelling, WebGL użyty punktowo, a nie wszędzie.

Referencje (rozbiór w `docs/research.md`):
- https://madeinevolve.com/: rytm, preloader, highlight-text na scrubie, mikro-labelki, siatka.
- https://bymonolog.com/: ton („Anti-normal design…”), metryki w case studies, FAQ, przycisk „zapytaj AI o nas” w stopce.

**Mamy to zrobić lepiej i mądrzej.** Obie strony są efektowne, ale:
- Evolve bez drogich zdjęć/filmu jest wydmuszką. My nie mamy jeszcze materiału, więc **wow musi wynikać z typografii, ruchu i shadera**, nie z footage'u.
- Monolog to Webflow z typowymi sekcjami. My robimy jedną ciągłą narrację i kod, który sam jest dowodem umiejętności (AI/automatyzacja jako żywe demo, nie punkt na liście).

## 4. Motyw przewodni: „Nest” (gniazdo)

Propozycja (do rozwinięcia przez skille `paint` / `brainstorming`): **gniazdo = struktura budowana z wielu pojedynczych elementów, która staje się domem dla czegoś żywego.** Metafora studia: z luźnych nitek (strategia, identyfikacja, strona, automatyzacje) splatamy jedną spójną strukturę, w której marka może rosnąć.

Wizualnie: linie / nitki / typografia, które w trakcie scrolla splatają się w formę. Chrome to „żywe” centrum gniazda. Metafora ma być subtelna, nie dosłowny ptasi obrazek.

## 5. Struktura, czyli jedna historia (propozycja, do dopracowania)

1. **Preloader / otwarcie**: licznik 2014 → 2026 albo splatanie linii w znak Nest.
2. **Hero**: manifest w kinetic typography + liquid chrome jako centralny obiekt. Jedno zdanie, które mówi, po co jest studio.
3. **Problem / napięcie**: firmy wyglądają słabiej, niż są (nawiązanie do „visibility gap”, ale własnymi słowami).
4. **Showreel**: motion + web design. Pełnoekranowy moment, scrub albo playback, custom player. Do czasu właściwego filmu: showreel złożony z animacji samej strony / generatywnych sekwencji.
5. **Wybrane projekty**: case studies z metrykami (placeholdery do podmiany, patrz §7).
6. **Usługi**: 4 filary: Strategia marki · Branding · Strony www · AI i automatyzacje. Każdy z własną mikro-animacją.
7. **AI & automatyzacja jako żywe demo**: sekcja, która *pokazuje* automatyzację (np. interaktywny flow, który sam się składa), a nie tylko o niej mówi.
8. **Proces**: jak wygląda współpraca, krok po kroku.
9. **O Filipie / studio**: od 2014, osoba za studiem, zdjęcie (placeholder).
10. **FAQ**
11. **CTA / kontakt**: finał historii: „gniazdo” gotowe, zaproszenie do rozmowy.
12. **Stopka**: dane, social, przyciski „Zapytaj Claude / ChatGPT / Perplexity o Nest Studio” (jak Monolog, tylko ładniej).

## 6. Teksty

Teksty pisze sesja budująca (Claude Fable 5.1) na bazie §1–§5.
- Ton: pewny, konkretny, krótkie zdania, zero korpo-żargonu i pustych superlatywów. Rytm jak w Evolve („Not just execution. Not isolated services.”).
- Pisane w pierwszej osobie liczby mnogiej („robimy”) lub pojedynczej. Wybrać jedną konsekwentnie i uzasadnić w `docs/copy.md`.
- Wszystkie teksty najpierw w `docs/copy.md`, potem w kodzie.
- Języki: patrz §9.

## 7. Treści, których jeszcze nie ma (placeholdery, oznaczone do podmiany)

- **Logo / znak Nest Studio**: brak. Zaprojektować wordmark + znak (skill `svg-design`, `brandkit`), oznaczyć jako propozycję do akceptacji.
- **Fonty** (decyzja Filipa): **Space Grotesk** (Google Fonts, OFL) jako główny krój, display + tekst. Self-hosted woff2 z latin-ext (polskie znaki!), np. przez `@fontsource-variable/space-grotesk` albo `next/font`. Do mikro-labelek dobrać mono (np. Space Mono / JetBrains Mono / Geist Mono). Wybór uzasadnić w `docs/decisions.md`.
  - **Neue Plak** to alternatywa, na którą Filip ma ochotę, ale jej pliki pochodzą z projektów klienta (TCC) i **nie mogą trafić do tego publicznego repo**. Architektura fontów ma pozwalać na podmianę jednej zmiennej (`--font-display`), gdyby Filip kupił własną licencję.
- **Projekty / case studies**: placeholdery z realistyczną strukturą (nazwa, zakres, metryka, rok). Kandydaci z portfolio Filipa: Perun Tac (branding + strona + CMS), TCC Global (strona), Oboda Group (redesign). Nazwy i dane tylko po akceptacji Filipa.
- **Showreel**: brak filmu. Architektura playera gotowa na plik mp4/HLS.
- **Zdjęcie Filipa, mail, social, NIP**: placeholdery.

Każdy placeholder zapisuj w `docs/placeholders.md` (co, gdzie, czym podmienić).

## 8. Technologia (rekomendacja, do potwierdzenia w planie)

- **Next.js (App Router) ze static export** + TypeScript + Tailwind. React, bo komponenty z 21st.dev i skille `gsap-react` są pod React.
- **GSAP 3.13+** (wszystkie pluginy darmowe: SplitText, ScrollTrigger, Flip, CustomEase, MorphSVG, DrawSVG) + `useGSAP`.
- **Lenis** smooth scroll.
- **Liquid chrome**: `@paper-design/shaders-react` (komponent Liquid Metal, warianty Noir / Backdrop / Stripes) albo własny shader Three.js / OGL, jeśli Paper nie da efektu. Punktowo, z fallbackiem na obraz przy `prefers-reduced-motion` i słabym GPU.
- Komponenty z https://21st.dev/community/components/newest jako inspiracja i punkty startowe (lista w `docs/research.md`), zawsze przerobione pod nasz system, nigdy wklejone 1:1.
- Hosting: **Cloudflare Workers (static assets)**, jak inne projekty Filipa.
- Wymagania: Lighthouse ≥ 90 perf na desktopie, pełna obsługa `prefers-reduced-motion`, responsywność od 360 px, polskie znaki wszędzie, dostępność (focus, kontrast, semantyka).

## 9. Otwarte decyzje

Uzupełnia Filip. Jeśli puste, sesja przyjmuje wartości domyślne i zapisuje je w `docs/decisions.md`:
- Język strony: **domyślnie PL + EN** (przełącznik), PL jako główny.
- Domena: ?
- Kontakt: mail / Cal.com / formularz?
