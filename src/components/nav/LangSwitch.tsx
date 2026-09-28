import type { Lang } from '@/content/types';

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  return (
    <nav className="lang" aria-label={label}>
      <a href="/" hrefLang="pl" lang="pl" aria-current={lang === 'pl' ? 'true' : undefined}>PL</a>
      <a href="/en/" hrefLang="en" lang="en" aria-current={lang === 'en' ? 'true' : undefined}>EN</a>
    </nav>
  );
}
