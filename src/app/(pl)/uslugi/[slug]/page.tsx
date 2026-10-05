import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { pl } from '@/content/pl';
import { buildMetadata } from '@/lib/metadata';
import { serviceBySlug, serviceSlug } from '@/lib/links';

/* Service pages (document ch. 4), one per service, generated statically. */
export const dynamicParams = false;

export function generateStaticParams() {
  return pl.services.map((s) => ({ slug: serviceSlug(pl, s.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug(pl, (await params).slug);
  return s ? buildMetadata('pl', s.id) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug(pl, (await params).slug);
  if (!s) notFound();
  return <ServicePage c={pl} id={s.id} />;
}
