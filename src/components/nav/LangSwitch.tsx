import type { Lang } from '@/content/types';
import { BASE_PATH } from '@/content/site';

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  return (
    <nav className="lang" aria-label={label}>
      <a href={`${BASE_PATH}/`} hrefLang="pl" lang="pl" aria-current={lang === 'pl' ? 'true' : undefined}>PL</a>
      <a href={`${BASE_PATH}/en/`} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'true' : undefined}>EN</a>
    </nav>
  );
}
