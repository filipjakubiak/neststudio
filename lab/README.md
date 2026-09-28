# lab: weryfikacja w przeglądarce

```bash
cd lab && npm install
# serwer z buildu: (cd .. && npm run build && cd out && python3 -m http.server 4173)
node walk.mjs http://localhost:4173/ desktop.png 1440 900 no 0.5 4      # arkusz kontaktowy, krok pół ekranu
node walk.mjs http://localhost:4173/ mobile.png 390 844 no 0.75 8
node walk.mjs http://localhost:4173/ reduced.png 1440 900 reduce 1 4
node menu.mjs http://localhost:4173/ menu.png                            # overlay, fokus, Escape
node spots.mjs http://localhost:4173/ spot                               # zrzuty wybranych sekcji
node hero.mjs http://localhost:4173/ hero                                # intro, napięcie (poprzedni branch: preloader)
node titles.mjs http://localhost:4173/ titles.png 1440 900               # sekwencja tytułowa klatka po klatce (arkusz), hero, scroll, stopka
node titles.mjs http://localhost:4173/ titles-m.png 390 844 mobile
node frame.mjs http://localhost:4173/ 4.3 lock.png 1440 900              # jedna klatka sekwencji w czasie t
node fallbacks.mjs http://localhost:4173/ fb                             # brak WebGL, wolny chunk three
node finale.mjs http://localhost:4173/ fin                               # finał z żarem i stopka po pełnym przejściu
node reduced.mjs http://localhost:4173/ reduced.png                      # reduced motion: fallback SVG
node revisit.mjs http://localhost:4173/ revisit                          # powtórna wizyta bez sekwencji (mobile)
node og.mjs                                                              # public/og.png z og.html
CHROME_PATH=<chrome> npx lighthouse http://localhost:4173/ --preset=desktop
```

Skrypty zakładają Chromium z Playwright pod `/opt/pw-browsers/...` (zmień `executablePath` na własną ścieżkę). Wyniki: `docs/verification.md`.
