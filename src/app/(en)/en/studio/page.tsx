import { StudioPage } from '@/components/pages/InfoPages';
import { en } from '@/content/en';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata('en', 'studio');

export default function Page() {
  return <StudioPage c={en} />;
}
