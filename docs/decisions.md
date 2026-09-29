# Decyzje (w tym domyślne z BRIEF §9)

Każda decyzja ma datę, uzasadnienie i sposób cofnięcia. Filip może zmienić dowolną jednym zdaniem.

## D1. Fonty: Space Grotesk Variable + Space Mono (28.09.2026)

Space Grotesk to decyzja Filipa (BRIEF §7). Do mikro-labelek wybrałem **Space Mono**, a nie JetBrains/Geist Mono, bo Space Grotesk jest proporcjonalną pochodną Space Mono (ta sama ręka: Florian Karsten), więc para jest "rodzinna", a nie dobrana z katalogu. Oba kroje OFL, z subsetami latin-ext (polskie znaki). Self-host przez `@fontsource-variable/space-grotesk` i `@fontsource/space-mono`, tylko subsety `latin` i `latin-ext`, `font-display: swap`.

Architektura: `--font-display` i `--font-text` to osobne zmienne. Gdyby Filip kupił licencję Neue Plak, podmiana to jedna linia w `src/styles/tokens.css` + plik `@font-face`. Pliki Neue Plak z projektów klienta (TCC) nie trafiają do repo.

Cofnięcie: zmienić `--font-mono` na inny krój (JetBrains Mono ma pełny latin-ext, gdyby Space Mono okazał się za "retro").

## D2. Języki: PL główny + EN pod `/en` (28.09.2026)

Domyślna z briefu. Static export daje dwie ścieżki: `/` (pl) i `/en/`. Teksty w `src/content/pl.ts` i `src/content/en.ts` o tym samym kształcie typu. Przełącznik w nav. Tag `hreflang` w obu. Cofnięcie: usunąć trasę `/en`, zostaje jeden słownik.

## D3. Kontakt: mailto + miejsce na Cal.com (28.09.2026)

Brief nie rozstrzyga (mail / Cal.com / formularz). Na start: główne CTA "Rozpocznij projekt" prowadzi do sekcji kontaktu, w której są: przycisk mailowy (adres placeholder) i przycisk "Umów rozmowę" gotowy na link Cal.com (placeholder, ukryty dopóki brak linku). Formularz odkładam: na static export wymaga Workera lub usługi trzeciej, a brief chce jednej akcji. Cofnięcie: dodać formularz z endpointem Workera (plan ma zadanie opcjonalne).

## D4. Domena: brak, placeholder `neststudio.pl` (28.09.2026)

Do meta tagów i `hreflang` używam `https://neststudio.pl` jako placeholdera (w `docs/placeholders.md`). Cofnięcie: jedna stała `SITE_URL` w `src/content/site.ts`.

## D5. Jedna scena Three.js zamiast Paper Shaders (28.09.2026)

Brief proponował `@paper-design/shaders-react` (Liquid Metal). Po wiadomości Filipa ("showcase, over the top, custom .js animations 3d jeśli trzeba") wybrałem własną scenę Three.js: nici (system instancjonowanych linii) i kropla chromu (icosfera z przemieszczeniem szumem, materiał metaliczny z proceduralnym env mapem) w jednym kontekście WebGL. Powody: jeden kontekst zamiast dwóch, chrome i nici w tej samej przestrzeni (kropla może "siedzieć" w gnieździe), pełna kontrola stanu z GSAP. Koszt: ~130 kB gzip więcej JS, ładowane dynamicznie po LCP. Cofnięcie: komponent `ChromeDrop` ma interfejs niezależny od implementacji; można go podmienić na Paper Shaders.

## D6. Motyw: ciemny z jednym białym blokiem (28.09.2026)

Strona jest ciemna. Blok "Projekty" jest jasny jako moment fabuły (showreel kończy się cięciem na papier, nici stają się tuszem). To jedyne odwrócenie; nie ma naprzemiennych sekcji. Cofnięcie: usunąć `data-theme="light"` z sekcji.

## D7. Bez custom cursora (28.09.2026)

Evolve ma custom cursor. Odrzucam: koszt dostępności i wydajności, cliché agencyjne. Zamiast tego: magnetyczne CTA, kropla chromu reagująca na kursor w hero, akordeon reagujący na hover. Cofnięcie: dodać `Cursor` jako osobny leaf, tylko `(pointer: fine)`.

## D8. Preloader raz na sesję (28.09.2026)

Licznik 2014 → 2026 i rysowanie znaku (≤ 1.6 s) tylko przy pierwszym wejściu w sesji (`sessionStorage`), nigdy przy `prefers-reduced-motion`. Powód: preloader przy każdym odświeżeniu to podatek. Cofnięcie: usunąć warunek.

## D9. Showreel: architektura gotowa na film, na start sekwencja generatywna (28.09.2026)

Brief: brak filmu. Player przyjmuje `src` mp4/HLS; bez `src` gra sekwencja z samej sceny 3D i typografii, scrubowana scrollem, z przyciskiem Play (auto-scroll przez pinowany dystans). Cofnięcie: podać `src` w `src/content/site.ts`.

## D10. Lata doświadczenia liczone, nie wpisane (28.09.2026)

"12 lat" wynika z `new Date().getFullYear() - 2014` w czasie builda, więc strona nie zestarzeje się w styczniu. Cofnięcie: wpisać stałą.

## D11. Ikony: Phosphor light (28.09.2026)

Jedna rodzina, waga `light` (1.5 px), zgodnie z high-end-visual-design i design-taste-frontend. Znak Nest Studio i mikro-animacje usług to własne SVG (uzasadnione: to marka, nie ikony UI).

