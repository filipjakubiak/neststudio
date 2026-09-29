import type { Metadata } from 'next';
import { content } from '@/content';
import type { Lang } from '@/content/types';
import { BASE_PATH, SITE_URL } from '@/content/site';

export function buildMetadata(lang: Lang): Metadata {
  const c = content[lang];
  const path = `${BASE_PATH}${lang === 'pl' ? '/' : '/en/'}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: path,
      languages: { pl: `${BASE_PATH}/`, en: `${BASE_PATH}/en/`, 'x-default': `${BASE_PATH}/` },
    },
    openGraph: {
      title: c.meta.ogTitle,
      description: c.meta.description,
      url: path,
      siteName: 'Nest Studio',
      locale: lang === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
      images: [{ url: `${BASE_PATH}/og.png`, width: 1200, height: 630, alt: 'Nest Studio' }],
    },
    twitter: { card: 'summary_large_image', title: c.meta.ogTitle, description: c.meta.description, images: [`${BASE_PATH}/og.png`] },
    icons: { icon: [{ url: `${BASE_PATH}/favicon.svg`, type: 'image/svg+xml' }] },
    robots: { index: true, follow: true },
  };
}
