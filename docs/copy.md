# Nest Studio: teksty (PL główny, EN pod `/en`)

> Etap 3 wg CLAUDE.md. Najpierw tu, potem w `src/content/pl.ts` i `src/content/en.ts`. Zasady głosu: `docs/brand.md`. Zero em-dash. Zero słów zakazanych. Placeholdery oznaczone `[PH]` i opisane w `docs/placeholders.md`.
>
> **Osoba gramatyczna:** studio mówi "my" (tak mówią pracownie i tak brzmi zaproszenie do wspólnej roboty). Sekcja "Studio" mówi "ja", bo za Nest Studio stoi jedna osoba i nie udajemy korporacji. Konsekwentnie: "my" wszędzie poza tą sekcją.
>
> **Eyebrow (mono labelki) tylko w czterech miejscach:** hero, showreel, usługi, kontakt. Reszta sekcji niesie się nagłówkiem.

## 0. Meta

| | PL | EN |
|---|---|---|
| title | Nest Studio: branding, strony www i automatyzacje AI | Nest Studio: branding, websites and AI automation |
| description | Studio projektowe Filipa Jakubiaka, od 2014. Strategia marki, identyfikacja, strony www i automatyzacje AI w jednej pracowni. | Filip Jakubiak's design studio, since 2014. Brand strategy, identity, websites and AI automation in one workshop. |
| og:title | Wyglądaj na tyle, ile jesteś wart. | Look like what you are worth. |

## 1. Preloader

| PL | EN |
|---|---|
| licznik: `2014` → `{rok bieżący}` (mono) | same |
| pod licznikiem: `Nest Studio` | same |
| dostępność: `aria-label="Ładowanie strony"`, `aria-busy` | `Loading` |

## 2. Nawigacja

| Element | PL | EN |
|---|---|---|
| wordmark | Nest Studio | Nest Studio |
| linki (overlay) | Projekty · Usługi · Proces · Studio · Kontakt | Work · Services · Process · Studio · Contact |
| CTA | Rozpocznij projekt | Start a project |
| przełącznik | PL / EN (`aria-label="Zmień język"`) | PL / EN (`aria-label="Change language"`) |
| menu | `aria-label="Menu"` / `"Zamknij menu"` | `Menu` / `Close menu` |
| overlay, stopka menu | mail `[PH]`, "Zdalnie, z Polski" | email `[PH]`, "Remote, from Poland" |

## 3. Hero

| Element | PL | EN |
|---|---|---|
| eyebrow (1/4) | Studio projektowe, od 2014 | Design studio, since 2014 |
| h1 (3 linie, kropla chromu po słowie "wyglądają" / "look") | Projektujemy marki, / które wyglądają / na tyle, ile są warte. | We design brands / that look like / what they are worth. |
| lead (≤ 20 słów) | Strategia, identyfikacja, strona i automatyzacje AI. Jedna pracownia, jedna struktura. | Strategy, identity, website and AI automation. One workshop, one structure. |
| CTA primary | Rozpocznij projekt | Start a project |
| CTA ghost | Zobacz projekty | See the work |

Uwaga do h1: 6 słów w wersie maksymalnie; na telefonie łamanie zostaje takie samo, rozmiar schodzi do `--t-h1`.

## 4. Napięcie (split stage)

| Element | PL | EN |
|---|---|---|
| h2 | Większość firm wygląda słabiej, niż jest. | Most companies look weaker than they are. |
| lewa kolumna, labelka | jak wyglądasz | how you look |
| lewa kolumna, słowo (znaki rozsypane) | Widoczność | Visibility |
| prawa kolumna, labelka | ile jesteś wart | what you are worth |
| prawa kolumna, słowo (znaki stałe) | Wartość | Worth |
| zdanie "ty" (jedyne w drugiej osobie poza CTA) | Twoja pewnie też. Tę lukę da się domknąć. | Yours probably does too. That gap can be closed. |
| akapit | Luka między tym, jak firma wygląda, a tym, ile jest warta, kosztuje: zaufanie, ceny, czas rozmów. Domykamy ją strategią, identyfikacją, stroną i maszynownią, która robi robotę za ciebie. | The gap between how a company looks and what it is worth has a price: trust, pricing power, time spent explaining. We close it with strategy, identity, a website and an engine room that does the work for you. |
| stan końcowy (po domknięciu, obie kolumny) | Nie egzekucja. Nie osobne usługi. Jedna struktura. | Not execution. Not separate services. One structure. |

