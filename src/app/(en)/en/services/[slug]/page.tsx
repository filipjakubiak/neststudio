import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { en } from '@/content/en';
import { buildMetadata } from '@/lib/metadata';
import { serviceBySlug, serviceSlug } from '@/lib/links';

/* Service pages (document ch. 4), one per service, generated statically. */
export const dynamicParams = false;

export function generateStaticParams() {
  return en.services.map((s) => ({ slug: serviceSlug(en, s.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug(en, (await params).slug);
  return s ? buildMetadata('en', s.id) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug(en, (await params).slug);
  if (!s) notFound();
  return <ServicePage c={en} id={s.id} />;
}
