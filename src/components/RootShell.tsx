import type { Lang } from '@/content/types';
import { content } from '@/content';
import { MOTION_BOOT } from '@/lib/motionPref';

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const c = content[lang];
  return (
    <html lang={lang} data-lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-latin-ext-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-sans-latin-ext-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* hero object poster: first frame of the Splot loop, in the hero from the first paint */}
        <link rel="preload" href="/v2/objects/splot/square-poster.avif" as="image" type="image/avif" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        {/* motion switch state before the first paint (WCAG 2.2.2 pause control, reduced motion) */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>
        <a href="#tresc" className="skip-link">{c.system.skip}</a>
        {children}
      </body>
    </html>
  );
}
