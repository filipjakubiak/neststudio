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
| Projekty: nazwy | `src/content/projects.ts` | Perun Tac, TCC Global, Oboda Group (kandydaci z briefu) | potwierdzone nazwy po akceptacji |
| Projekty: metryki | `projects.ts` → `metric`, `metricLabel` | "metryka do uzupełnienia" | prawdziwe wyniki (np. "+38% zapytań w 3 mies.") |
| Projekty: rok, opis | `projects.ts` → `year`, `summary` | brak / opis roboczy z briefu | prawdziwe |
| Projekty: covery | `projects.ts` → `cover` (pusty = wzór generatywny) | wzór splotu z seedem | `public/img/projects/<slug>.jpg` |
| Showreel | `site.ts` → `SHOWREEL_SRC` (pusty = sekwencja generatywna) | `""` | `public/video/showreel.mp4` lub URL HLS |
| Logo | `public/brand/mark-a-nic.svg` i wordmark | propozycja A | akceptacja Filipa albo inny wariant (B) |
| Font display | `src/styles/tokens.css` → `--font-display` | Space Grotesk | Neue Plak po licencji (pliki poza repo publicznym) |
| Polityka prywatności | stopka, link ukryty | brak | dokument, gdy powstanie |
| OG image | `public/og.png` | render z szablonu (typografia + znak) | zostaje albo grafika Filipa |
