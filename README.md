# Nest Studio: strona studia

Showcase studia projektowego Filipa Jakubiaka: jedna historia scrolla, własna animacja w każdej sekcji, jedna scena Three.js (nici + liquid chrome) spinająca całość. Dokumentacja pracy: `CLAUDE.md`, `BRIEF.md`, `docs/`.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000 (PL) i /en/
npm run build      # static export do out/
npm test           # vitest: parytet PL/EN, zero em-dash, etykiety CTA
npm run typecheck
```

## Wdrożenie (Cloudflare Workers, static assets)

```bash
npx wrangler login
npm run deploy     # next build && wrangler deploy (konfiguracja: wrangler.jsonc)
```

Nagłówki cache i bezpieczeństwa: `public/_headers`.

## Struktura

- `src/content/{pl,en}.ts`: wszystkie teksty (typ w `types.ts`), stałe i placeholdery w `site.ts`.
- `src/components/sections/*`: sekcje, każda z własnym `useGSAP` i wariantem dla `prefers-reduced-motion`.
- `src/scene/*`: scena Three.js (`NestScene`, `ThreadField`, `ChromeDrop`), stan sterowany przez GSAP z `SceneBus`.
- `src/styles/tokens.css`: tokeny z `DESIGN.md` (jedyne źródło wartości).
- `public/brand/*`: znak (propozycja A) i warianty.

## Placeholdery

Lista rzeczy do podmiany (domena, mail, metryki projektów, zdjęcie, showreel): `docs/placeholders.md`. W DOM każdy ma `data-placeholder="true"`.

## Dwie wersje hero

- `claude/nest-studio-website-3yjej7`: preloader z licznikiem i kropla płynnego chromu.
- `claude/nest-studio-title-sequence-3yjej7`: sekwencja tytułowa "NEST STUDIO" w czerwonym świetle (`docs/titles.md`). Flaga `TITLE_SEQUENCE_ON_TOUCH` w `src/content/site.ts` wyłącza sekwencję na urządzeniach dotykowych. Po zmianie wag liter: `python3 scripts/title-glyphs.py`.

## Stan prac

`docs/STAN.md`.
