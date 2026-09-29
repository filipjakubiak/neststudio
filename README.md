# Nest Studio: strona studia

Showcase studia projektowego Filipa Jakubiaka: jedna historia scrolla, własna animacja w każdej sekcji, jedna scena Three.js (nici) pod całą stroną i liquid chrome z Remotion (sekwencja klatek) prowadzący oko przez wszystkie sekcje. Dokumentacja pracy: `CLAUDE.md`, `BRIEF.md`, `docs/`.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000 (PL) i /en/
npm run build      # static export do out/
npm test           # vitest: parytet PL/EN, zero em-dash, etykiety CTA
npm run typecheck
```

## Chrom (Remotion)

```bash
npm run chrome:install   # raz: zależności w remotion/ (nie w bundlu strony)
npm run chrome:render    # render PNG z alfą + WebP (public/chrome/{d,m}/NNN.webp, plakaty, manifest.json)
npm run chrome:preview   # szybki podgląd 1/4 skali do remotion/out/preview
npm run chrome:studio    # Remotion Studio (podgląd na żywo)
```

Choreografia kształtu: `remotion/src/journey.ts`; shader: `remotion/src/chromeShader.ts`; szczegóły i komenda renderu na Windows: `remotion/README.md`. Po zmianie liczby klatek manifest aktualizuje się sam, strona czyta go przy buildzie.

## Wdrożenie (Cloudflare Workers, static assets)

```bash
npx wrangler login
npm run deploy     # next build && wrangler deploy (konfiguracja: wrangler.jsonc)
```

Nagłówki cache i bezpieczeństwa: `public/_headers`.

## Struktura

- `src/content/{pl,en}.ts`: wszystkie teksty (typ w `types.ts`), stałe i placeholdery w `site.ts`.
- `src/components/sections/*`: sekcje, każda z własnym `useGSAP` i wariantem dla `prefers-reduced-motion`.
- `src/scene/*`: scena Three.js nici (`NestScene`, `ThreadField`), stan sterowany przez GSAP z `SceneBus`.
- `src/components/chrome/*` + `src/lib/chrome/frames.ts`: chrom-przewodnik (kanwa 2D, klatki z `public/chrome/`, choreografia per sekcja), decyzja D16.
- `remotion/`: źródło chromu (Remotion + three, osobne zależności).
- `src/styles/tokens.css`: tokeny z `DESIGN.md` (jedyne źródło wartości).
- `public/brand/*`: znak (propozycja A) i warianty.

## Placeholdery

Lista rzeczy do podmiany (domena, mail, metryki projektów, zdjęcie, showreel): `docs/placeholders.md`. W DOM każdy ma `data-placeholder="true"`.

## Stan prac

`docs/STAN.md`.