## 5. Showreel (peak)

| Element | PL | EN |
|---|---|---|
| eyebrow (2/4) | Showreel, renderowany na żywo | Showreel, rendered live |
| h2 (przed wejściem w pin) | To nie jest film. | This is not a video. |
| lead | Ten reel renderuje się na żywo z tej samej sceny, na której stoi strona. Scroll jest jego suwakiem. | This reel renders live from the same scene the site stands on. Your scroll is the scrubber. |
| cięcia (labelki w playerze, bez numerów) | Typografia · Chrom · Nici · Web · Automatyzacje | Type · Chrome · Threads · Web · Automation |
| teksty cięć (po jednym zdaniu, wchodzą w głąb) | Typografia gra rolę obrazu. / Metal, który się nie zatrzymuje. / Tysiące nici. Jeden splot. / Strony, które są dowodem. / Maszynownia, którą widać. | Type does the work of an image. / Metal that never settles. / Thousands of threads. One weave. / Websites that are the proof. / An engine room you can see. |
| player | `00:00:00` mono, Odtwórz / Zatrzymaj, `aria-label="Odtwórz showreel"` | `Play` / `Pause`, `aria-label="Play showreel"` |
| gdy jest film [PH] | labelki metadanych z pliku: czas, rozdzielczość | same |

## 6. Wybrane projekty (biały blok)

| Element | PL | EN |
|---|---|---|
| h2 | Wybrane projekty | Selected work |
| lead | Metryka na pierwszym planie. Pełne case study na życzenie. | The metric first. Full case study on request. |
| link | Poproś o pełne case study | Ask for the full case study |

Arkusze (struktura; dane `[PH]` do akceptacji Filipa, patrz D12):

| Pole | Projekt 1 | Projekt 2 | Projekt 3 |
|---|---|---|---|
| nazwa | Perun Tac [PH] | TCC Global [PH] | Oboda Group [PH] |
| zakres (chipy) | Branding · Strona · CMS | Strona | Redesign |
| metryka (mono, duża) | metryka do uzupełnienia [PH] | metryka do uzupełnienia [PH] | metryka do uzupełnienia [PH] |
| opis metryki | np. "wzrost zapytań w 3 miesiące" [PH] | [PH] | [PH] |
| rok | [PH] | [PH] | [PH] |
| jedno zdanie | Identyfikacja, strona i CMS dla marki wyposażenia taktycznego. [PH do potwierdzenia] | Strona dla firmy szkoleniowo-doradczej. [PH do potwierdzenia] | Redesign strony grupy. [PH do potwierdzenia] |
| EN nazwa/opis | same names; "Identity, website and CMS for a tactical equipment brand." / "Website for a training and consulting company." / "Group website redesign." | | |

## 7. Usługi (akordeon poziomy)

| Element | PL | EN |
|---|---|---|
| eyebrow (3/4) | Usługi | Services |
| h2 | Cztery nici. Jedna struktura. | Four threads. One structure. |

