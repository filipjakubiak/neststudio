import type { Lang } from '@/content/types';
import { content } from '@/content';
import { TITLE_SEQUENCE_ON_TOUCH } from '@/content/site';

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const c = content[lang];
  return (
    <html lang={lang} data-lang={lang}>
      <head>
        <link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-latin-ext-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0a0a0b" />
        <meta name="color-scheme" content="dark" />
        {/* Decyzja o preloaderze przed pierwszym malowaniem: brak mignięcia hero → preloader → hero. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var s=sessionStorage.getItem('nest_seen')==='1';var t=${TITLE_SEQUENCE_ON_TOUCH ? 'false' : "matchMedia('(pointer: coarse)').matches"};if(r||s||t){document.documentElement.setAttribute('data-skip-preloader','');}else{document.documentElement.setAttribute('data-preloading','true');}}catch(e){document.documentElement.setAttribute('data-skip-preloader','');}})();`,
          }}
        />
      </head>
      <body>
        <a href="#tresc" className="skip-link">{c.system.skip}</a>
        {children}
      </body>
    </html>
  );
}
