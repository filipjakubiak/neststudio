import type { Content, PageId } from '@/content/types';
import { Nav } from '@/components/nav/Nav';
import { ScrollRefresh } from '@/components/motion/ScrollRefresh';
import { Footer } from '@/components/sections/Footer';
import { GridGuides } from '@/components/ui/GridGuides';

/* Every page: nav (page-aware), main, footer. Native scroll: no smoothing layer between hand and page. */
export function PageShell({ c, page, children }: { c: Content; page: PageId; children: React.ReactNode }) {
  return (
    <>
      <ScrollRefresh />
      <GridGuides />
      <Nav content={c} page={page} />
      <main id="tresc">{children}</main>
      <Footer c={c} />
    </>
  );
}
