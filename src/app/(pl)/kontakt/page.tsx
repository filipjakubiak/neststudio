import { ContactPage } from '@/components/pages/InfoPages';
import { pl } from '@/content/pl';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('pl', 'contact');

export default function Page() {
  return <ContactPage c={pl} />;
}
