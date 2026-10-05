/*
 * Teksty PL, 1:1 z dokumentu strategii (docs/v2/source/copywriting-strategia.html).
 * Od 05.10 (Filip): wyłącznie teksty z dokumentu, z jego interpunkcją, nic dopisanego.
 * [nawiasy] = dane do podmiany, jak w dokumencie (docs/placeholders.md).
 */
import type { Content } from './types';
import { polishTypography } from './typography';


const raw: Content = {
  lang: 'pl',
  paths: {
    home: '/',
    work: '/realizacje/',
    studio: '/studio/',
    contact: '/kontakt/',
    branding: '/uslugi/branding/',
    web: '/uslugi/strony-internetowe/',
    graphic: '/uslugi/projektowanie-graficzne/',
    automation: '/uslugi/automatyzacje/',
    ai: '/uslugi/rozwiazania-ai/',
  },
  system: {
    skip: 'Przejdź do treści',
    navLabel: 'Nawigacja główna',
    langLabel: 'Język',
    menu: 'Menu',
    close: 'Zamknij',
    motionPause: 'Zatrzymaj ruch',
    motionPlay: 'Włącz ruch',
    placeholder: 'Do uzupełnienia',
    notFound: 'Tej strony tu nie ma.',
    backHome: 'Wróć na stronę główną',
    exampleLabel: 'Przykład pracy',
    proofLabel: 'Opinie klientów',
  },

  /* 3.1 Nawigacja */
  nav: {
    links: [
      { label: 'Realizacje', page: 'work' },
      { label: 'Usługi', page: 'home', hash: 'uslugi' },
      { label: 'Studio', page: 'studio' },
    ],
    cta: 'Porozmawiajmy o projekcie',
  },

  home: {
    meta: {
      title: 'Nest Studio: studio brandingu, stron internetowych i technologii',
      description: 'Tworzymy marki, strony internetowe i materiały graficzne. Łączymy design z automatyzacjami i AI. Poznaj Nest Studio i nasze realizacje.',
    },
    /* 3.2 Hero */
    hero: {
      eyebrow: 'Studio brandingu i technologii',
      title: ['Wyrazista marka.', 'Sprawniejsze działanie.'],
      lead: 'Projektujemy identyfikacje wizualne, strony internetowe i materiały, po których widać, kim jest firma. Łączymy je z automatyzacjami i AI, żeby dobry projekt pomagał też w codziennej pracy.',
      ctaPrimary: 'Porozmawiajmy o projekcie',
      ctaSecondary: 'Zobacz realizacje',
      micro: 'Masz konkretny brief albo dopiero szukasz kierunku? Możemy zacząć od obu.',
    },
    /* 3.3 Wybrane realizacje */
    work: {
      eyebrow: 'Wybrane realizacje',
      title: ['Najpierw zobacz,', 'jak projektujemy.'],
      lead: 'Zobacz, jak potrzeby firmy zamieniamy w identyfikację, stronę i narzędzia, z których korzysta się na co dzień.',
      cardLink: 'Zobacz projekt',
      all: 'Wszystkie realizacje',
    },
    /* 3.3 Miejsce na dowód: tylko prawdziwe opinie za zgodą (do tego czasu nawiasy z dokumentu) */
    proof: {
      items: [
        { quote: '[Autentyczna wypowiedź klienta opisująca konkretną zmianę lub doświadczenie współpracy]', name: '[Imię i nazwisko]', role: '[Stanowisko, firma]' },
        { quote: '[Autentyczna wypowiedź klienta opisująca konkretną zmianę lub doświadczenie współpracy]', name: '[Imię i nazwisko]', role: '[Stanowisko, firma]' },
        { quote: '[Autentyczna wypowiedź klienta opisująca konkretną zmianę lub doświadczenie współpracy]', name: '[Imię i nazwisko]', role: '[Stanowisko, firma]' },
      ],
    },
    /* 3.4 Sekcja łącząca ofertę */
    direction: {
      eyebrow: 'Jeden kierunek',
      title: ['To, co widać.', 'I to, co dzieje się dalej.'],
      body: [
        'Klient poznaje Twoją markę, odwiedza stronę i wysyła zapytanie. Potem zaczyna się praca zespołu: odpowiedzi, przekazywanie informacji, przygotowanie oferty.',
        'Projektujemy te elementy z myślą o całości. Żeby komunikacja była spójna, strona prowadziła do właściwego działania, a proces nie kończył się na kliknięciu „Wyślij”.',
      ],
      items: [
        { n: '01', title: 'Rozpoznawalność', body: 'Jasny kierunek marki i identyfikacja, która go wyraża.' },
        { n: '02', title: 'Doświadczenie', body: 'Strona, na której łatwo zrozumieć ofertę i zrobić następny krok.' },
        { n: '03', title: 'Sprawność', body: 'Połączone narzędzia i mniej ręcznego przekazywania informacji.' },
      ],
    },
    /* 3.5 Usługi (karty w `services`) */
    services: {
      eyebrow: 'Co robimy',
      title: ['Od kierunku marki', 'do działającego rozwiązania.'],
      lead: 'Możemy zająć się jednym obszarem albo połączyć kilka w jeden projekt. Zakres dobieramy do tego, co naprawdę wymaga zmiany.',
    },
    /* 3.6 Sposób współpracy */
    process: {
      eyebrow: 'Jak pracujemy',
      title: ['Jasny kierunek.', 'Przemyślane decyzje.'],
      intro: 'Wiesz, nad czym pracujemy, co wymaga Twojej decyzji i co wydarzy się dalej.',
      outcomeLabel: 'Efekt etapu',
      steps: [
        { title: 'Zrozumienie', body: 'Zaczynamy od firmy, odbiorców i celu projektu. Sprawdzamy, co już działa, co przeszkadza i jaki efekt będzie oznaczał dobrze wykonaną pracę.', outcome: 'Uzgodniony cel, priorytety i zakres.' },
        { title: 'Kierunek', body: 'Układamy strukturę rozwiązania. W zależności od projektu: strategię marki, architekturę strony lub mapę procesu. Ustalamy fundamenty, zanim przejdziemy do szczegółów.', outcome: 'Zaakceptowany kierunek i plan realizacji.' },
        { title: 'Projekt i wdrożenie', body: 'Projektujemy, pokazujemy kolejne etapy i zbieramy feedback. Następnie wdrażamy rozwiązanie i sprawdzamy je w uzgodnionych scenariuszach użycia.', outcome: 'Gotowe i przetestowane rozwiązanie.' },
        { title: 'Przekazanie i rozwój', body: 'Przekazujemy materiały, dostęp i instrukcje objęte zakresem. Ustalamy, co warto obserwować po uruchomieniu i jak może wyglądać dalsze wsparcie.', outcome: 'Jasny sposób korzystania z rozwiązania i plan kolejnych kroków.' },
      ],
    },
    /* 3.7 Krótko o studiu */
    studio: {
      eyebrow: 'Studio',
      title: ['Myślimy całościowo.', 'Dopracowujemy szczegóły.'],
      body: [
        'Nest Studio to studio łączące branding, projektowanie cyfrowe i technologię.',
        'Dzień prezentacji to dopiero początek. Sprawdzamy, jak projekt działa po wdrożeniu: czy marka pozostaje spójna, czy stronę można rozwijać i czy zespół umie korzystać z nowych narzędzi.',
      ],
      link: 'Poznaj studio',
      photoAlt: '[Prawdziwe zdjęcie zespołu lub osób prowadzących studio, podpisane nazwiskami i rolami]',
    },
    /* 3.8 FAQ */
    faq: {
      title: 'Zanim zaczniemy.',
      items: [
        { q: 'Czy muszę wiedzieć dokładnie, czego potrzebuję?', a: 'Nie. Możesz przyjść z gotowym briefem albo opisać sytuację, którą chcesz zmienić. Na początku ustalimy, czy potrzebujesz nowej identyfikacji, strony, uporządkowania procesu czy połączenia kilku działań.' },
        { q: 'Czy mogę zamówić tylko jedną usługę?', a: 'Tak. Możemy zaprojektować samą stronę, rozwinąć istniejącą identyfikację albo zautomatyzować wybrany proces. Nie każdy projekt wymaga zmiany wszystkiego.' },
        { q: 'Ile kosztuje współpraca?', a: 'Wycenę przygotowujemy po ustaleniu celu i zakresu. Znaczenie mają między innymi liczba materiałów lub widoków, poziom złożoności, integracje i zakres wdrożenia. Przed rozpoczęciem otrzymujesz opis prac i koszt realizacji.' },
        { q: 'Jak długo trwa projekt?', a: 'Harmonogram zależy od zakresu, dostępności materiałów i liczby etapów decyzyjnych. Termin ustalamy przed rozpoczęciem, z uwzględnieniem czasu na feedback, testy i przygotowanie do publikacji.' },
        { q: 'Czy pracujecie z istniejącą identyfikacją lub stroną?', a: 'Tak. Najpierw sprawdzamy, co warto zachować. Możemy rozwinąć obecny system, uporządkować wybrane elementy albo zaproponować większą zmianę, jeśli będzie uzasadniona.' },
        { q: 'Co otrzymam po zakończeniu?', a: 'Materiały i dostęp określone w zakresie projektu. W zależności od usługi mogą to być pliki identyfikacji, wytyczne, szablony, wdrożona strona, dokumentacja integracji i instrukcja obsługi. Warunki praw, licencji i przekazania ustalamy przed rozpoczęciem.' },
        { q: 'Czy każde usprawnienie wymaga AI?', a: 'Nie. Najpierw przyglądamy się zadaniu. Jeśli wystarczy prostsza integracja lub automatyzacja oparta na regułach, proponujemy właśnie takie rozwiązanie.' },
        { q: 'Czy możecie wspierać nas po wdrożeniu?', a: 'Możemy ustalić osobny zakres dalszego rozwoju, aktualizacji lub wsparcia. Jego warunki zależą od rozwiązania i potrzeb zespołu.' },
      ],
    },
    /* 3.9 Końcowe CTA */
    cta: {
      title: ['Co chcesz zmienić', 'w swojej firmie?'],
      body: 'Wizerunek, stronę, sposób pracy, a może kilka rzeczy naraz? Opowiedz nam, gdzie jesteś i czego potrzebujesz. Od tego zaczniemy.',
      button: 'Porozmawiajmy o projekcie',
      mailPrefix: 'Wolisz mail? Napisz na',
    },
  },

  /* 3.5 karty + 4.x podstrony usług */
  services: [
    {
      id: 'branding',
      name: 'Branding',
      object: 'skaner',
      meta: { title: 'Branding i identyfikacja wizualna | Nest Studio', description: 'Strategia, identyfikacja wizualna i spójny system marki. Zobacz, jak Nest Studio przekłada charakter firmy na przemyślany design.' },
      card: { title: 'Marka z własnym charakterem.', body: 'Porządkujemy to, co chcesz powiedzieć, komu i dlaczego warto Cię wybrać. Przekładamy ten kierunek na identyfikację wizualną i zasady, z których można korzystać na co dzień.', scope: ['Strategia marki', 'Identyfikacja wizualna', 'System marki', 'Wytyczne'], link: 'Poznaj branding' },
      page: {
        title: ['Marka z charakterem.', 'Nie tylko z logo.'],
        lead: 'Pomagamy określić, co wyróżnia Twoją firmę, i nadajemy temu formę. Tworzymy identyfikacje, które działają jako system: na stronie, w prezentacji i w codziennej komunikacji.',
        blocks: [
          { label: 'Kiedy warto zacząć', title: ['Firma się zmieniła.', 'Czy marka za nią nadąża?'], body: ['Rozwijasz ofertę, docierasz do nowych odbiorców albo wchodzisz na kolejny rynek. Tymczasem identyfikacja nadal opowiada o firmie sprzed kilku lat. Pomagamy zdecydować, co zachować, co uporządkować i czemu nadać nowy kierunek.'] },
          { label: 'Co projektujemy', list: [
            { term: 'Kierunek marki', text: 'odbiorcy, pozycjonowanie, wyróżniki i główne komunikaty.' },
            { term: 'Identyfikację wizualną', text: 'znak, typografię, kolorystykę i język graficzny.' },
            { term: 'System zastosowań', text: 'układy, zasady i przykłady użycia w ważnych punktach kontaktu.' },
            { term: 'Wytyczne', text: 'uporządkowaną dokumentację dla zespołu i kolejnych wykonawców.' },
          ] },
          { label: 'Co zostaje po projekcie', body: ['Dostajesz uzgodniony zestaw materiałów i zasad. Dzięki nim kolejne formaty wyglądają jak ta sama marka, nawet jeśli robi je ktoś inny.'] },
        ],
        related: { text: 'Nowa marka potrzebuje dobrego miejsca w sieci.', link: 'Zobacz, jak projektujemy strony', to: 'web' },
      },
    },
    {
      id: 'web',
      name: 'Strony internetowe',
      object: 'kostka',
      meta: { title: 'Projektowanie i tworzenie stron internetowych | Nest Studio', description: 'Projektujemy i wdrażamy strony internetowe: struktura, treści, UX/UI, CMS i integracje. Poznaj podejście Nest Studio.' },
      card: { title: 'Strona z jasno określonym zadaniem.', body: 'Projektujemy i wdrażamy strony, na których od razu widać, co oferujesz, i wiadomo, co kliknąć dalej. Od struktury i treści po interfejs, wdrożenie oraz integracje.', scope: ['UX/UI', 'Struktura i treści', 'Development', 'CMS', 'Integracje'], link: 'Poznaj strony internetowe' },
      page: {
        title: ['Dobrze wygląda.', 'Wiadomo, co robić dalej.'],
        lead: 'Projektujemy strony, które jasno przedstawiają ofertę, pokazują wiarygodność firmy i prowadzą do kontaktu, zakupu lub innego określonego celu. Łączymy treść, UX, design i wdrożenie.',
        blocks: [
          { label: 'Punkt wyjścia', title: ['Zaczynamy od zadania.', 'Nie od układu sekcji.'], body: ['Czego szuka użytkownik? Co musi zrozumieć przed podjęciem decyzji? Jakie pytania zatrzymują go przed kontaktem? Na tych odpowiedziach budujemy strukturę strony.'] },
          { label: 'Zakres', list: [
            { term: 'Architektura i treści', text: 'kolejność informacji, podstrony i najważniejsze komunikaty.' },
            { term: 'UX/UI', text: 'ścieżki użytkownika, widoki i komponenty interfejsu.' },
            { term: 'Wdrożenie', text: 'responsywna strona oraz konfiguracja uzgodnionych funkcji.' },
            { term: 'CMS', text: 'edycja treści w obszarach ustalonych w projekcie.' },
            { term: 'Integracje', text: 'formularze, CRM i inne potrzebne narzędzia.' },
            { term: 'Przygotowanie do rozwoju', text: 'podstawy techniczne SEO i konfiguracja uzgodnionych pomiarów.' },
          ] },
          { label: 'Po uruchomieniu', body: ['Publikacja to początek pracy strony. Ustalamy, co warto mierzyć i które elementy można później rozwijać na podstawie rzeczywistych zachowań użytkowników.'] },
        ],
        related: { text: 'Co dzieje się po wysłaniu formularza?', link: 'Poznaj automatyzacje procesów', to: 'automation' },
      },
    },
    {
      id: 'graphic',
      name: 'Projektowanie graficzne',
      object: 'splot',
      meta: { title: 'Projektowanie graficzne dla firm | Nest Studio', description: 'Prezentacje, materiały sprzedażowe, kampanie i szablony. Projektowanie graficzne, które rozwija język Twojej marki.' },
      card: { title: 'Spójność w każdym formacie.', body: 'Rozwijamy język wizualny marki w prezentacjach, kampaniach, materiałach sprzedażowych i komunikacji digital. Tworzymy też szablony, z którymi Twój zespół może pracować samodzielnie.', scope: ['Prezentacje', 'Materiały sprzedażowe', 'Kampanie', 'Social media', 'Szablony'], link: 'Poznaj projektowanie graficzne' },
      page: {
        title: ['Jeden język wizualny.', 'Wiele zastosowań.'],
        lead: 'Projektujemy materiały, które rozwijają charakter marki, zamiast za każdym razem tworzyć go od nowa. Od prezentacji i ofert po kampanie oraz codzienną komunikację.',
        blocks: [
          { label: 'Punkt wyjścia', title: ['Każdy materiał osobno.', 'Wszystkie jako jedna marka.'], body: ['Prezentacja sprzedażowa, reklama i dokument dla klienta mają różne zadania. Projektujemy je tak, żeby odpowiadały na te potrzeby, a jednocześnie zachowywały wspólny język wizualny.'] },
          { label: 'Zakres', list: [
            { text: 'Prezentacje firmowe i sprzedażowe.' },
            { text: 'Oferty, raporty, katalogi i publikacje.' },
            { text: 'Główne motywy wizualne kampanii.' },
            { text: 'Materiały reklamowe i komunikacja social media.' },
            { text: 'Szablony do samodzielnej edycji.' },
            { text: 'Wybrane materiały do druku.' },
          ] },
          { label: 'Model współpracy', body: ['Możemy przygotować określony zestaw materiałów albo uzgodnić stały zakres wsparcia. W obu przypadkach ustalamy priorytety, formaty i sposób przekazywania zadań.'] },
        ],
        related: { text: 'Brakuje zasad, które połączą wszystkie materiały?', link: 'Poznaj branding', to: 'branding' },
      },
    },
    {
      id: 'automation',
      name: 'Automatyzacje procesów',
      object: 'przeplyw',
      meta: { title: 'Automatyzacje procesów i integracje | Nest Studio', description: 'Porządkujemy powtarzalne zadania i łączymy firmowe narzędzia. Poznaj automatyzacje procesów projektowane przez Nest Studio.' },
      card: { title: 'Mniej przeklejania. Więcej działania.', body: 'Łączymy narzędzia i porządkujemy powtarzalne zadania. Projektujemy przepływ informacji między formularzami, CRM, pocztą i innymi systemami używanymi w firmie.', scope: ['Analiza procesów', 'Integracje', 'Obieg informacji', 'Powiadomienia', 'Raportowanie'], link: 'Poznaj automatyzacje' },
      page: {
        title: ['Mniej ręcznych kroków.', 'Więcej porządku w pracy.'],
        lead: 'Pomagamy ograniczyć powtarzalne zadania i połączyć narzędzia, które dziś wymagają ręcznego przenoszenia danych. Zaczynamy od procesu, dopiero potem wybieramy technologię.',
        blocks: [
          { label: 'Punkt wyjścia', title: ['Co w Twojej firmie', 'trzeba ciągle robić drugi raz?'], body: ['Przepisywać zapytania. Uzupełniać kilka systemów. Przekazywać te same informacje. Przypominać o kolejnym kroku. Wspólnie sprawdzamy, które z tych czynności można uprościć i jak obsłużyć sytuacje nietypowe.'] },
          { label: 'Przykładowe zastosowania', list: [
            { text: 'Przekazywanie zapytań ze strony do CRM.' },
            { text: 'Tworzenie zadań i powiadomień dla właściwych osób.' },
            { text: 'Synchronizacja uzgodnionych danych między narzędziami.' },
            { text: 'Przygotowanie dokumentów z zatwierdzonych szablonów.' },
            { text: 'Zestawienia i cykliczne raporty.' },
          ] },
          { label: 'Jak podchodzimy do wdrożenia', body: ['Opisujemy obecny proces, wybieramy fragment do usprawnienia i testujemy rozwiązanie. Ustalamy również sposób monitorowania błędów, odpowiedzialność za utrzymanie i to, co ma się wydarzyć, gdy automatyzacja nie może wykonać zadania.'] },
          { label: 'Kryterium efektu', body: ['Przed wdrożeniem ustalamy punkt odniesienia, na przykład czas obsługi sprawy lub liczbę ręcznych kroków. Po uruchomieniu możemy sprawdzić, czy zmiana przyniosła oczekiwany rezultat.'] },
        ],
        related: { text: 'Proces wymaga pracy z treścią lub firmową wiedzą?', link: 'Poznaj rozwiązania AI', to: 'ai' },
      },
    },
    {
      id: 'ai',
      name: 'Rozwiązania AI',
      object: 'siatka',
      meta: { title: 'Rozwiązania AI dla firm | Nest Studio', description: 'Sprawdzamy, gdzie AI może wesprzeć pracę Twojego zespołu. Analiza zastosowań, prototypy i integracje dopasowane do konkretnego zadania.' },
      card: { title: 'AI z konkretnym zadaniem.', body: 'Sprawdzamy, gdzie AI może wesprzeć pracę zespołu: w wyszukiwaniu wiedzy, analizie dokumentów czy przygotowaniu odpowiedzi. Zaczynamy od zastosowania i testów, nie od obietnicy, że AI zrobi wszystko.', scope: ['Analiza zastosowań', 'Prototypy', 'Asystenci wiedzy', 'Praca z dokumentami', 'Integracje'], link: 'Poznaj rozwiązania AI' },
      page: {
        title: ['Nie AI do wszystkiego.', 'AI do konkretnego zadania.'],
        lead: 'Projektujemy i testujemy zastosowania AI osadzone w rzeczywistej pracy firmy. Od wyszukiwania informacji w dokumentach po przygotowanie materiałów do sprawdzenia przez zespół.',
        blocks: [
          { label: 'Punkt wyjścia', title: ['Najpierw zastosowanie.', 'Potem model.'], body: ['Zaczynamy od pytania, co ma się zmienić: czas wyszukiwania informacji, sposób analizy dokumentów czy przygotowanie odpowiedzi. Ustalamy, jakiej jakości oczekujesz i gdzie potrzebna jest decyzja człowieka.'] },
          { label: 'Przykładowe obszary', list: [
            { text: 'Asystenci korzystający z uporządkowanej bazy wiedzy.' },
            { text: 'Wyszukiwanie i porządkowanie informacji z dokumentów.' },
            { text: 'Wstępna klasyfikacja zapytań.' },
            { text: 'Tworzenie podsumowań i wersji roboczych.' },
            { text: 'Wsparcie wewnętrznych procesów obsługi i komunikacji.' },
          ] },
          { label: 'Od prototypu do decyzji', body: ['Budujemy ograniczony prototyp i sprawdzamy go na uzgodnionych przykładach. Oceniamy przydatność odpowiedzi, koszty, ograniczenia i sposób obsługi błędów. Dopiero wtedy rekomendujemy dalsze wdrożenie, zmianę podejścia albo prostsze rozwiązanie.'] },
          { label: 'Zasady pracy', body: ['Przed wdrożeniem uzgadniamy zakres danych, uprawnienia, zasady korzystania z dostawców i miejsca wymagające weryfikacji przez człowieka. Nie obiecujemy bezbłędności ani pełnej autonomii.'] },
        ],
      },
    },
  ],

  /* Realizacje: karty wg wzoru 3.3; opisy do akceptacji Filipa (docs/placeholders.md) */
  projects: [
    {
      id: 'perun-tac',
      name: 'Perun Tac',
      sentence: '[Jedno zdanie opisujące rzeczywisty cel lub zmianę w projekcie.]',
      tags: ['Branding', 'Strona internetowa'],
      year: '2026',
      status: '',
      image: '/v2/work/perun-tac.webp',
      alt: 'Strona główna Perun Tac: dwie dywizje obok siebie, szkolenia i ochrona',
      href: 'https://peruntac.pl',
      services: ['branding', 'web'],
    },
    {
      id: 'oboda-group',
      name: 'Oboda Group',
      sentence: 'Uporządkowana oferta i nowy sposób prezentacji usług.',
      tags: ['Strategia', 'Strona internetowa'],
      year: '2026',
      status: '[Status do potwierdzenia]',
      image: '/v2/work/oboda-group.webp',
      alt: 'Strona główna Oboda Group: żółte tło, hasło o szkoleniu rejestratorek i zdjęcie trenerki',
      href: '',
      services: ['web'],
    },
    {
      id: 'tcc-global',
      name: 'TCC Global',
      sentence: '[Jedno zdanie opisujące rzeczywisty cel lub zmianę w projekcie.]',
      tags: ['Strona internetowa'],
      year: '2026',
      status: 'Projekt koncepcyjny',
      image: '',
      alt: '',
      href: '',
      services: ['web'],
    },
  ],

  /* 5.1 Realizacje */
  workPage: {
    meta: { title: 'Realizacje: branding, strony i technologia | Nest Studio', description: 'Zobacz wybrane identyfikacje, strony i rozwiązania. Pokazujemy punkt wyjścia, kierunek pracy i to, co powstało. Nie sam końcowy mockup.' },
    title: ['Projekty, za którymi', 'stoją konkretne decyzje.'],
    lead: 'Zobacz wybrane identyfikacje, strony i rozwiązania. Pokazujemy punkt wyjścia, kierunek pracy i to, co powstało. Nie sam końcowy mockup.',
  },

  /* 5.2 Studio */
  studioPage: {
    meta: { title: 'Poznaj nasze studio | Nest Studio', description: 'Nest Studio łączy branding, projektowanie i technologię. Porządkujemy wizerunek firm, budujemy ich strony i usprawniamy wybrane obszary pracy.' },
    title: ['Za projektem', 'stoją konkretni ludzie.'],
    lead: 'Nest Studio łączy branding, projektowanie i technologię. Porządkujemy wizerunek firm, budujemy ich strony i usprawniamy wybrane obszary pracy.',
    approach: {
      label: 'Nasze podejście',
      title: ['Dobry projekt ma sens', 'także po prezentacji.'],
      body: [
        'Identyfikacja ma dać się konsekwentnie rozwijać. Strona ma jasno mówić, co oferujesz. Automatyzacja ma radzić sobie z wyjątkami, a nie tylko z idealnym scenariuszem.',
        'Tak rozumiemy jakość: dobry pomysł, porządne wykonanie i coś, z czego zespół naprawdę korzysta.',
      ],
    },
    principlesTitle: 'Trzy zasady',
    principles: [
      { title: 'Najpierw zrozumienie', body: 'Nie zaczynamy od gotowej odpowiedzi. Najpierw poznajemy kontekst i ograniczenia.' },
      { title: 'Decyzje z uzasadnieniem', body: 'Do każdego rozwiązania dokładamy powód, dla którego je proponujemy.' },
      { title: 'Całość i detal', body: 'Pilnujemy wspólnego kierunku, nie tracąc z oczu pojedynczego widoku, zdania czy interakcji.' },
    ],
    peopleTitle: 'Ludzie',
    people: [
      { name: 'Filip Jakubiak', role: '[Rola]', bio: '[Dwa konkretne zdania o odpowiedzialności i doświadczeniu.]', placeholder: true },
    ],
  },

  /* 5.3 Kontakt */
  contactPage: {
    meta: { title: 'Porozmawiajmy o projekcie | Nest Studio', description: 'Opisz krótko firmę, pomysł lub problem. Nie potrzebujesz gotowej specyfikacji. Na tej podstawie ustalimy, jaki powinien być kolejny krok.' },
    title: ['Zacznijmy od tego,', 'czego potrzebujesz.'],
    lead: 'Opisz krótko firmę, pomysł lub problem. Nie potrzebujesz gotowej specyfikacji. Na tej podstawie ustalimy, jaki powinien być kolejny krok.',
    required: 'Pola oznaczone * są wymagane.',
    fields: {
      name: { label: 'Imię', hint: 'Jak mamy się do Ciebie zwracać?' },
      email: { label: 'E-mail', hint: 'Na ten adres odpowiemy.' },
      message: { label: 'Opis projektu', hint: 'Co chcesz stworzyć lub zmienić? Co jest dziś największym wyzwaniem?' },
      company: { label: 'Firma lub obecna strona' },
      scope: { label: 'Zakres', options: ['Branding', 'Strona', 'Grafika', 'Automatyzacje', 'AI', 'Jeszcze nie wiem'] },
      budget: { label: 'Planowany budżet', options: ['[przedział 1]', '[przedział 2]', '[przedział 3]', 'Potrzebuję pomocy w określeniu'] },
      timing: { label: 'Preferowany termin' },
    },
    optional: 'opcjonalnie',
    submit: 'Wyślij zapytanie',
    privacy: 'Informacje o przetwarzaniu danych znajdziesz w Polityce prywatności.',
    nextTitle: 'Co dalej?',
    next: ['Zapoznamy się z wiadomością.', 'Wrócimy z pytaniami lub propozycją rozmowy.', 'Jeśli zakres będzie pasował do naszych kompetencji, ustalimy sposób przygotowania oferty.'],
    // 5.3 „Potwierdzenie wysłania” i „Błąd wysyłki”: pokazujemy dopiero z prawdziwym endpointem (docs/placeholders.md)
    sentTitle: 'Dziękujemy. Wiadomość dotarła.',
    sentBody: 'Zapoznamy się z opisem i wrócimy na podany adres. Jeśli chcesz coś uzupełnić, napisz na [E-MAIL].',
    sentLink: 'Wróć do realizacji',
    errorBody: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na [E-MAIL]. Twoje wpisane dane pozostają w formularzu.',
    mailSubject: 'Zapytanie ze strony Nest Studio',
  },

  /* 3.10 Stopka */
  footer: {
    tagline: ['Branding, strony i technologia.', 'Zaprojektowane z myślą o całości.'],
    cols: [
      { title: 'Odkrywaj', links: [{ label: 'Realizacje', page: 'work' }, { label: 'Usługi', page: 'home', hash: 'uslugi' }, { label: 'Studio', page: 'studio' }, { label: 'Kontakt', page: 'contact' }] },
      { title: 'Usługi', links: [{ label: 'Branding', page: 'branding' }, { label: 'Strony internetowe', page: 'web' }, { label: 'Projektowanie graficzne', page: 'graphic' }, { label: 'Automatyzacje', page: 'automation' }, { label: 'AI', page: 'ai' }] },
    ],
    contactTitle: 'Kontakt',
    location: '[Lokalizacja, jeśli istotna]',
    socialTitle: 'Profile',
    legal: '[Pełna nazwa podmiotu]',
    privacy: 'Polityka prywatności',
    cookies: 'Ustawienia cookies',
  },
};

export const pl = polishTypography(raw);
