/* Polska typografia: jednoliterowe spójniki i przyimki (i, a, o, u, w, z) nie mogą zostać
   na końcu wiersza, więc wiążemy je z następnym słowem twardą spacją. Działa na całym
   słowniku, poza polami, które trafiają do URL-i albo służą za identyfikatory. */
const SKIP = new Set(['href', 'askPrompt', 'slug', 'id']);
const NBSP = ' ';
const ORPHAN = /(?<=^|[\s(„])([aiouwzAIOUWZ])\s+/g;

export function bindOrphans(text: string): string {
  return text.replace(ORPHAN, (_m, w: string) => w + NBSP);
}

export function polishTypography<T>(value: T, key = ''): T {
  if (typeof value === 'string') return (SKIP.has(key) ? value : bindOrphans(value)) as T;
  if (Array.isArray(value)) return value.map((v) => polishTypography(v, key)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, polishTypography(v, k)])) as T;
  }
  return value;
}
