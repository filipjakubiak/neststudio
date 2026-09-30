# Nest Studio v2: struktura, siatka, spoiwo

> Szkielet przebudowy (30.09.2026). Teksty dojdą od Filipa; ten dokument ustala kolejność, rolę każdej sekcji, układ na siatce, obiekt renderowany dla sekcji i listę faktów do zebrania.

## 1. Idea spinająca

Zostaje myśl „splecione trzyma, luźne się rwie”, ale zmienia się jej nośnik: zamiast jednej sceny WebGL pod całą stroną **każda sekcja ma własny, wyrenderowany obiekt** w jednym języku renderu (referencja: bento z obiektami 3D, 30.09, analiza w rozmowie):

- **Światłem jest sam obiekt.** Czarna pustka (Noir), zero otoczenia; bryły oświetla świecąca nić, reszta bryły gaśnie w cieniu.
- **Jedna rodzina materiałów:** matowa ceramika (grafit), satynowy metal, świecąca nić (rampa: rdzeń Bone → ciepły Rim Warm → gaśnie w ciemnym bursztynie), siatka punktów z głębią ostrości.
- **Jeden ruch na obiekt**, powolny, pętla bez szwu (4 s).
- **Nić przechodzi przez stronę:** ta sama świecąca kometa, która w hero oplata splot, pojawia się w każdym obiekcie. Użytkownik widzi jedną nić przeciągniętą przez studio.

## 2. Kolejność i rola sekcji

| # | Sekcja | Zadanie (co ma zrobić w głowie klienta) | Układ | Obiekt |
|---|---|---|---|---|
| 1 | **Hero** | w 3 s: kim jesteśmy, co robimy, dla kogo | tekst 5/12 lewo, obiekt 7/12 prawo, 100svh; CTA + drugorzędny link do portfolio | **Splot**: trzy nici oplatające matową płytę (look-dev nr 1) |
| 2 | **Stats & facts** | wiarygodność liczbami | bento 4 kafle (2×2 desktop, 1 kolumna mobile), liczby count-up | mały: siatka punktów, która „liczy” (fala jasności) |
| 3 | **Who we are** | jedno zdanie manifestu | duży tekst na 8/12, dużo powietrza | pojedyncza nić, rozciągnięta przez całą szerokość |
| 4 | **Portfolio** | dowód: realne projekty | blok jasny (odwrócone role), karty case study, sticky stack | brak: tu mówią realne zrzuty projektów |
| 5 | **What we do** | cztery usługi, każda z własnym znakiem | bento: 1 duży kafel + 3 mniejsze, jak w referencji | 4 mini-obiekty: Strategia (skaner), Branding (znak N z nici), Strony (płyta z punktów → layout), AI (kostka punktów z impulsem) |
| 6 | **About us + Why choose us** | historia + powody wyboru | split: historia 6/12 lewo, 4 do 6 powodów w kaflach prawo | kostka: blat pełen detalu, boki niedomknięte (firma urosła, wizerunek nie) |
| 7 | **Testimonials** | głos klientów | jeden duży cytat naraz, przełączanie, logo firmy | brak lub subtelna nić jako cudzysłów |
| 8 | **Meet the team** | twarze | portrety w siatce 3 do 4, podpis mono | brak: zdjęcia |
| 9 | **Process** | jak pracujemy, bez niespodzianek | pin, 5 stacji poziomo | jedna kometa przechodzi przez 5 małych brył, stacja zapala się po kolei |
| 10 | **Pricing** | orientacja w budżecie | 3 pakiety w kaflach + „wycena indywidualna” | brak (kafle z hairline) |
| 11 | **Partners & clients** | kto nam zaufał | ściana logotypów monochromatycznie, marquee na mobile | brak |
| 12 | **CTA** | decyzja | pełna szerokość, pin krótki | **Gniazdo**: nici zapalają się jedna po drugiej, finał serii |
| 13 | **Get in touch** | kontakt bez tarcia | formularz lub mailto lewo, dane kontaktowe prawo | brak |
| 14 | **Stopka** | nawigacja, prawne, social | jak dziś (wordmark scrub) | brak |

Uwaga do rytmu: 14 sekcji to długa strona. Obiekty są w sekcjach 1, 2, 3, 5, 6, 9 i 12, między nimi sekcje „ludzkie” (zdjęcia, cytaty, logotypy). Dzięki temu rytm naprzemienny render / człowiek nie męczy. CTA (12) i Get in touch (13) mogą być jedną sekwencją: obiekt gniazda przechodzi w formularz.

## 3. Siatka i system

- Zostaje: siatka 12 kolumn, `--max-grid: 1440px`, `--gutter`, baza 4 px, Space Grotesk + Space Mono (referencja używa tej samej pary: sans do nagłówków, mono do opisów).
- **Zmiana względem DESIGN.md v1:** v1 zakazywał kart. W v2 wchodzą **kafle bento**: tło Noir, hairline 1 px (`--ink-faint`), promień 4 px, obiekt wyrenderowany w kaflu, tekst na bezpiecznym polu. Do aktualizacji w DESIGN.md po akceptacji look-devu.
- **Zmiana:** zakaz glow w UI zostaje. Świecenie istnieje tylko w wyrenderowanych obiektach (to światło na materiale, nie efekt CSS).
- Obiekty na stronie: pętla wideo (WebM VP9 + MP4 H.264, plakat AVIF), ładowana leniwie, gra tylko w widoku, `prefers-reduced-motion` = plakat. Budżet ok. 300 do 600 kB na pętlę desktop, połowa na mobile.
- Obecna scena Three.js i chrom z Remotion: do decyzji, czy zostają (np. chrom jako kursor/przewodnik), czy odchodzą na rzecz obiektów. Rekomendacja: odchodzą (wydajność, jeden język wizualny).

## 4. Fakty do zebrania od Filipa

Sekcje, które bez prawdziwych danych nie mogą ruszyć:

- **Stats:** rok założenia (2014?), liczba projektów, liczba klientów, branże, kraje, może jedna liczba efektu (np. „x godzin oszczędzonych automatyzacjami”).
- **Portfolio:** które projekty pokazujemy (Perun Tac, TCC Global, Oboda Group, inne?), zgody klientów, 1 do 2 zdania + wynik na projekt.
- **Testimonials:** 2 do 4 cytatów z imieniem, stanowiskiem, firmą (za zgodą).
- **Team:** kto jest w zespole, role, zdjęcia (jeden styl zdjęć dla wszystkich).
- **Pricing:** czy pokazujemy kwoty („od X zł”), jakie pakiety, co w nich jest.
- **Partners & clients:** lista logotypów w wersji wektorowej.
- **Get in touch:** e-mail, telefon, adres/NIP, Cal.com czy formularz.
- **Why choose us:** 4 do 6 powodów, najlepiej z dowodem (liczba, przykład).

## 5. Kolejność prac

1. **Look-dev obiektu „Splot” (hero).** Ustala materiały, rampę światła, bloom, głębię ostrości, pętlę. Akceptacja Filipa. ← teraz
2. Aktualizacja DESIGN.md (kafle bento, obiekty) + szkielet nowych sekcji na placeholderach.
3. Kolejne obiekty z tej samej biblioteki materiałów, sekcja po sekcji.
4. Teksty od Filipa → wstawienie → weryfikacja (GPU, telefon, Lighthouse).
