import type { Metadata } from 'next';
import { content } from '@/content';
import type { Lang, Meta, PageId } from '@/content/types';
import { SITE_URL } from '@/content/site';

/* Titles and descriptions from the strategy document, ch. 9; hreflang pairs every page with its twin. */
export function pageMeta(lang: Lang, page: PageId): Meta {
  const c = content[lang];
  if (page === 'home') return c.home.meta;
  if (page === 'work') return c.workPage.meta;
  if (page === 'studio') return c.studioPage.meta;
  if (page === 'contact') return c.contactPage.meta;
  return c.services.find((s) => s.id === page)!.meta;
}

export function buildMetadata(lang: Lang, page: PageId = 'home'): Metadata {
  const m = pageMeta(lang, page);
  const path = content[lang].paths[page];
  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: path,
      languages: { pl: content.pl.paths[page], en: content.en.paths[page], 'x-default': content.pl.paths[page] },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: path,
      siteName: 'Nest Studio',
      locale: lang === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Nest Studio' }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.description, images: ['/og.png'] },
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
    robots: { index: true, follow: true },
  };
}
