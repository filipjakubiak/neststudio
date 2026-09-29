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
