# Nest Studio: koncepcja (brainstorming → paint → design-dna)

> Dokument etapu 1. Tezy, kierunek, profil Design DNA. Tokeny w `DESIGN.md`, decyzje domyślne w `docs/decisions.md`, narracja i teksty w `docs/copy.md`, plan w `docs/plan.md`.
>
> Tryb pracy: Filip pracuje asynchronicznie, więc brainstorm poszedł po briefie (BRIEF.md odpowiada na wszystkie pięć domen), a luki wypełniłem wartościami domyślnymi z BRIEF §9 i zapisałem je w `docs/decisions.md`. Każdą z tych decyzji można cofnąć jednym zdaniem.

## 1. Brainstorm: pięć domen

| Domena | Odpowiedź (źródło) |
|---|---|
| Produkt | Strona-showcase studia projektowego: branding, www, strategia, AI/automatyzacje. Sama strona ma być najlepszym case study i pokazem motion + web designu. (BRIEF §1, §2, wiadomość Filipa z 28.09) |
| Odbiorca | Founderzy i firmy, które chcą wyglądać na tyle, ile są warte, i działać szybciej dzięki AI. Decydent, który ocenia poziom po pierwszych 5 sekundach scrolla. (BRIEF §1) |
| Nastrój | Precyzyjny, pewny, monochromatyczny, kinetyczny, "żywy metal". Pięć słów: **czarny, chirurgiczny, płynny, monumentalny, żywy**. (BRIEF §3) |
| Referencje | madeinevolve.com (rytm, preloader, highlight-text, mikro-labelki), bymonolog.com (ton, metryki, FAQ, "zapytaj AI"), Paper Shaders Liquid Metal, 21st.dev (kinetic type). Obie referencje mamy przebić: jedna historia zamiast listy sekcji, wow z typografii, ruchu i shadera zamiast z footage'u. (docs/research.md) |
| Stack | Od zera. Rekomendacja z briefu przyjęta: Next.js static export + TS + Tailwind v4 + GSAP 3.13 (wszystkie pluginy) + Lenis. Dodaję **Three.js** dla jednej sceny 3D spinającej całą stronę (decyzja po wiadomości Filipa: "custom .js animations 3d jeśli trzeba"). Hosting Cloudflare Workers static assets. (BRIEF §8) |

**Design read** (design-taste-frontend §0.B): studio portfolio dla founderów, język kinetyczno-typograficzny "agency grade", rodzina estetyczna: czarno-biały minimalizm z jednym materiałowym akcentem, własny system (bez gotowego design systemu), Tailwind v4 + GSAP + Three.js.

**Suwaki**: `DESIGN_VARIANCE 9 / MOTION_INTENSITY 10 / VISUAL_DENSITY 3`. Wariancja 9, bo hero i sekcje mają być asymetryczne i typograficzne; ruch 10, bo strona jest showreelem; gęstość 3, bo czerń potrzebuje powietrza, żeby chrome i typografia grały.

## 2. Tezy (paint, faza 2)

### Teza wizualna

Monochromatyczna, czarna scena typograficzna: Space Grotesk w monumentalnej skali z ciasnym trackingiem (-0.04em) kontra mono mikro-labelki (Space Mono, uppercase, +0.14em), jeden materiałowy akcent zamiast koloru (liquid chrome jako "żywe centrum gniazda", nigdy jako dekoracja), galeryjna przestrzeń (sekcje 8 do 12 rem, gęstość 3/10), komponenty płaskie: zero kart, zero cieni, hairline'y 1 px na 12% bieli i negatywna przestrzeń jako jedyne separatory, kontenery ostre (radius 0), a elementy interaktywne to pigułki (radius 9999).

### Teza interakcyjna

Ruch scrubowany scrollem (Lenis + ScrollTrigger, scrub 0.8 do 1.2) jako główny nośnik narracji, wejścia 600 do 900 ms na `expo.out`, wyjścia 60% czasu wejścia, mikro-interakcje 160 do 240 ms; hover z fizyką sprężyny (magnetyczne CTA, kropla chrome podąża za kursorem z opóźnieniem masy); jedna scena Three.js z nićmi i chromem spina wszystkie sekcje i zmienia stan wraz z fabułą; zabronione: generyczny fade-up jako domyślne wejście, bounce/elastic, `linear`, `ease-in-out`, custom cursor, animowanie width/height/top/left, jakikolwiek ruch bez fallbacku dla `prefers-reduced-motion`.

