# Research: referencje (28.09.2026)

## madeinevolve.com

**Technika** (analiza z żywej strony, 08.09.2026): Next.js na konwencjach Webflow, Lenis, przejścia stron w stylu barba (`data-transition-*`), GSAP + ScrollTrigger + **SplitText** + CustomEase + Flip + Observer, hls.js (wideo z Bunny), komponenty z biblioteki Osmo (marquee sprzężony z prędkością scrolla, akordeony). **Zero WebGL.** Cały efekt robi DOM + GSAP + jeden canvas 2D.

- Hero = **image sequence** (`frame-0NN.webp`) na canvasie, scrubowane scrollem, osobny wariant mobile.
- Komponenty: preloader z licznikiem i siatką komórek, `split-reveal`, **highlight-text** (słowo po słowie szare → białe na scrubie), marquee, akordeony usług, custom cursor z `data-hover`, blink-text, mini-showreel z lightboxem, przełączanie motywu jasny/ciemny per sekcja.
- Design: czerń `#111` + kwaśna zieleń `#c3ff00`, Neue Haas Grotesk + Bull Typewriter (mono mikro-labelki), cienka pionowa siatka na całej stronie, labelki w rogach. Home ≈ 9,2 wysokości ekranu.
- Treść: „Ecommerce and brand systems. Driven by visions. Built with design and technology.”, „Not just execution, not isolated services.”, narracja „step inside”, język ekosystemu. Showreel jako player z metadanymi (00:02:30 · 4K 60fps). Mail jako główne CTA, powtórzony 4+ razy.
- **Słabość:** bez drogich zdjęć i filmu to wydmuszka. Vibe niosą assety, nie system.

## bymonolog.com

- Webflow + (prawdopodobnie) Lenis/GSAP. Czarne tło, biel/krem, zdjęcia jako jedyny kolor, szeryf jako akcent w cytatach.
- Kolejność: hero → about (historia foundera: „visibility gap”) → wartości (4) → logotypy klientów → nagrody (Awwwards/FWA/CSSDA) → problem → 5 case studies z **metryką na pierwszym planie** (SS /01–/05) → opinie → 6 usług → proces w 3 krokach z wideo → FAQ (7) → CTA → stopka.
- Ton: „Anti-normal design that lives up to your ambition.”, „Refuse to be underestimated.”, „Outcomes first, taste second.”
- Kinetic type: nagłówki łamane na krótkie linie („build / an experience / That moves / → / People”).
- **Świetny detal:** w stopce przyciski „zapytaj Claude / Gemini / ChatGPT / Grok / Perplexity o MONOLOG”.
- **Słabość:** typowa sekwencja sekcji z szablonu agencji, bez jednej historii.

## Jak zrobić lepiej

1. **Jedna narracja zamiast listy sekcji**: motyw „gniazda” (nitki → struktura) prowadzi przez cały scroll.
2. **Wow z typografii, ruchu i shadera**, bo nie mamy jeszcze footage'u. Kinetic type + liquid chrome = efekt, który nie zależy od zdjęć.
3. **AI pokazane, nie wymienione**: interaktywne demo automatyzacji jako sekcja. Tego nie ma żadna z referencji.
4. **Metryki w case studies** (od Monologu) + **highlight-text na scrubie i mikro-labelki** (od Evolve), ale w naszym systemie.
5. Wydajność i dostępność jako przewaga: reduced-motion, szybki LCP, pełne PL znaki.

## inspo (archiwum produkcyjnych stron)

Zapytanie: minimalistyczne ciemne portfolio studia z kinetic type i chromem.
- Grawitacja kategorii: **ciemne tło 71%**, **grotesk sans 71%** jako display, akcent zwykle ciepły (38%). Monochrom + chrome odróżnia się od ciepłych akcentów konkurencji.
- Proponowana makrostruktura: **Split Studio** (typografia na jednej połowie, atmosferyczny panel na drugiej). Alternatywy: Specimen, Portfolio Grid.
- Warte obejrzenia: nbstudio.co.uk (branding agency, precyzyjny grotesk), tana.inc (spokojna ciemna przestrzeń), beauxartsparis.fr.
- Wskazówki: hero kompletny w pierwszym viewporcie (~1280×800), display w 2–3 liniach; między sekcjami 80–160 px, jeden rytm (np. `clamp(72px, 10vw, 140px)`).

## 21st.dev: komponenty do rozważenia

Najnowsze (community/components/newest), pasujące do briefu:
- Kinetic type: **Text Prism Split**, **Text Ligature Melt** (nikolas-sapa), **Chromatic Text Reveal** (honestui), **Flashlight Text Reveal** (kedhareswer).
- Hero / pola: **Hero Long Exposure**, **Hero Dipole Field**, **Hero Text Ring Funnel**, **Hero Burin Hatch** (nikolas-sapa), **Cinematic Orbit Hero** (daiv09).
- Scroll: **Scroll Caliper** (nikolas-sapa), **Reel Collage** (snapcn), Testimonials Vertical Marquee (scrollxui).
- Shader: Light Shader, Halftone Nebula, Scanline Bloom (kedhareswer).
- Przejścia / loadery: **Pixel Swap** (luv-jeri), Square Wave Loader.
- Karty: Notched Project Card, Handle Reel.

**Liquid chrome:**
- **Paper Shaders: Liquid Metal**, oraz warianty **Noir**, **Backdrop**, **Stripes** (`@paper-design/shaders-react`; rdzeń `@paper-design/shaders` działa też bez Reacta). Pierwszy wybór.
- Liquid Metal (educalvolpz), Border Chrome Ring (nikolas-sapa), Metal Button (arihantcodes), Mercury Dial (crafterui).

Strony komponentów: `https://21st.dev/@<autor>/components/<slug>`. Instalacja przez shadcn wymaga klucza 21st, więc łatwiej przeczytać źródło i przepisać pod nasz system.
