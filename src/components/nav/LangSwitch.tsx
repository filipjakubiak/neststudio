import type { Lang } from '@/content/types';

/* PL / EN: each link points to the same page in the other language. */
export function LangSwitch({ lang, label, alt }: { lang: Lang; label: string; alt: { pl: string; en: string } }) {
  return (
    <nav className="lang" aria-label={label}>
      <a href={alt.pl} hrefLang="pl" lang="pl" aria-current={lang === 'pl' ? 'true' : undefined}>PL</a>
      <a href={alt.en} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'true' : undefined}>EN</a>
    </nav>
  );
}