| Pasmo | PL tytuł | PL opis | EN tytuł | EN opis |
|---|---|---|---|---|
| 1 | Strategia marki | Pozycjonowanie, komunikacja, architektura marki. Zanim cokolwiek narysujemy, wiemy, po co i dla kogo. | Brand strategy | Positioning, messaging, brand architecture. Before we draw anything, we know why and for whom. |
| 2 | Branding | Znak, typografia, kolor, zasady i pliki. System, którego twój zespół użyje od pierwszego dnia. | Branding | Mark, typography, colour, rules and files. A system your team can use from day one. |
| 3 | Strony www | Projekt i kod. Szybkie, dostępne, z ruchem, który coś znaczy. Taka jak ta. | Websites | Design and code. Fast, accessible, with motion that means something. Like this one. |
| 4 | AI i automatyzacje | Wdrożenia AI i automatyzacje procesów: zapytania, oferty, faktury, obsługa. Maszynownia, którą widać w działaniu. | AI and automation | AI deployments and process automation: inquiries, proposals, invoices, support. An engine room you can watch working. |

Lista pod pasmami (mono, drobna): "Możesz wziąć jedną nić. Najlepiej działają splecione." / "You can take one thread. They work best woven together."

## 8. AI demo (żywa powierzchnia)

| Element | PL | EN |
|---|---|---|
| h2 | Automatyzacja, którą widać. | Automation you can see. |
| lead | Wybierz proces, który dziś robisz ręcznie. Przepływ złoży się sam. | Pick a process you do by hand today. The flow assembles itself. |
| presety (chipy) | Zapytanie z formularza · Nowa faktura · Oferta dla klienta · Wpis do social mediów | Form inquiry · New invoice · Client proposal · Social media post |
| przycisk | Uruchom przepływ | Run the flow |
| status | Gotowe · Pracuje · Zakończone | Ready · Running · Done |
| adnotacja (mono) | Demo działa na przykładowych danych. We wdrożeniu łączymy przepływ z twoimi narzędziami. | Demo runs on sample data. In deployment we connect the flow to your tools. |

Słownik węzłów (etykiety w interfejsie): Wyzwalacz, Odczyt, Klasyfikacja, Wersja robocza, Sprawdzenie, CRM, E-mail, Dokument, Kalendarz, Powiadomienie / Trigger, Read, Classify, Draft, Review, CRM, Email, Document, Calendar, Notify.

Przepływy (log, po jednej linii na krok):

| Preset | Kroki PL | Kroki EN |
|---|---|---|
| Zapytanie z formularza | Nowe zgłoszenie z formularza / Klasyfikacja: oferta, wsparcie, spam / Wpis do CRM z podsumowaniem / Wersja robocza odpowiedzi w twoim tonie / Powiadomienie z jednym przyciskiem: wyślij | New form submission / Classify: sales, support, spam / CRM entry with summary / Reply draft in your tone / Notification with one button: send |
| Nowa faktura | Faktura z e-maila lub skrzynki / Odczyt danych: kontrahent, kwota, termin / Dopasowanie do zamówienia / Wpis do księgowości / Przypomnienie przed terminem | Invoice from email or inbox / Read the data: vendor, amount, due date / Match to purchase order / Post to accounting / Reminder before due date |
| Oferta dla klienta | Notatka ze spotkania / Wyciągnięcie zakresu i założeń / Wersja robocza oferty z twojego szablonu / Sprawdzenie cen i terminów / Dokument do twojej akceptacji | Meeting notes / Extract scope and assumptions / Proposal draft from your template / Check pricing and dates / Document for your approval |
| Wpis do social mediów | Nowy projekt w portfolio / Trzy wersje wpisu w tonie marki / Dobór grafiki z systemu / Kolejka publikacji / Raport po tygodniu | New project in the portfolio / Three post drafts in the brand voice / Visual picked from the system / Publishing queue / Report after a week |

## 9. Proces (nić przez pięć stacji)

| Element | PL | EN |
|---|---|---|
| h2 | Jak to wygląda | How it works |