## 3. Motyw: gniazdo, czyli nić

**Gniazdo** to struktura zbudowana z wielu pojedynczych elementów, która staje się domem dla czegoś żywego. Metafora studia: z luźnych nici (strategia, identyfikacja, strona, automatyzacje) splatamy jedną spójną strukturę, w której marka może rosnąć. Chrome to żywe centrum gniazda.

Realizacja: **jedna scena WebGL (Three.js) w tle całej strony**. Kilka tysięcy nici (instancjonowane linie / krzywe sterowane szumem w shaderze) i jedna kropla płynnego chromu. Scroll odwiedzającego jest tym, co splata nici. Stan sceny (parametr `weave` 0 → 1, pozycja i skala kropli, kolor nici, prędkość, chaos) sterowany przez GSAP z ScrollTriggerów każdej sekcji. Sekcje DOM scrollują nad sceną. Metafora pozostaje subtelna: nigdy dosłowny ptasi obrazek.

### Zdanie "to ta strona, na której..."

*To ta strona, na której twój własny scroll splata tysiące luźnych nici w gniazdo, a na końcu w jego środku ląduje kropla płynnego chromu.*

### Signature move: "Nić"

Jedno bespoke zachowanie, którego nie ma w żadnym kicie: **persystentny system nici**, który (a) w tle jest sceną 3D splatającą się wraz z fabułą, (b) na prawej krawędzi ekranu (desktop) ma swój dwuwymiarowy cień: cienką pionową nić-rail, na której każda przekroczona sekcja zostawia splot (marker). Rail jest nawigacją (klik przenosi do sekcji) i zapisem drogi: w stopce jest kompletnym splotem. Na mobile rail znika, scena zostaje (mniej nici, niższe DPR).

## 4. Gramatyka strony i krzywa emocji (scroll-craft)

**Gramatyka: kinetyczny splot (kinetic weave).** Jedna ciągła opowieść (jak filmic one-shot) niesiona przez typografię (jak typographic poster), z jedną stałą sceną 3D pod spodem. Dlaczego nie pozostałe: chaptered editorial i gallery zabijają ciągłość, live surface pasuje tylko do sekcji AI (i tam jest użyta jako urządzenie, nie gramatyka), continuous world wymaga fotograficznego świata, którego nie mamy, split stage pasuje tylko do sekcji napięcia (użyta tam), rhythmic cutlist kłóci się z "jedną historią".

- **Nawigacja:** pasek 64 px (wordmark, język, CTA, menu-morph) + nić-rail po prawej.
- **Hero:** manifest w kinetic type z kroplą chromu wewnątrz nagłówka.
- **Zakończenie:** gniazdo się domyka i **trzyma**; CTA jest w środku. Żadnego wygaszania do stopki.
- **Zakazy:** scroll cue, liczniki sekcji `01/06`, eyebrow nad każdą sekcją (max 4 na 12 sekcji), wyśrodkowana kopia w każdej sekcji, ten sam device dwa razy z rzędu, stockowe zdjęcia, fałszywe screenshoty z divów, wymyślone liczby bez oznaczenia.

### Krzywa emocji (jedna linia na akt: emocja, potem przyczyna na ekranie)

