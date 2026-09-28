import { RootShell } from '@/components/RootShell';
import { buildMetadata } from '@/lib/metadata';
import '@/styles/globals.css';

export const metadata = buildMetadata('pl');

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="pl">{children}</RootShell>;
}
