# STAN prac: Nest Studio

> Aktualizowany na każdym kamieniu milowym. Filip: zacznij czytać tutaj.

## Dwa branche (28.09.2026)

| Branch | Co jest | Stan |
|---|---|---|
| `claude/nest-studio-website-3yjej7` | wersja z preloaderem (licznik 2014 → rok) i kroplą płynnego chromu w hero, napięciu, showreelu i finale | zamknięta, zweryfikowana, gotowa do deployu |
| `claude/nest-studio-title-sequence-3yjej7` | **sekwencja tytułowa "NEST STUDIO" w czerwonym świetle zamiast kropli** (brief Filipa: wejściówka Stranger Things na typografii studia) | zbudowana, zweryfikowana w headless Chromium, do obejrzenia na prawdziwym GPU |

Reszta strony (sekcje, teksty, gniazdo z nici, nawigacja, EN) jest wspólna. Ten plik opisuje branch `title-sequence`.

## GitHub Pages (29.09.2026)

Build pod project page `https://filipjakubiak.github.io/neststudio/`: zmienne `NEXT_PUBLIC_BASE_PATH=/neststudio` i `NEXT_PUBLIC_SITE_URL` (bez nich build jest jak dotąd, dla Cloudflare). Workflow: `.github/workflows/pages.yml` (build, prefiks `url(/fonts/` w CSS, `.nojekyll`, deploy). Zweryfikowane lokalnie pod prefiksem (Chromium): zero 404, zero błędów, fonty PL załadowane. **Wymaga ustawień po stronie Filipa:** Settings → Pages → Source: GitHub Actions oraz dopuszczenia brancha w Settings → Environments → github-pages (Deployment branches). Repo musi być publiczne (albo plan z Pages dla prywatnych).

## Gdzie jesteśmy (28.09.2026, noc)

**Sekwencja tytułowa działa od pierwszej klatki do stopki.** Koncepcja i storyboard: `docs/titles.md`. Decyzje: D15 (sekwencja zamiast preloadera i kropli), D16 (jeden akcent Żar `#FF2E1A`, wyłącznie jako światło), D17 (przy pierwszej wizycie scena startuje od razu, także na dotyku).

Co jest nowe:
- Litery "NEST STUDIO" (Space Grotesk, NEST 600 / STUDIO 400, wersaliki) jako ekstruzje 3D z fazą, jeden shader: grafitowe lico, czerwone światło kluczowe na bokach i fazach, rim (fresnel), odbłysk. Kontury generuje `scripts/title-glyphs.py` do `src/scene/titleGlyphs.ts`; układ (jedna linia / dwie linie na telefonie) w `src/scene/titleLayout.ts`, wspólny dla sceny i fallbacku SVG.
- Sekwencja ok. 4,6 s (`src/components/TitleSequence.tsx`): pierwsze litery przechodzą tuż przed obiektywem jako wielkie kanty, kamera odjeżdża z z = 3 do z = 10, światło przechodzi z lewej na prawą, migotanie z szumu, ostatnie "I" opada z góry, lock z pulsem ekspozycji i bloomu, aberracja skacze i wraca. Pomiń: klik, dotyk, Enter, spacja, Escape, przycisk. Raz na sesję (jak D8), nigdy przy reduced motion.
- Post-processing (`src/scene/post.ts`): bloom (pół rozdzielczości, MSAA na render targecie), aberracja radialna, ziarno, winieta, OutputPass (ACES, sRGB). Włączany tylko gdy litery są widoczne albo gniazdo się żarzy; poza tym render bezpośredni jak dotąd.
- Hero: lockup 3D w boksie `.hero-lockup` nad nagłówkiem, światło podąża za kursorem; scroll odrywa litery od boksu, cofa je w głąb i gasi, nici przejmują kadr. Fallback: inline SVG konturów (obrys Żar + poświata), widoczny przy reduced motion, bez WebGL i przez chwilę przy powtórnej wizycie.
- Finał (Kontakt): gniazdo domyka się i rozżarza od środka (`glow`, nici w HDR, próg bloomu obniżany razem z żarem), krótki puls jak lock. Stopka: lockup 3D wraca w `.footer-lockup` (klamra: nazwa na początku i na końcu), tło stopki przezroczyste.
- Kropla chromu usunięta wszędzie (Tension, Showreel, Contact, Director, stan sceny). Token `--chrome` zastąpiony przez `--ember` i `--ember-glow`; rama portretu to hairline.
- Ścieżki awaryjne: brak WebGL → overlay znika w < 1 s, hero z SVG; chunk three wolniejszy niż 3,5 s → overlay pokazuje statyczny lockup SVG, po 6 s bez sceny strona odsłania się bez sekwencji; scena spóźniona po odsłonięciu → litery pojawiają się w hero crossfadem.
- Flaga `TITLE_SEQUENCE_ON_TOUCH` w `src/content/site.ts` (domyślnie `true`): `false` wyłącza sekwencję na urządzeniach dotykowych (lockup 3D zostaje).

