# Teksty: humanize-text (05.10.2026)

Prośba Filipa: teksty tylko z dokumentu, nic dopisanego; potem przepuścić je przez skill humanize-text i zmienić to, co brzmi zbyt „AI”. Lista zmian (przed = dokument, po = strona) jest w kodzie: `src/content/edits.ts`. Test `tests/content.test.ts` pilnuje, żeby każdy tekst na stronie był albo z dokumentu, albo z tej listy.

## Ocena wg rubryki skilla (moja ocena, 7 kategorii po 10 pkt)

| Kategoria | Przed | Po | Co znalazłem |
|---|---|---|---|
| 1. Słownictwo AI | 6 | 9 | „spójny/spójność” 8 razy (polski odpowiednik „seamless/cohesive”), „wyrazista” 3 razy |
| 2. Nadmuchiwanie treści | 7 | 9 | „przełożenie na codzienną pracę”, „pokazują wartość oferty”, „rozwinąć obecność w sieci” |
| 3. Wzorce gramatyczne | 5 | 8 | 5× „nie tylko…, ale/tak samo”, triady z abstrakcyjnych rzeczowników |
| 4. Jakość UX copy | 7 | 9 | mówienie o „użytkowniku” zamiast do czytelnika, frazes „Różne firmy, różne wyzwania.” |
| 5. Struktura | 9 | 9 | bez zmian (sentence case, brak boldów) |
| 6. Interpunkcja | 4 | 10 | 18 półpauz (najmocniejszy sygnał wg skilla) |
| 7. Meta-treść | 8 | 9 | zdanie-podsumowanie „Dlatego łączymy decyzje projektowe z realiami codziennej pracy.” (usunięte) |
| **Razem** | **46/70 (66%)** | **63/70 (90%)** | cel skilla: powyżej 85% |

## Czego świadomie NIE zmieniłem

Nagłówki z dokumentu („Marka z charakterem. Nie tylko z logo.”, „Nie AI do wszystkiego. AI do konkretnego zadania.”, „Zaczynamy od zadania. Nie od układu sekcji.”) mają formę „nie X, tylko Y”, ale są krótkie, konkretne i celowe. Skill przestrzega przed nadkorektą, więc zostały. Tak samo FAQ i opisy procesu: są konkretne i mówią do czytelnika.

## Zmiany

Pełna lista ze zdaniami przed i po oraz powodem: `src/content/edits.ts` (14 zdań PL, te same w EN). Najważniejsze:

- Hero: „…materiały, które nadają firmom spójny charakter… żeby dobry projekt miał swoje przełożenie na codzienną pracę” → „…materiały, po których widać, kim jest firma… żeby dobry projekt pomagał też w codziennej pracy”.
- Realizacje: wypadło „Różne firmy, różne wyzwania.”
- Studio: „Interesuje nas nie tylko to, jak projekt wygląda w dniu prezentacji. Tak samo ważne jest…” → „Dzień prezentacji to dopiero początek. Sprawdzamy, jak projekt działa po wdrożeniu…”
- Podejście: „Tak rozumiemy jakość: jako połączenie trafnego pomysłu, dopracowanego wykonania i użyteczności…” → „Tak rozumiemy jakość: dobry pomysł, porządne wykonanie i coś, z czego zespół naprawdę korzysta.”
- Wszystkie półpauzy zastąpione przecinkiem, dwukropkiem albo kropką; separator w tytułach stron „ | ”.

Opisy projektów: zdania dopisane wcześniej (Perun Tac, TCC Global) zastąpione nawiasem z dokumentu „[Jedno zdanie opisujące rzeczywisty cel lub zmianę w projekcie.]”. Oboda Group ma zdanie-przykład z dokumentu (do potwierdzenia).
