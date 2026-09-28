import type { Metadata } from 'next';
import { content } from '@/content';
import type { Lang } from '@/content/types';
import { SITE_URL } from '@/content/site';

export function buildMetadata(lang: Lang): Metadata {
  const c = content[lang];
  const path = lang === 'pl' ? '/' : '/en/';
  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: path,
      languages: { pl: '/', en: '/en/', 'x-default': '/' },
    },
    openGraph: {
      title: c.meta.ogTitle,
      description: c.meta.description,
      url: path,
      siteName: 'Nest Studio',
      locale: lang === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Nest Studio' }],
    },
    twitter: { card: 'summary_large_image', title: c.meta.ogTitle, description: c.meta.description, images: ['/og.png'] },
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
    robots: { index: true, follow: true },
  };
}