| Stacja | PL tytuł | PL opis | EN tytuł | EN opis |
|---|---|---|---|---|
| Rozmowa | Rozmowa | Godzina o tym, co robisz, dla kogo i co dziś robisz ręcznie. Po niej dostajesz zakres i wycenę. | Conversation | An hour on what you do, for whom, and what you still do by hand. You get a scope and a quote after it. |
| Strategia | Strategia | Pozycjonowanie, komunikacja, architektura. Krótki dokument, który potem trzyma wszystko w ryzach. | Strategy | Positioning, messaging, architecture. A short document that keeps everything in line later. |
| Projekt | Projekt | Identyfikacja i projekt strony. Pokazujemy kierunki, wybieramy jeden, dopracowujemy. | Design | Identity and website design. We show directions, pick one, refine it. |
| Budowa | Budowa | Kod, treści, wdrożenie. Szybko, dostępnie, z ruchem, który coś znaczy. | Build | Code, content, launch. Fast, accessible, with motion that means something. |
| Maszynownia | Maszynownia | Automatyzacje i AI podpięte do twoich narzędzi. Uruchamiamy, uczymy zespół, zostajemy na wsparcie. | Engine room | Automation and AI wired into your tools. We launch, train the team, stay for support. |

## 10. Studio (o Filipie, pierwsza osoba)

| Element | PL | EN |
|---|---|---|
| h2 | Za studiem stoi Filip Jakubiak. | Behind the studio is Filip Jakubiak. |
| akapit 1 | Projektuję od 2014. Zaczynałem od identyfikacji, potem doszły strony, a od kilku lat automatyzacje i AI, bo marka bez maszynowni to tylko obrazek. | I have been designing since 2014. I started with identity, then came websites, and for the last few years automation and AI, because a brand without an engine room is just a picture. |
| akapit 2 | Pracuję sam albo z małym zespołem dobranym do projektu. Rozmawiasz ze mną, nie z opiekunem klienta. | I work alone or with a small team picked for the project. You talk to me, not to an account manager. |
| liczby (mono, liczone) | {lata} lat w branży · od 2014 | {years} years in the field · since 2014 |
| zdjęcie | portret [PH], alt: "Filip Jakubiak, Nest Studio" | same |

## 11. FAQ

| # | PL pytanie | PL odpowiedź | EN pytanie | EN odpowiedź |
|---|---|---|---|---|
| 1 | Ile kosztuje projekt? | Zależy od zakresu. Identyfikacja, strona i automatyzacje to trzy różne budżety, ale jedna wycena po rozmowie. Wyceniamy zakres, nie godziny. | How much does a project cost? | It depends on the scope. Identity, a website and automation are three different budgets, but one quote after the first call. We price the scope, not the hours. |
| 2 | Ile to trwa? | Identyfikacja zwykle tygodnie, strona od kilku tygodni do kilku miesięcy, automatyzacje często dni. Harmonogram ustalamy przed startem i go trzymamy. | How long does it take? | Identity usually takes weeks, a website from a few weeks to a few months, automation often days. We agree the schedule before we start and we keep it. |
| 3 | Mogę zamówić tylko stronę albo tylko automatyzację? | Tak. Każda nić działa osobno. Najlepiej działają splecione, więc zawsze powiemy, co warto dołożyć, i uszanujemy, jeśli nie teraz. | Can I order just the website or just the automation? | Yes. Each thread works on its own. They work best woven together, so we will say what is worth adding, and respect a "not now". |
| 4 | Jak wygląda praca z AI w praktyce? | Zaczynamy od procesu, który robisz ręcznie. Budujemy przepływ na twoich narzędziach, testujemy na prawdziwych danych, uczymy zespół. AI robi robotę, człowiek akceptuje. | What does working with AI look like in practice? | We start with a process you do by hand. We build the flow on your tools, test it on real data, train the team. AI does the work, a person approves. |
| 5 | Co dostaję na koniec? | Pliki źródłowe, system marki, kod strony, dostępy, dokumentację przepływów i instrukcje. Wszystko jest twoje. | What do I get at the end? | Source files, the brand system, the website code, access, flow documentation and instructions. All of it is yours. |
| 6 | Czy moja strona będzie tak animowana jak ta? | Jeśli to służy marce. Ruch to narzędzie, nie ozdoba. Ta strona jest showreelem, twoja ma sprzedawać. | Will my website be as animated as this one? | If it serves the brand. Motion is a tool, not decoration. This site is a showreel, yours has to sell. |
| 7 | Gdzie pracujecie? | Zdalnie, z Polski, po polsku i po angielsku. Spotkania online, w razie potrzeby na miejscu. | Where do you work from? | Remotely, from Poland, in Polish and English. Meetings online, on site when needed. |

