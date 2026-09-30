import type { Content } from '@/content/types';
import type { PlanEntry } from '@/scene/bands/recipes';
import { Nav } from '@/components/nav/Nav';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { BandLayer } from '@/components/objects/BandLayer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Who } from '@/components/sections/Who';
import { Work } from '@/components/sections/Work';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Testimonials, Team } from '@/components/sections/Voices';
import { Process } from '@/components/sections/Process';
import { Pricing } from '@/components/sections/Pricing';
import { Partners } from '@/components/sections/Partners';
import { Cta } from '@/components/sections/Cta';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

/*
 * Band plan for the home page (docs/v2/system.md): recipes placed into gaps between sections ("a/b" =
 * section ids). Rule: a band never shares a frame with a section object. On phones text is full
 * width, so drops become straight crossings.
 */
const BANDS: PlanEntry[] = [
  { name: 'liczby', recipe: 'drop', gaps: ['hero/stats', 'stats/who'], from: 'right', to: 'left', x: 0.84, folds: ['crisp', 'soft'], period: 22,
    mobile: { recipe: 'cross', gap: 'hero/stats' } },
  { name: 'realizacje', recipe: 'cross', gap: 'who/realizacje', from: 'left', period: 30, phase: 0.2 },
  { name: 'studio', recipe: 'drop', gaps: ['uslugi/studio', 'studio/opinie'], from: 'left', to: 'right', x: 0.54, folds: ['soft', 'crisp'], period: 26, phase: 0.45,
    mobile: { recipe: 'cross', gap: 'studio/opinie', from: 'right' } },
  { name: 'zespol', recipe: 'hook', gap: 'opinie/zespol', from: 'right', x: 0.9, depth: 520, fold: 'soft', period: 24, phase: 0.7,
    mobile: { recipe: 'cross', gap: 'opinie/zespol' } },
  { name: 'wycena', recipe: 'cross', gap: 'proces/wycena', from: 'right', period: 28, phase: 0.1 },
];

export function Site({ content: c }: { content: Content }) {
  return (
    <>
      <BandLayer plan={BANDS} />
      <SmoothScroll />
      <Nav content={c} />
      <main id="tresc">
        <Hero c={c} />
        <Stats c={c} />
        <Who c={c} />
        <Work c={c} />
        <Services c={c} />
        <About c={c} />
        <Testimonials c={c} />
        <Team c={c} />
        <Process c={c} />
        <Pricing c={c} />
        <Partners c={c} />
        <Cta c={c} />
        <Contact c={c} />
      </main>
      <Footer c={c} />
    </>
  );
}
