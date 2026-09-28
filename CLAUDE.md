# Nest Studio: strona studia

Komunikacja z Filipem **po polsku**. Kod, nazwy plików i commity mogą być po angielsku.

## Start sesji

1. Przeczytaj `BRIEF.md` (co budujemy), `docs/research.md` (referencje) i `docs/design-systems/` (style-referencje z innych projektów, np. REVOLUT, GSAP).
2. Jeśli istnieje `docs/STAN.md`, zacznij od niego: tam jest aktualny stan prac.

## Skille (katalog `.claude/skills/`, używaj ich świadomie)

Filip chce, żeby do tej strony użyć **wszystkich pasujących skilli**. Kolejność pracy:

1. **Kierunek i koncepcja:** `brainstorming` → `paint` (art direction, pełny pipeline) → `design-dna` (profil z referencji) → `ui-ux-pro-max` (paleta, typografia, pary fontów) → `design-taste-frontend` + `high-end-visual-design` + `minimalist-ui` (anty-slop, agency grade) → `stitch-design-taste` / `design-system` (tokeny, DESIGN.md).
2. **Marka:** `brand` (głos, messaging), `svg-design` + `brandkit` (znak Nest Studio).
3. **Narracja scrolla:** `scroll-craft` (podróż, emotional peak, signature move) + `gpt-taste` (rytm sekcji).
4. **Plan:** `writing-plans` → zapis w `docs/plan.md`.
5. **Ruch:** `cast` (genjutsu, interaction thesis), `motion-design`, `creative-effects`, `emil-design-eng`, `apple-design`, pełny zestaw `gsap-*` (core, timeline, scrolltrigger, plugins, react, utils, performance), `animation-vocabulary`.
6. **Budowa:** `executing-plans` / `subagent-driven-development`, `full-output-enforcement`, `ui-styling`.
7. **Kontrola:** `find-animation-opportunities`, `review-animations`, `improve-animations`, `impeccable` (audit/polish), `cloudflare-web-perf`, `verification-before-completion`, `requesting-code-review`.
8. **Deploy:** `cloudflare-wrangler`.

Część skilli odwołuje się do ścieżek `~/.claude/skills/...`. Tutaj te pliki są w `.claude/skills/...` w repo.

## Zasady jakości

- **Każda sekcja ma własną, przemyślaną animację.** Zero generycznego fade-up na wszystkim.
- **Jedna historia:** przejścia między sekcjami są częścią narracji.
- `prefers-reduced-motion` obsłużone wszędzie. Działa od 360 px. Polskie znaki (latin-ext) w każdym foncie.
- Liquid chrome punktowo, z fallbackiem.
- Weryfikuj w prawdziwej przeglądarce (Playwright / screenshoty desktop + mobile + reduced-motion), zanim ogłosisz, że coś działa. Nie podstawiaj wyników.
- Placeholdery zawsze w `docs/placeholders.md`. Niczego nie udawaj jako prawdziwe (klienci, metryki, opinie) bez oznaczenia.

## Zapis stanu

Filip wraca do sesji po przerwach. Utrzymuj `docs/STAN.md` (co zrobione, co dalej, otwarte pytania) na bieżąco i **commituj + pushuj na każdym kamieniu milowym**.
