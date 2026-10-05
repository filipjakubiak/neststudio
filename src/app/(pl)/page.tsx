import { HomePage } from '@/components/pages/HomePage';
import { pl } from '@/content/pl';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('pl', 'home');

export default function Page() {
  return <HomePage c={pl} />;
}
