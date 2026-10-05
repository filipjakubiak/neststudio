import { content } from '@/content';
import type { Content, PageId, Service, ServiceId } from '@/content/types';

/* Every internal link is a page id (+ optional hash), resolved per language from content.paths. */
export function href(c: Content, page: PageId, hash?: string): string {
  return c.paths[page] + (hash ? `#${hash}` : '');
}

export function alternates(page: PageId) {
  return { pl: content.pl.paths[page], en: content.en.paths[page] };
}

export function service(c: Content, id: ServiceId): Service {
  const s = c.services.find((x) => x.id === id);
  if (!s) throw new Error(`unknown service ${id}`);
  return s;
}

/** URL slug of a service page (last path segment), for generateStaticParams. */
export function serviceSlug(c: Content, id: ServiceId): string {
  return c.paths[id].split('/').filter(Boolean).pop()!;
}

export function serviceBySlug(c: Content, slug: string): Service | undefined {
  return c.services.find((s) => serviceSlug(c, s.id) === slug);
}
