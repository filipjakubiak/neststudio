import type { Content, PageId } from '@/content/types';
import type { PlanEntry } from '@/scene/bands/recipes';
import { Nav } from '@/components/nav/Nav';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { BandLayer } from '@/components/objects/BandLayer';
import { Footer } from '@/components/sections/Footer';

/* Every page: bands under the page, smooth scroll, nav (page-aware), main, footer. */
export function PageShell({ c, page, bands, children }: { c: Content; page: PageId; bands: PlanEntry[]; children: React.ReactNode }) {
  return (
    <>
      <BandLayer plan={bands} />
      <SmoothScroll />
      <Nav content={c} page={page} />
      <main id="tresc">{children}</main>
      <Footer c={c} />
    </>
  );
}