## D12. Case studies: kandydaci z briefu jako placeholdery bez danych (28.09.2026)

Perun Tac, TCC Global, Oboda Group pojawiają się jako nazwy robocze z zakresem z briefu, ale bez metryk i bez opisów wyników. Metryki mają wartość `—` zastąpioną tekstem "metryka do uzupełnienia" i atrybut `data-placeholder`. Nic nie udaje prawdziwego wyniku. Cofnięcie: uzupełnić `src/content/projects.ts` po akceptacji Filipa.

## D13. Na dotyku scena WebGL startuje po pierwszym geście (28.09.2026)

Na urządzeniach z `(pointer: coarse)` scena Three.js nie startuje automatycznie: rusza przy pierwszym scrollu, dotyku albo kliknięciu (crossfade 1,2 s), a do tego czasu w slocie hero stoi kropla z gradientu CSS. Powody: kompilacja shaderów i PMREM nie blokują startu strony na telefonie, oszczędność baterii na stronie, której nikt nie przewija, i czystsze Core Web Vitals (TBT). Na desktopie scena startuje po preloaderze w `requestIdleCallback`. Cofnięcie: usunąć warunek `coarse` w `SceneCanvas.tsx`.

## D14. Preloader zostaje także na telefonie; LCP mobile zależy od podmiany fontu (28.09.2026)

Pomiar (Lighthouse mobile, symulowane wolne 4G i CPU ×4): element LCP to akapit lead w hero, a jego czas wynika z podmiany fontu (`font-display: swap`) po dociągnięciu Space Grotesk, nie z preloadera ani WebGL (wariant bez obu daje niemal ten sam LCP). Opcje, gdyby wynik terenowy (PageSpeed po wdrożeniu) był poniżej progu: (a) `font-display: optional` dla tekstu (na wolnym łączu zostaje font systemowy w danej sesji), (b) wyłączenie preloadera na dotyku, (c) mniejszy chunk startowy (GSAP ładowany po LCP). Nie wdrażam żadnej bez wyniku z prawdziwych telefonów. Cofnięcie: n/d.

## D15. Gniazdo nieregularne, światło krawędziowe na części nici, 40% nici (29.09.2026)

Uwagi Filipa: gniazdo wyglądało jak pączek (pochylony torus), brakowało gry światła, nici zasłaniały tło. Zmiany w `src/scene/ThreadField.ts` i nowym `src/scene/nestLayout.ts`:

- **Bryła.** Każda nić gniazda to łuk wokół własnej osi (baza u, v z CPU, oś a = u × v), z dryfem szerokości wzdłuż nici (spirala) i różną długością łuku. 46% nici to nawinięty brzeg (osie do ~40° od pionu gniazda), reszta to oplot z osiami z całej sfery, ~7% to luźne końce uciekające na zewnątrz. Promień powłoki: elipsoida (1,14 × 0,7 × 1,0) × garby niskiej częstotliwości (cztery sinusy od kierunku + cięższy bok) × nierówna grubość ściany, z płytką misą przesuniętą od środka, pochylona o 0,425 rad do widza, przechylona o -0,19 rad, z wolnym dryfem wokół osi i oddechem. Zero `snoise` w gnieździe (parametry liczone raz na CPU); w pełni splecione nici nie liczą też szumu chaosu (gałęzie spójne w instancji), więc shader jest tańszy niż przed zmianą.
- **Światło.** 14% nici (wybór z seeda, bez luźnych końców; test pilnuje 10 do 18%) leży w zewnętrznej warstwie powłoki i niesie światło krawędziowe: fresnel od przybliżonej normalnej bryły względem kamery, wolne pasmo przemiatania (~30 s) i lekkie przyciąganie kierunku światła do kursora. Kolor to gradient "chrome spectral" z nowych tokenów w `DESIGN.md` §2: Rim Steel `#6F8FB8` (strona cienia) → Rim Bone `#F4F4F5` → Rim Warm `#E8C79A` (strona światła). Blask jest addytywny w tym samym przebiegu co nici (blending premultiplied: kolor × alfa + blask bez alfy), nici ze światłem są na końcu bufora, więc rysują się na wierzchu. W bloku jasnym (`uInk = 1`) blask gaśnie, a nić ze światłem staje się ciemniejszym połyskiem Rim Sheen `#46505C`. W chaosie i tunelu światło gaśnie razem ze splotem.
- **Liczba nici** (`budget()` w `SceneCanvas.tsx`): desktop 2400 / 1400 (było 6000 / 3500), telefon 620 / 400 (było 1400 / 900), strażnik wydajności połowi od 900 w górę (było 1500). Alfa pojedynczej nici lekko wyżej, bo jest ich mniej. Gniazdo mniejsze (promień 2,05 zamiast 3,2), więc zostaje gęste mimo 40% nici; na wąskich ekranach skaluje się z proporcją kadru.
- **Telefon** (`SceneDirector.tsx`): pozycje gniazda z desktopu przesuwane o 70%, żeby gniazdo wchodziło w kadr bokiem, a w kontakcie środek zgodnie z `Contact.tsx` (wcześniej tween reżysera nadpisywał tam `nestX` na 2,3 i gniazda nie było widać).

Fallback (`SceneFallback.tsx`) rysuje splot nici, nie gniazdo, więc bez zmian. Porównania przed/po: `docs/shots/nest/`. Cofnięcie: przywrócić `nestPos()` z torusem i liczby w `budget()`; tokeny `--rim-*` można zostawić.
