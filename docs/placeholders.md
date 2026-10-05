# Placeholdery v3 (od 05.10.2026: czerń + magenta, układ wg apple-design)

Na stronie widać je jako szary tekst w [nawiasach kwadratowych], tak jak w dokumencie strategii. Nic z tej listy nie udaje prawdziwych danych. Teksty: `src/content/pl.ts` i `en.ts`, stałe: `src/content/site.ts`.

| Co | Gdzie | Teraz | Potrzebne od Filipa |
|---|---|---|---|
| Perun Tac: zdanie o projekcie | Realizacje, karta 01 | „[Jedno zdanie opisujące rzeczywisty cel lub zmianę w projekcie.]” (poprzednie zdanie było dopisane, więc wypadło) | jedno zdanie o realnej zmianie |
| TCC Global: zdanie o projekcie | Realizacje | jw., oznaczone „Projekt koncepcyjny” | jedno zdanie + zgoda na pokazanie |
| Oboda Group | Realizacje | zdanie z dokumentu „Uporządkowana oferta i nowy sposób prezentacji usług.”, status „[Status do potwierdzenia]” | potwierdzenie, że zdanie pasuje, i status |
| Opinie klientów (3.3) | strona główna, sekcja po realizacjach | 3 komórki z nawiasami z dokumentu, wyszarzone | 1 do 3 cytatów + imię, stanowisko, firma, zgoda na publikację |
| Zdjęcie zespołu (3.7) | strona główna, Studio | ramka z napisem „Do uzupełnienia” | prawdziwe zdjęcie, podpisane nazwiskami i rolami |
| Ludzie (5.2) | Studio | Filip Jakubiak, „[Rola]”, „[Dwa konkretne zdania…]” | rola, 2 zdania, decyzja: studio założycielskie czy zespół |
| Budżet w formularzu | Kontakt | „[przedział 1..3]” | widełki zgodne z cenami |
| Formularz: endpoint | `site.ts` → `FORM_ENDPOINT` (pusty) | otwiera maila w programie pocztowym, nie twierdzi, że wiadomość dotarła | decyzja: Worker + e-mail. Wtedy włączą się teksty z dokumentu „Dziękujemy. Wiadomość dotarła.” i „Nie udało się wysłać…” (już w treściach) |
| E-mail, telefon, lokalizacja, pełna nazwa podmiotu, domena | `site.ts`, stopka | `hello@neststudio.pl`, `+48 000 000 000`, „[Lokalizacja, jeśli istotna]”, „[Pełna nazwa podmiotu]” | prawdziwe dane |
| Profile społecznościowe | stopka | kolumna ukryta (dokument: tylko aktywne profile) | linki do aktywnych profili |
| Polityka prywatności, cookies | stopka, formularz | link `#` | treść |

Z v2 wypadły (bo nie ma ich w dokumencie): sekcja liczb, cennik, marquee klientów, osobna sekcja opinii i zespołu.

---

# Placeholdery v2 (archiwum, 30.09.2026)

Na stronie widać je jako tekst w [nawiasach kwadratowych] (szary). Nic z tej listy nie udaje prawdziwych danych. Treści: `src/content/pl.ts` i `en.ts`, stałe: `src/content/site.ts`.

| Co | Gdzie | Teraz | Potrzebne od Filipa |
|---|---|---|---|
| Liczba projektów | Stats, 4. liczba | `[00]` | prawdziwa liczba (pozostałe 3 są prawdziwe: 2014, 12 lat, 5 obszarów) |
| Opinie klientów | Testimonials | 1 cytat w nawiasach | 2 do 4 cytatów z imieniem, stanowiskiem, firmą i zgodą |
| Zespół | Team | Filip Jakubiak (rola i bio do potwierdzenia) + 1 slot „[Imię i nazwisko]”, portrety jako inicjały | zdjęcia w jednym stylu, role, 2 zdania bio, decyzja: studio założycielskie czy zespół |
| Ceny | Pricing, 3 pakiety | `[od 0 000 zł]`, `[wycena indywidualna]` | prawdziwe widełki albo decyzja „bez kwot” (wtedy zostaje sam FAQ) |
| Budżet w formularzu | Contact → select | `[przedział 1..3]` | te same widełki co w Pricing |
| Klienci | Partners (marquee) | Perun Tac, Perun Sec, Oboda Group, TCC Global + 2× „[Klient]” | zgody i logotypy SVG |
| Oboda Group: status | Work | „[Etap 1, do potwierdzenia]” | status projektu i czy można pokazać zrzut (użyty zrzut hero z repo obodagroup, które jest publiczne) |
| TCC Global | Work | okładka typograficzna, oznaczone „Projekt koncepcyjny” | czy wolno pokazać; zrzuty celowo NIE trafiły do publicznego repo |
| Perun Tac | Work | zrzut z żywej peruntac.pl (30.09), opis z notatek | akceptacja opisu |
| Formularz | Contact | składa maila w programie pocztowym (uczciwy komunikat, bez „wiadomość dotarła”) | decyzja: Worker + Email Routing (wtedy prawdziwe potwierdzenie i błąd) |
| E-mail, telefon, dane firmy, social, domena | `site.ts` | `hello@neststudio.pl`, `+48 000 000 000`, „[Pełna nazwa podmiotu]”, `#` | prawdziwe dane |
| Polityka prywatności | stopka, formularz | link `#` | treść polityki (dopasowana do sposobu obsługi formularza) |