Weryfikacja (headless Chromium, SwiftShader, `lab/titles.mjs` przewija timeline klatka po klatce): desktop 1440×900 i mobile 390×844 (dwie linie), skip, revisit bez sekwencji, reduced motion (fallback SVG), brak WebGL, wolny chunk, arkusz całej strony (49 klatek, bez poziomego scrolla, zero błędów konsoli), finał z żarem, stopka. Szczegóły i Lighthouse: `docs/verification.md` (sekcja "Sekwencja tytułowa").

**Lighthouse w kontenerze nie mierzy tej wersji sensownie**: WebGL na SwiftShader (CPU) liczy się jako czas głównego wątku, więc TBT desktop rośnie do ok. 4 s (poprzednio 380 ms, bo scena startowała po preloaderze, poza oknem pomiaru). Na GPU ta praca nie istnieje; realny koszt to parsowanie chunku three (593 kB raw, ok. 150 kB brotli) i kompilacja shaderów (asynchroniczna tam, gdzie sterownik wspiera `KHR_parallel_shader_compile`). Do potwierdzenia PageSpeed po wdrożeniu.

## Co dalej (wymaga Filipa)

1. **Obejrzeć sekwencję na prawdziwym sprzęcie** (desktop z GPU, iPhone Safari): płynność, jasność czerwieni, czy faza liter jest wystarczająco widoczna, czy tempo 4,6 s jest dobre. W kontenerze sprawdzam kompozycję klatek, nie płynność.
2. **Deploy**: `npx wrangler login && npm run deploy` z wybranego brancha, potem PageSpeed Insights (desktop i mobile) dla obu wersji, żeby porównać koszt sekwencji.
3. **Decyzja, który branch idzie dalej** (albo scalenie: sekwencja zostaje, ale np. bez liter w stopce).
4. Placeholdery bez zmian: `docs/placeholders.md` (domena, mail, telefon, NIP, social, zdjęcie, projekty, showreel).

## Otwarte pytania do Filipa

1. Czerwień: Żar `#FF2E1A` (ciepła, bliska referencji). Alternatywa monochromatyczna (światło w kości `#F4F4F5`) to zmiana jednego uniformu i dwóch tokenów, bez przebudowy.
2. Wagi liter: NEST 600 / STUDIO 400 (kontrast jak w wordmarku). Można ujednolicić do 600 (jedna zmiana w `scripts/title-glyphs.py`).
3. Nici nad literami w hero: nici z przodu przecinają litery (gniazdo "łapie" nazwę). Zostawić czy schować nici pod literami?
4. Sekwencja na telefonach: zostaje (`TITLE_SEQUENCE_ON_TOUCH = true`) czy wyłączyć, jeśli PageSpeed mobile spadnie za bardzo?
5. Poprzednie pytania (znak A/B, nazwy i metryki projektów, kontakt, domena, zdjęcie, showreel) bez zmian.

## Jak uruchomić

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static export do out/
npm test         # vitest
python3 scripts/title-glyphs.py   # po zmianie wag liter (wymaga fonttools + brotli)
```

Weryfikacja w przeglądarce: `lab/README.md` (`titles.mjs`, `frame.mjs`, `fallbacks.mjs`, `finale.mjs`).
