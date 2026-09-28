import { RootShell } from '@/components/RootShell';
import { buildMetadata } from '@/lib/metadata';
import '@/styles/globals.css';

export const metadata = buildMetadata('en');

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
