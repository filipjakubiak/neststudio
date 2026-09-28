# lab: weryfikacja w przeglądarce

```bash
cd lab && npm install
# serwer z buildu: (cd .. && npm run build && cd out && python3 -m http.server 4173)
node walk.mjs http://localhost:4173/ desktop.png 1440 900 no 0.5 4      # arkusz kontaktowy, krok pół ekranu
node walk.mjs http://localhost:4173/ mobile.png 390 844 no 0.75 8
node walk.mjs http://localhost:4173/ reduced.png 1440 900 reduce 1 4
node menu.mjs http://localhost:4173/ menu.png                            # overlay, fokus, Escape
node spots.mjs http://localhost:4173/ spot                               # zrzuty wybranych sekcji
node hero.mjs http://localhost:4173/ hero                                # preloader, intro, napięcie
node og.mjs                                                              # public/og.png z og.html
CHROME_PATH=<chrome> npx lighthouse http://localhost:4173/ --preset=desktop
```

Skrypty zakładają Chromium z Playwright pod `/opt/pw-browsers/...` (zmień `executablePath` na własną ścieżkę). Wyniki: `docs/verification.md`.
