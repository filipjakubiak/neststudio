import { WorkPage } from '@/components/pages/InfoPages';
import { pl } from '@/content/pl';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('pl', 'work');

export default function Page() {
  return <WorkPage c={pl} />;
}
