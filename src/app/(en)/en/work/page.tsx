import { WorkPage } from '@/components/pages/InfoPages';
import { en } from '@/content/en';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('en', 'work');

export default function Page() {
  return <WorkPage c={en} />;
}
