import { StudioPage } from '@/components/pages/InfoPages';
import { pl } from '@/content/pl';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('pl', 'studio');

export default function Page() {
  return <StudioPage c={pl} />;
}
