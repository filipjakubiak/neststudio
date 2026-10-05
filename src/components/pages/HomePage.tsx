import type { Content } from '@/content/types';
import type { PlanEntry } from '@/scene/bands/recipes';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Work } from '@/components/sections/Work';
import { Direction } from '@/components/sections/Direction';
import { ServicesList } from '@/components/sections/ServicesList';
import { Process } from '@/components/sections/Process';
import { StudioTeaser } from '@/components/sections/StudioTeaser';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';

/* Home page in the document's order (ch. 3 + wireframe ch. 6), with the stats bento after the hero
   (Filip, 30.09). The client quote module (3.3) is left out until there is a real quote with consent. */
const BANDS: PlanEntry[] = [
  { name: 'po-hero', recipe: 'cross', gap: 'hero/liczby', from: 'right', period: 24 },
  { name: 'po-realizacjach', recipe: 'cross', gap: 'realizacje/kierunek', from: 'left', period: 30, phase: 0.2 },
  { name: 'po-uslugach', recipe: 'cross', gap: 'uslugi/proces', from: 'right', period: 28, phase: 0.6 },
  { name: 'studio-faq', recipe: 'drop', gaps: ['studio/faq', 'faq/cta'], from: 'left', to: 'right', x: 0.42, folds: ['soft', 'crisp'], period: 26, phase: 0.45,
    mobile: { recipe: 'cross', gap: 'faq/cta', from: 'right' } },
];

export function HomePage({ c }: { c: Content }) {
  return (
    <PageShell c={c} page="home" bands={BANDS}>
      <Hero c={c} />
      <Stats c={c} />
      <Work c={c} />
      <Direction c={c} />
      <ServicesList c={c} />
      <Process c={c} />
      <StudioTeaser c={c} />
      <Faq c={c} />
      <Cta c={c} />
    </PageShell>
  );
}
