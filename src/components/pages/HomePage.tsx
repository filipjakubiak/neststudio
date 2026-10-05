import type { Content } from '@/content/types';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/sections/Hero';
import { Work } from '@/components/sections/Work';
import { Proof } from '@/components/sections/Proof';
import { Direction } from '@/components/sections/Direction';
import { ServicesList } from '@/components/sections/ServicesList';
import { Process } from '@/components/sections/Process';
import { StudioTeaser } from '@/components/sections/StudioTeaser';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';

/* Home page in the document's order (ch. 3 + wireframe ch. 6). The quote module (3.3) sits after the work,
   as in the wireframe; it shows the document's [brackets] until real quotes with consent arrive. */
export function HomePage({ c }: { c: Content }) {
  return (
    <PageShell c={c} page="home">
      <Hero c={c} />
      <Work c={c} />
      <Proof c={c} />
      <Direction c={c} />
      <ServicesList c={c} />
      <Process c={c} />
      <StudioTeaser c={c} />
      <Faq c={c} />
      <Cta c={c} />
    </PageShell>
  );
}