| # | Sekcja | Emocja | Co to powoduje | Device |
|---|---|---|---|---|
| 0 | Preloader | ciekawość | licznik 2014 → 2026, nici zbiegają się w znak N | draw + count |
| 1 | Hero | skala, podziw | manifest wjeżdża liniami przez maskę, kropla chromu w środku zdania reaguje na kursor, nici luźne, w dryfie | kinetic + pointer |
| 2 | Napięcie | rozpoznanie, niepokój | dwie kolumny: "jak wyglądasz" (litery rozsypane, drżące) i "ile jesteś wart" (litery stałe); scroll domyka lukę | split stage (pin, scrub) |
| 3 | Showreel **(PEAK)** | dreszcz | pełny ekran, scena 3D przejmuje viewport, nici przyspieszają w tunel, typografia wchodzi w głąb (translateZ), player z timecode | pin 400vh + 3D |
| 4 | Projekty | zaufanie | cięcie na biel (jedyna zmiana motywu): arkusze case studies z metryką na pierwszym planie; nici stają się czarnym tuszem na papierze | sticky stack |
| 5 | Usługi | jasność | cztery pionowe pasma (akordeon poziomy), każde z własną mikro-animacją nici | horizontal accordion |
| 6 | AI demo | zaskoczenie, sprawczość | powierzchnia, która sama się składa: wybierasz proces, węzły i krawędzie budują przepływ, pakiety płyną | live surface (interaktywna) |
| 7 | Proces | pewność | jedna nić rysuje się wzdłuż scrolla przez pięć stacji | DrawSVG scrub + pinned steps |
| 8 | O Filipie | bliskość | portret (placeholder) w ramie z chromu, warstwy w paralaksie, "od 2014" | parallax |
| 9 | FAQ | spokój | akordeon z +/−, pytania wchodzą maską | flow + in |
| 10 | CTA | rozstrzygnięcie | nici domykają gniazdo wokół kropli, jedno zdanie, jedno CTA (magnetyczne), wszystko się zatrzymuje i trzyma | pin + magnet |
| 11 | Stopka | spokój po | wordmark w wielkiej skali, dane, "zapytaj Claude / ChatGPT / Perplexity o Nest Studio" | flow |

Sprawdzenie: żadne dwa sąsiednie akty nie niosą tej samej emocji; żaden device nie powtarza się z rzędu; jeden peak (showreel) z największym spanem (400vh) i ciszą przed nim (napięcie kończy się zatrzymaniem); zakończenie rozstrzyga i trzyma.

### Pacing

Preloader ≤ 1.6 s (pomijany przy powtórnej wizycie w sesji). Hero 100vh. Napięcie pin 200vh. Showreel pin 400vh. Projekty 3 × 100vh stack. Usługi 100vh. AI demo 120vh. Proces pin 250vh. O Filipie 100vh. FAQ ~90vh. CTA pin 150vh. Stopka 80vh. Razem ≈ 17 wysokości ekranu (Evolve ma 9,2; tu jest więcej, bo showreel i proces są scrubowane, a nie oglądane).

## 5. Referencje: co bierzemy, co odrzucamy

| Skąd | Bierzemy | Odrzucamy |
|---|---|---|
| Evolve | preloader z licznikiem, highlight-text na scrubie (w sekcji "napięcie" i FAQ), mono mikro-labelki, cienka siatka, player showreela z metadanymi | zależność od footage'u, custom cursor, przełączanie motywu w każdej sekcji |
| Monolog | metryki na pierwszym planie w case studies, FAQ, przyciski "zapytaj AI o nas", łamanie nagłówków na krótkie linie | szablonowa kolejność sekcji, brak jednej historii |
| Paper Shaders | pomysł na liquid metal | osobny kontekst WebGL (chrome robimy we własnej scenie Three.js: jedna scena, jeden kontekst) |
| 21st.dev | Text Prism Split, Chromatic Text Reveal jako inspiracja dla hero; Scroll Caliper jako inspiracja dla nici-rail | kopiowanie 1:1 |
| docs/design-systems (GSAP, Revolut) | z GSAP: jedna rodzina fontów w sześciu wagach, ghost-pille, hairline'y; z Revolutu: waga display 500, tracking rosnący z rozmiarem, pigułki 9999 | kolory kategorii, krem, fotografia |

## 6. Design DNA (profil JSON)