---

# Placeholdery v1 (archiwum, strona v1 zastąpiona 30.09)

# Placeholdery (co, gdzie, czym podmienić)

Wszystko poniżej jest **nieprawdziwe lub tymczasowe** i w kodzie ma atrybut `data-placeholder="true"`. Nic z tej listy nie udaje prawdziwych danych.

| Co | Gdzie | Wartość tymczasowa | Czym podmienić |
|---|---|---|---|
| Domena | `src/content/site.ts` → `SITE_URL`, meta, hreflang, stopka | `https://neststudio.pl` | prawdziwa domena |
| E-mail | `site.ts` → `EMAIL`, nav overlay, kontakt, stopka | `hello@neststudio.pl` | prawdziwy adres |
| Telefon | `site.ts` → `PHONE`, stopka | `+48 000 000 000` | prawdziwy numer albo usunąć |
| Kalendarz | `site.ts` → `CAL_URL` (pusty = link ukryty) | `""` | link Cal.com / Calendly |
| NIP, dane firmy | `site.ts` → `LEGAL_NAME`, `NIP`, stopka | `Nest Studio Filip Jakubiak`, `000-000-00-00` | prawdziwe dane |
| Social | `site.ts` → `SOCIAL[]`, stopka | Instagram / LinkedIn / Behance z `#` | prawdziwe profile albo usunąć |
| Zdjęcie Filipa | `Studio.tsx` (portret) | wzór splotu + labelka "zdjęcie" | `public/img/filip.jpg` (min. 1200×1500, monochrom lub kolor, podmieniamy filtrem) |
| Projekty: nazwy | `src/content/pl.ts`, `en.ts` → `projects.items` | Perun Tac, TCC Global, Oboda Group (kandydaci z briefu) | zgoda Filipa (i ewentualnie klientów) na publiczne pokazanie |
| Projekty: liczby (`metric`, `metricLabel`) | jw. | fakty z notatek projektowych, nie wyniki biznesowe: Perun Tac "3 redaktorów prowadzi stronę z własnego panelu" (CMS wdrożony 26.08.2026, panel dla trzech edytorów); TCC Global "2 kierunki nowej strony do wyboru" (Lens i Lumen dla zarządu); Oboda Group "9 → 5 kategorii zamienionych na ścieżki według roli" (faza 1 koncepcji) | potwierdzenie albo prawdziwy wynik (np. zapytania, konwersja) |
| Projekty: opisy i zakres | jw. → `summary`, `scope` | Perun Tac: szkolenia strzeleckie i taktyczne z Wrocławia, strona PL/EN + panel (zakres "Branding" z BRIEF §7); TCC Global: programy lojalnościowe dla sieci handlowych i marek, strona oparta na ruchu, dwa kierunki "do decyzji zarządu" (**sprawdzić, czy wolno to ujawnić**), chip "Motion" dodany; Oboda Group: koncepcja (faza 1), nie wdrożona strona | akceptacja Filipa |
| Projekty: rok | jw. → `year` | 2026 dla wszystkich trzech (wg notatek) | potwierdzenie |
| Projekty: covery | `projects.ts` → `cover` (pusty = wzór generatywny) | wzór splotu z seedem | `public/img/projects/<slug>.jpg` |
| Showreel | `site.ts` → `SHOWREEL_SRC` (pusty = sekwencja generatywna) | `""` | `public/video/showreel.mp4` lub URL HLS |
| Logo | `public/brand/mark-a-nic.svg` i wordmark | propozycja A | akceptacja Filipa albo inny wariant (B) |
| Font display | `src/styles/tokens.css` → `--font-display` | Space Grotesk | Neue Plak po licencji (pliki poza repo publicznym) |
| Polityka prywatności | stopka, link ukryty | brak | dokument, gdy powstanie |
| OG image | `public/og.png` | render z szablonu (typografia + znak) | zostaje albo grafika Filipa |
| Proces i FAQ: obietnice | `pl.ts`/`en.ts` → `process`, `faq` | "zakres i wycena na piśmie po rozmowie", "harmonogram z datami razem z wyceną", "jedna wycena obejmuje wszystko", "zostajemy na wsparcie", "uczymy zespół", "spotkania na miejscu, gdy projekt tego wymaga" | potwierdzenie, że tak Filip pracuje; bez tego przeredagować |
| Studio: "z małym zespołem dobranym do projektu" | `studio.p2` | zdanie z pierwszej wersji tekstów, bez źródła w briefie | potwierdzenie albo usunąć |