## 12. Kontakt (finał)

| Element | PL | EN |
|---|---|---|
| eyebrow (4/4) | Kontakt | Contact |
| h2 | Zbudujmy gniazdo dla twojej marki. | Let's build a nest for your brand. |
| lead | Jedna rozmowa, bez prezentacji i bez zobowiązań. Opowiedz, co robisz ręcznie i jak chcesz wyglądać. | One conversation, no deck, no strings. Tell us what you do by hand and how you want to look. |
| CTA primary (jedyne CTA "kontakt" na stronie, ta sama etykieta co w nav i hero) | Rozpocznij projekt | Start a project |
| link mailowy (tekst, nie przycisk) | hello@neststudio.pl [PH] | same |
| link kalendarza (tekst, ukryty do czasu podania linku) | albo wybierz termin w kalendarzu [PH] | or pick a time in the calendar [PH] |

## 13. Stopka

| Element | PL | EN |
|---|---|---|
| wordmark w wielkiej skali | Nest Studio | Nest Studio |
| kolumna Kontakt | hello@neststudio.pl [PH] · +48 000 000 000 [PH] | same |
| kolumna Dane | Nest Studio Filip Jakubiak [PH] · NIP 000-000-00-00 [PH] · Polska | same, "Poland" |
| kolumna Social | Instagram [PH] · LinkedIn [PH] · Behance [PH] | same |
| nagłówek | Zapytaj o Nest Studio | Ask about Nest Studio |
| przyciski | Claude · ChatGPT · Perplexity | same |
| prompt w linkach | Co wiesz o Nest Studio, studiu projektowym Filipa Jakubiaka (neststudio.pl)? Czym się zajmuje i co wyróżnia? | What do you know about Nest Studio, Filip Jakubiak's design studio (neststudio.pl)? What does it do and what makes it different? |
| dolna linia | © {rok} Nest Studio. Zaprojektowane i zbudowane w Nest Studio. | © {year} Nest Studio. Designed and built at Nest Studio. |
| link | Polityka prywatności [PH, gdy powstanie] | Privacy policy [PH] |

## 14. Teksty systemowe

| Klucz | PL | EN |
|---|---|---|
| skip link | Przejdź do treści | Skip to content |
| rail, aria | Nawigacja po sekcjach | Section navigation |
| reduced motion, informacja (tylko dla czytników) | Animacje wyłączone zgodnie z ustawieniami systemu. | Animations disabled according to your system settings. |
| brak WebGL, informacja | Scena 3D niedostępna w tej przeglądarce. Treść działa bez niej. | 3D scene unavailable in this browser. The content works without it. |
| 404 | Tej strony nie ma. Wróć na stronę główną. | This page does not exist. Go back home. |

## 15. Autoaudyt tekstów (przed wdrożeniem)

- [x] Zero em-dash, zero en-dash.
- [x] Zero słów zakazanych (innowacyjny, kompleksowy, dedykowany, pasja, elevate, seamless...).
- [x] Jedna etykieta na intencję "kontakt": "Rozpocznij projekt" (nav, hero, finał).
- [x] Jedna etykieta na intencję "portfolio": "Zobacz projekty" (hero) i nagłówek "Wybrane projekty".
- [x] Eyebrow: 4 na 12 sekcji.
- [x] Hero: h1 3 linie po ≤ 4 słowa, lead 11 słów, dwa CTA.
- [x] Cytaty/opinie: brak (nie mamy prawdziwych; nie wymyślamy).
- [x] Liczby: tylko 2014 i lata liczone z daty; metryki projektów to placeholdery.