```json
{
  "meta": {
    "name": "Nest Studio",
    "description": "Monochromatyczna scena typograficzna z jednym materiałowym akcentem (liquid chrome) i jedną sceną 3D nici splatających się w gniazdo wraz ze scrollem.",
    "source_references": ["madeinevolve.com", "bymonolog.com", "Paper Shaders Liquid Metal", "docs/design-systems/GSAP DESIGN.md", "docs/design-systems/REVOLUT DESIGN.md"],
    "created_at": "2026-09-28"
  },
  "design_system": {
    "color": {
      "palette_type": "monochromatic",
      "primary": { "hex": "#0A0A0B", "role": "canvas, near-black (nigdy #000)" },
      "secondary": { "hex": "#F4F4F5", "role": "ink, off-white tekst i wordmark" },
      "accent": { "hex": "chrome", "role": "materiał, nie kolor: shader liquid metal; fallback CSS gradient #F5F5F5 → #8C8C90 → #2B2B2E → #E8E8EA" },
      "neutral": { "scale": ["#0A0A0B", "#141416", "#1E1E21", "#3A3A3F", "#6B6B72", "#8A8A90", "#B4B4B9", "#D9D9DC", "#F4F4F5"], "usage": "141416 surface stopki, 3A3A3F disabled, 8A8A90 muted text, D9D9DC ink na białym bloku" },
      "semantic": { "success": "#8FE3B0", "warning": "#F2D479", "error": "#F08A8A", "info": "#F4F4F5" },
      "surface": { "background": "#0A0A0B", "card": "none (zero kart)", "elevated": "#141416 (menu overlay, stopka)" },
      "contrast_strategy": "high contrast; ink na canvas 17.9:1, muted 5.4:1; jeden blok jasny (Projekty) z odwróconymi rolami: canvas #F4F4F5, ink #0A0A0B"
    },
    "typography": {
      "type_scale": {
        "display": { "size": "clamp(3.4rem, 10vw, 11rem)", "weight": 500, "line_height": 0.92, "tracking": "-0.04em" },
        "heading_1": { "size": "clamp(2.6rem, 6.5vw, 6.5rem)", "weight": 500, "line_height": 0.96, "tracking": "-0.035em" },
        "heading_2": { "size": "clamp(2rem, 4.5vw, 4.25rem)", "weight": 500, "line_height": 1.0, "tracking": "-0.03em" },
        "heading_3": { "size": "clamp(1.375rem, 2.2vw, 2rem)", "weight": 500, "line_height": 1.1, "tracking": "-0.015em" },
        "body": { "size": "1.0625rem", "weight": 400, "line_height": 1.6, "tracking": "0" },
        "body_small": { "size": "0.9375rem", "weight": 400, "line_height": 1.55, "tracking": "0" },
        "caption": { "size": "0.8125rem", "weight": 400, "line_height": 1.4, "tracking": "0.01em" },
        "overline": { "size": "0.6875rem", "weight": 400, "line_height": 1.2, "tracking": "0.14em (mono, uppercase)" }
      },
      "font_families": { "heading": "Space Grotesk Variable (latin, latin-ext)", "body": "Space Grotesk Variable", "mono": "Space Mono (latin, latin-ext)" },
      "font_style_notes": "geometryczny grotesk z charakterem (Space Grotesk to proporcjonalna pochodna Space Mono, stąd para); display nigdy powyżej 500, autorytet ze skali i trackingu; --font-display do podmiany (Neue Plak) jedną zmienną"
    },
    "spacing": { "base_unit": "4px", "scale": [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192], "content_density": "spacious", "section_rhythm": "clamp(6rem, 12vw, 12rem) między sekcjami; pinowane sekcje mają własny span (200 do 400vh)" },
    "layout": { "grid_system": "12 kolumn, gutter fluid", "max_content_width": "1440px (siatka), 1200px (tekst), 62ch (akapit)", "columns": 12, "gutter": "clamp(1rem, 4vw, 4rem)", "breakpoints": "360 / 640 / 768 / 1024 / 1280 / 1536", "alignment_tendency": "asymmetric (kotwica zmienia się sekcja po sekcji: lead, trail, split, center tylko w CTA)" },
    "shape": { "border_radius": { "small": "0", "medium": "0", "large": "0", "pill": "9999px" }, "border_usage": "hairline 1px rgba(244,244,245,0.12) na ciemnym, rgba(10,10,11,0.12) na jasnym", "divider_style": "hairline na pełną szerokość sekcji, więcej przestrzeni nad nagłówkiem niż pod nim" },
    "elevation": { "shadow_style": "none", "levels": { "low": "none", "medium": "none", "high": "none (menu overlay: backdrop-blur 24px + #141416 na 92%)" }, "depth_cues": "overlapping layers, WebGL depth, blur/glass tylko na overlay" },
    "iconography": { "style": "outline, precyzyjne", "stroke_weight": "1.5px", "size_scale": "16 / 20 / 24", "preferred_set": "@phosphor-icons/react (weight light/regular), jedna rodzina" },
    "motion": { "easing": "expo.out cubic-bezier(0.16,1,0.3,1) wejścia; power2.inOut stany scrubowane; CustomEase 'weave' M0,0 C0.2,0 0.1,1 1,1 dla splatania", "duration_scale": { "micro": "160-240ms", "normal": "400-600ms", "macro": "800-1200ms" }, "entrance_pattern": "maska liniowa (SplitText lines, clip-path) + przesunięcie 0.6em, stagger 40-60ms", "exit_pattern": "60% czasu wejścia, opacity + przesunięcie 0.2em, bez blur", "philosophy": "cinematic, scroll as playhead, one story" },
    "components": { "button_style": "pigułka 9999px, primary ink na canvas (#F4F4F5 tło, #0A0A0B tekst), secondary ghost hairline; trailing arrow w osobnym kółku; active scale 0.98; magnetyczny na (hover:hover)", "input_style": "podkreślenie hairline, label nad polem, focus ring 2px ink offset 2px", "card_style": "brak kart; arkusze case study to pełnowymiarowe płaszczyzny na białym bloku", "navigation_pattern": "pasek 64px: wordmark, język, CTA, przycisk menu morfujący w X; overlay pełnoekranowy ze staggerem linków", "modal_style": "brak modali", "list_style": "hairline między wierszami, mono numeracja tylko w procesie (stacje), nigdy jako meta-labelki", "component_notes": "eyebrow max 4 na stronę (hero, showreel, usługi, kontakt)" }
  },
  "design_style": {
    "aesthetic": { "mood": ["chirurgiczny", "monumentalny", "płynny", "pewny", "żywy"], "visual_metaphor": "gniazdo splatane z nici, z żywym centrum z płynnego metalu", "era_influence": "2026: monochrom + jeden materiałowy akcent, scroll-scrubbed storytelling, WebGL punktowo", "genre": "agency grade kinetic typography", "personality_traits": ["konkretny", "spokojny", "precyzyjny", "odważny w skali"], "adjectives": ["czarny", "kinetyczny", "chromowy", "przestronny", "spleciony"] },
    "visual_language": { "complexity": "minimal na powierzchni, rich w ruchu", "ornamentation": "none", "whitespace_usage": "galeryjne", "visual_weight_distribution": "jeden ciężki element na viewport (nagłówek albo chrome)", "focal_strategy": "single hero element per section, progressive reveal per page", "contrast_level": "high", "texture_usage": "brak ziarna na scrollu; tylko chrome ma teksturę (odbicia)" },
    "composition": { "hierarchy_method": "scale contrast + typographic hierarchy", "balance_type": "asymmetric", "flow_direction": "vertical with lateral acts (accordion, split)", "grouping_strategy": "negative space, hairlines", "negative_space_role": "cisza przed peakiem i po CTA" },
    "imagery": { "photo_treatment": "brak fotografii poza portretem Filipa (placeholder, monochrom, lekki kontrast)", "illustration_style": "generatywne wzory nici (SVG, seed per projekt) zamiast screenshotów", "graphic_elements": "nici, znak N, hairline'y, kropla chromu", "pattern_usage": "cienka siatka pionowa na całej stronie (opacity 0.06)", "image_shape": "ostre prostokąty" },
    "interaction_feel": { "feedback_style": "fizyczny: scale 0.98 na active, magnetyzm", "hover_behavior": "przesunięcie strzałki w kółku, chrome reaguje na kursor, akordeon rozszerza pasmo", "transition_personality": "smooth glide z ciężarem", "loading_style": "preloader z licznikiem i rysowaniem znaku", "microinteraction_density": "medium: każdy element interaktywny ma 5 stanów, ale bez pętli nieskończonych poza chromem i nićmi" },
    "brand_voice_in_ui": { "tone": "pewny, konkretny, krótkie zdania", "formality": "na ty, bez korpo-żargonu", "cta_style": "direct imperative: Rozpocznij projekt", "empty_state_approach": "n/d (strona statyczna)", "error_tone": "krótko, co poszło nie tak i co zrobić" }
  },
  "visual_effects": {
    "overview": { "effect_intensity": "heavy-immersive", "performance_tier": "heavy (WebGL) z lekkim fallbackiem", "fallback_strategy": "prefers-reduced-motion lub brak WebGL: statyczny SVG splotu + CSS gradient chrome; mobile: mniej nici, DPR ≤ 1.5, pauza poza viewportem", "primary_technology": "Three.js (jedna scena) + GSAP ScrollTrigger + Lenis" },
    "background_effects": { "type": "generative-art", "description": "instancjonowane nici (linie Beziera) sterowane szumem simplex, splatające się w torus-gniazdo wraz z parametrem weave", "technology": "Three.js, własny shader wierzchołków", "params": { "color_palette": "ink na canvas; na białym bloku odwrócone", "speed": "dryf 0.05, w showreelu do 1.0", "density": "6000 nici desktop / 2000 mobile", "opacity": "0.35 do 0.9 zależnie od weave", "blend_mode": "additive na ciemnym, normal na jasnym" } },
    "particle_systems": { "enabled": false, "type": "none", "description": "nici zastępują cząstki", "technology": "n/d", "params": { "count": 0, "shape": "n/d", "size_range": "n/d", "movement_pattern": "n/d", "color_behavior": "n/d", "interaction": "none", "spawn_area": "n/d" } },
    "3d_elements": { "enabled": true, "type": "abstract-geometry", "description": "kropla płynnego chromu: icosfera z przemieszczeniem wierzchołków szumem, materiał metaliczny z proceduralnym environment mapem", "technology": "Three.js", "params": { "renderer": "WebGLRenderer, antialias, DPR ≤ 1.5 mobile / 2 desktop", "lighting": "RoomEnvironment PMREM + 1 directional", "camera": "perspective 35°, stała, ruch przez transformy obiektów", "materials": "MeshPhysicalMaterial metalness 1, roughness 0.08, clearcoat 1", "geometry": "IcosahedronGeometry(1, 6)", "post_processing": [], "interaction_model": "kropla podąża za kursorem w hero (spring lag), w CTA nieruchoma" } },
    "shader_effects": { "enabled": true, "type": "custom-GLSL", "description": "przemieszczenie wierzchołków kropli i nici", "technology": "GLSL w onBeforeCompile / ShaderMaterial", "params": { "uniforms": "uTime, uWeave, uChaos, uSpeed, uInk, uMouse", "vertex_manipulation": "simplex 3D, amplituda 0.12 do 0.35", "fragment_output": "chrome z env map; nici: kolor z alfa zależną od weave", "noise_type": "simplex", "distortion": "liquid" } },
    "scroll_effects": {
      "parallax": { "enabled": true, "layers": "3 (sekcja O Filipie: portret, ramka chromu, tekst)", "depth_range": "-40px do +60px", "speed_curve": "linear scrub" },
      "scroll_triggered_animations": { "enabled": true, "trigger_points": "każda sekcja ma własny ScrollTrigger; pinowane: napięcie, showreel, proces, CTA", "animation_type": "clip-reveal, counter, draw-SVG, 3D scene state", "scrub_behavior": "scrub 0.8 do 1.2; wejścia tekstu bez scrubu (once)" },
      "scroll_morphing": { "enabled": true, "description": "stan sceny (weave, chaos, chromeScale, chromePos, ink) morfuje między sekcjami; znak N w preloaderze rysowany z nici" }
    },
    "text_effects": { "type": "split-letter-animate", "description": "SplitText: linie przez maskę w hero, znaki rozsypane i ściągane w sekcji napięcia, highlight słowo po słowie na scrubie w FAQ/manifeście", "technology": "GSAP SplitText 3.13", "params": { "split_strategy": "by-line (hero), by-char (napięcie), by-word (highlight)", "animation_per_unit": "yPercent 110 → 0 + clip; chars: x/y random ±40px, rotate ±8°, opacity 0.2 → 1", "stagger": "40-60ms linie, 8ms znaki", "effect_style": "mask reveal, scatter-to-align" } },
    "cursor_effects": { "enabled": true, "type": "magnetic-buttons", "description": "magnetyczne CTA i chrome reagujący na kursor; brak custom cursora", "params": { "shape": "n/d", "size": "n/d", "blend_mode": "n/d", "trail": "none", "interaction_zone": "80px wokół CTA; cały hero dla chromu" } },
    "image_effects": { "type": "reveal-clip", "description": "portret i arkusze projektów wchodzą clip-path inset", "technology": "GSAP clip-path", "params": { "filter_pipeline": "grayscale(1) contrast(1.05) na portrecie", "hover_transform": "scale 1.03 w overflow hidden (700ms expo.out)", "reveal_animation": "clip-path inset(100% 0 0 0) → inset(0)", "distortion_type": "none" } },
    "glassmorphism_neumorphism": { "enabled": true, "style": "frosted-layers tylko na menu overlay i pasku nav po scrollu", "params": { "blur_radius": "24px", "transparency": "0.92 (overlay), 0.7 (nav)", "border_treatment": "hairline dół", "shadow_type": "none", "light_source_angle": "n/d" } },
    "canvas_drawings": { "enabled": false, "type": "none", "description": "wszystko w WebGL lub SVG", "technology": "n/d", "params": { "draw_method": "n/d", "animation_loop": "n/d", "color_scheme": "n/d", "responsiveness": "n/d", "interaction": "n/d" } },
    "svg_animations": { "enabled": true, "type": "path-draw", "description": "znak N w preloaderze (DrawSVG), nić procesu (DrawSVG scrub), mikro-animacje usług (MorphSVG, DrawSVG), generatywne wzory projektów", "params": { "animation_method": "GSAP DrawSVG/MorphSVG + CSS", "path_morphing": "znak N ↔ trzy nici", "stroke_animation": "dashoffset scrub", "filter_effects": "none" } },
    "composite_notes": "Jeden kontekst WebGL na stronę (nici + chrome) w fixed canvas pod DOM; sekcje przekazują stan przez GSAP timeline'y na wspólny obiekt state. Showreel to ta sama scena zbliżona i przyspieszona, nie osobny canvas. Biały blok Projektów odwraca uInk. Reduced motion: scena nie startuje, w jej miejscu statyczny SVG splotu i CSS-chrome; wszystkie wejścia tekstu natychmiastowe; akordeony i FAQ bez animacji wysokości."
  }
}
```

## 7. Ryzyka i jak je gasimy

| Ryzyko | Odpowiedź |
|---|---|
| Three.js + GSAP + Lenis obciążą LCP | Scena ładowana dynamicznie po pierwszym malowaniu; hero renderuje się jako czysty DOM + CSS-chrome, kropla WebGL wjeżdża crossfadem. Cel: Lighthouse perf ≥ 90 desktop. |
| Słabe GPU / mobile | Budżet nici skalowany od `devicePixelRatio` i `hardwareConcurrency`; pomiar 1 s FPS po starcie, poniżej 40 fps redukcja nici o połowę, poniżej 25 fps przełączenie na fallback statyczny. |
| Reduced motion | Cała choreografia za `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; wariant reduce: wszystko widoczne od razu, bez pinów, bez sceny. |
| Polskie znaki | Fonty self-hosted z subsetami latin + latin-ext (@fontsource), test wizualny "Zażółć gęślą jaźń" w każdym kroju i wadze. |
| Puste treści (klienci, metryki) | Wszystko w `docs/placeholders.md`, w UI oznaczone `data-placeholder`, w tekstach neutralne (bez wymyślonych nazw firm poza kandydatami z briefu). |
