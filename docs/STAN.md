# STAN prac: Nest Studio

> Aktualizowany na każdym kamieniu milowym. Filip: zacznij czytać tutaj.

## Gdzie jesteśmy (28.09.2026)

**K1 zrobione: koncepcja, marka, teksty, plan.**

- `docs/concept.md`: brainstorm z briefu, tezy (wizualna, interakcyjna), motyw "nić", gramatyka strony, krzywa emocji z peakiem (showreel), signature move (persystentna scena nici + nić-rail), Design DNA JSON.
- `DESIGN.md`: jedyne źródło tokenów (kolor, typografia, przestrzeń, kształt, komponenty, ruch, zakazy).
- `docs/decisions.md`: 12 decyzji (m.in. Space Mono do labelek, PL+EN, mailto zamiast formularza, jedna scena Three.js zamiast Paper Shaders, bez custom cursora, preloader raz na sesję).
- `docs/brand.md` + `public/brand/*.svg`: głos, messaging, znak. **Rekomendacja: znak A "N z trzech nici"** (propozycja do akceptacji), B jako alternatywa, C jako favicon.
- `docs/copy.md`: wszystkie teksty PL i EN, autoaudyt.
- `docs/plan.md`: 18 zadań w 6 kamieniach (K2 szkielet → K6 weryfikacja i deploy).
- `docs/placeholders.md`: co jest tymczasowe i czym podmienić.

## Co dalej

1. K2: szkielet Next.js 16 static export + tokeny + fonty + statyczne sekcje (strona kompletna bez JS).
2. K3: ruch (GSAP + Lenis), scena Three.js, preloader, hero, napięcie.
3. K4: showreel, projekty, usługi, AI demo.
4. K5: proces, studio, FAQ, kontakt, rail, menu.
5. K6: screenshoty, reduced motion, Lighthouse, audyt, wrangler, favicon/OG.

## Otwarte pytania do Filipa (nie blokują; przyjęte wartości domyślne w `docs/decisions.md`)

1. Znak: A (N z nici), B (splot) czy inny kierunek?
2. Nazwy i metryki projektów (Perun Tac, TCC Global, Oboda Group): można pokazać? Jakie liczby?
3. Kontakt: mailto wystarczy na start, czy od razu Cal.com / formularz? Jaki adres e-mail?
4. Domena i dane do stopki (NIP, social).
5. Zdjęcie do sekcji Studio.
6. Zgoda na Three.js (≈130 kB gzip więcej, ładowane po LCP) w zamian za scenę 3D nici + chrome.

## Jak uruchomić (po K2)

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static export do out/
npm test         # vitest
```
