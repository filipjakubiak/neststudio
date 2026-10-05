/*
 * Zmiany względem dokumentu strategii (docs/v2/source/copywriting-strategia.html), zrobione 05.10 na prośbę
 * Filipa skillem humanize-text: te zdania brzmiały zbyt „AI”. Każdy tekst na stronie pochodzi albo z dokumentu,
 * albo z tej listy (pilnuje tego tests/content.test.ts). Ocena przed/po: docs/v3/teksty-humanize.md.
 */
export const HUMANIZED: { doc: string; site: string; why: string }[] = [
  {
    "doc": "Tworzymy identyfikacje wizualne, strony internetowe i materiały, które nadają firmom spójny charakter. Łączymy je z automatyzacjami i AI, żeby dobry projekt miał swoje przełożenie na codzienną pracę.",
    "site": "Projektujemy identyfikacje wizualne, strony internetowe i materiały, po których widać, kim jest firma. Łączymy je z automatyzacjami i AI, żeby dobry projekt pomagał też w codziennej pracy.",
    "why": "abstrakcja („spójny charakter”, „przełożenie”) zamiast konkretu"
  },
  {
    "doc": "Różne firmy, różne wyzwania. Zobacz, jak przekładamy potrzeby biznesu na identyfikację, stronę i rozwiązania gotowe do codziennego użycia.",
    "site": "Zobacz, jak potrzeby firmy zamieniamy w identyfikację, stronę i narzędzia, z których korzysta się na co dzień.",
    "why": "otwierający frazes, „rozwiązania” jako słowo-wytrych"
  },
  {
    "doc": "Możemy zająć się jednym obszarem albo połączyć kilka w spójny projekt.",
    "site": "Możemy zająć się jednym obszarem albo połączyć kilka w jeden projekt.",
    "why": "„spójny” użyte 8 razy na stronie"
  },
  {
    "doc": "Interesuje nas nie tylko to, jak projekt wygląda w dniu prezentacji. Tak samo ważne jest to, jak działa po wdrożeniu: czy marka pozostaje spójna, czy stronę można rozwijać i czy zespół potrafi korzystać z nowych narzędzi.",
    "site": "Dzień prezentacji to dopiero początek. Sprawdzamy, jak projekt działa po wdrożeniu: czy marka pozostaje spójna, czy stronę można rozwijać i czy zespół umie korzystać z nowych narzędzi.",
    "why": "konstrukcja „nie tylko… tak samo ważne”"
  },
  {
    "doc": "Wizerunek, stronę, sposób pracy — a może kilka rzeczy naraz?",
    "site": "Wizerunek, stronę, sposób pracy, a może kilka rzeczy naraz?",
    "why": "półpauza"
  },
  {
    "doc": "Pomagamy określić, co wyróżnia Twoją firmę, i nadajemy temu wyrazistą formę. Tworzymy identyfikacje, które działają jako system — na stronie, w prezentacji i w codziennej komunikacji.",
    "site": "Pomagamy określić, co wyróżnia Twoją firmę, i nadajemy temu formę. Tworzymy identyfikacje, które działają jako system: na stronie, w prezentacji i w codziennej komunikacji.",
    "why": "półpauza, „wyrazista” trzeci raz"
  },
  {
    "doc": "Nie tylko prezentacja nowej identyfikacji. Otrzymujesz uzgodniony zestaw materiałów i zasad, które pomagają utrzymać spójność także wtedy, gdy powstają kolejne formaty.",
    "site": "Dostajesz uzgodniony zestaw materiałów i zasad. Dzięki nim kolejne formaty wyglądają jak ta sama marka, nawet jeśli robi je ktoś inny.",
    "why": "„nie tylko…”, abstrakcyjne „utrzymać spójność”"
  },
  {
    "doc": "Projektujemy i wdrażamy strony, które pokazują wartość oferty i prowadzą użytkownika do kolejnego kroku.",
    "site": "Projektujemy i wdrażamy strony, na których od razu widać, co oferujesz, i wiadomo, co kliknąć dalej.",
    "why": "„pokazują wartość oferty”, „użytkownik” zamiast zwrotu do czytelnika"
  },
  {
    "doc": "Przed wdrożeniem ustalamy punkt odniesienia — na przykład czas obsługi sprawy lub liczbę ręcznych kroków.",
    "site": "Przed wdrożeniem ustalamy punkt odniesienia, na przykład czas obsługi sprawy lub liczbę ręcznych kroków.",
    "why": "półpauza"
  },
  {
    "doc": "Pokazujemy punkt wyjścia, kierunek pracy i to, co powstało — nie tylko końcowy mockup.",
    "site": "Pokazujemy punkt wyjścia, kierunek pracy i to, co powstało. Nie sam końcowy mockup.",
    "why": "półpauza"
  },
  {
    "doc": "Jesteśmy [NAZWA] — studiem łączącym branding, projektowanie i technologię. Pomagamy firmom uporządkować wizerunek, rozwinąć obecność w sieci i usprawnić wybrane obszary pracy.",
    "site": "Nest Studio łączy branding, projektowanie i technologię. Porządkujemy wizerunek firm, budujemy ich strony i usprawniamy wybrane obszary pracy.",
    "why": "półpauza, „rozwinąć obecność w sieci”"
  },
  {
    "doc": "Identyfikacja powinna dawać się konsekwentnie rozwijać. Strona — jasno komunikować ofertę. Automatyzacja — uwzględniać także wyjątki, nie tylko idealny scenariusz.",
    "site": "Identyfikacja ma dać się konsekwentnie rozwijać. Strona ma jasno mówić, co oferujesz. Automatyzacja ma radzić sobie z wyjątkami, a nie tylko z idealnym scenariuszem.",
    "why": "dwie półpauzy"
  },
  {
    "doc": "Tak rozumiemy jakość: jako połączenie trafnego pomysłu, dopracowanego wykonania i użyteczności w codziennej pracy.",
    "site": "Tak rozumiemy jakość: dobry pomysł, porządne wykonanie i coś, z czego zespół naprawdę korzysta.",
    "why": "definicja-triada z rzeczowników abstrakcyjnych"
  },
  {
    "doc": "Pokazujemy nie tylko rozwiązanie, ale też powód, dla którego je proponujemy.",
    "site": "Do każdego rozwiązania dokładamy powód, dla którego je proponujemy.",
    "why": "„nie tylko…, ale też”"
  }
];

/** Zdania z dokumentu usunięte bez zamiennika (podsumowania-wypełniacze). */
export const REMOVED: string[] = ['Dlatego łączymy decyzje projektowe z realiami codziennej pracy.'];
