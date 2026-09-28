/* Stałe strony. Placeholdery opisane w docs/placeholders.md. */
export const SITE_URL = 'https://neststudio.pl'; // [PH]
export const EMAIL = 'hello@neststudio.pl'; // [PH]
export const PHONE = '+48 000 000 000'; // [PH]
export const CAL_URL = ''; // [PH] pusty = link ukryty
export const LEGAL_NAME = 'Nest Studio Filip Jakubiak'; // [PH]
export const NIP = '000-000-00-00'; // [PH]
export const SHOWREEL_SRC = ''; // [PH] pusty = sekwencja generatywna
export const FOUNDED_YEAR = 2014;
export const SOCIAL: { label: string; href: string; placeholder: boolean }[] = [
  { label: 'Instagram', href: '#', placeholder: true },
  { label: 'LinkedIn', href: '#', placeholder: true },
  { label: 'Behance', href: '#', placeholder: true },
];

export function yearsInField(now: number = new Date().getFullYear()): number {
  return now - FOUNDED_YEAR;
}

export const ASK_AI = [
  { id: 'claude', label: 'Claude', url: (q: string) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
  { id: 'chatgpt', label: 'ChatGPT', url: (q: string) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  { id: 'perplexity', label: 'Perplexity', url: (q: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
];
