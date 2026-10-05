import { ContactPage } from '@/components/pages/InfoPages';
import { en } from '@/content/en';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('en', 'contact');

export default function Page() {
  return <ContactPage c={en} />;
}
