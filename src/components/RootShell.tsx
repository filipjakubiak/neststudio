import type { Lang } from '@/content/types';
import { content } from '@/content';

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const c = content[lang];
  return (
    <html lang={lang} data-lang={lang}>
      <head>
        <link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-latin-ext-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0a0a0b" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <a href="#tresc" className="skip-link">{c.system.skip}</a>
        {children}
      </body>
    </html>
  );
}
