import type { Content } from '@/content/types';
import { Nav } from '@/components/nav/Nav';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { TitleSequence } from '@/components/TitleSequence';
import { LockupDefs } from '@/components/ui/Lockup';
import { SceneCanvas } from '@/components/scene/SceneCanvas';
import { SceneDirector } from '@/components/scene/SceneDirector';
import { ThreadRail } from '@/components/nav/ThreadRail';
import { Hero } from '@/components/sections/Hero';
import { Tension } from '@/components/sections/Tension';
import { Showreel } from '@/components/sections/Showreel';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { AiDemo } from '@/components/sections/AiDemo';
import { Process } from '@/components/sections/Process';
import { Studio } from '@/components/sections/Studio';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export function Site({ content }: { content: Content }) {
  return (
    <>
      <SmoothScroll />
      <LockupDefs />
      <TitleSequence label={content.preloader.loading} skipLabel={content.preloader.skip} />
      <SceneCanvas noWebglNote={content.system.noWebgl} />
      <SceneDirector />
      <div className="site-grid" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
      <Nav content={content} />
      <ThreadRail c={content} />
      <main id="tresc" style={{ position: 'relative', zIndex: 'var(--z-content)' }}>
        <Hero c={content} />
        <Tension c={content} />
        <Showreel c={content} />
        <Projects c={content} />
        <Services c={content} />
        <AiDemo c={content} />
        <Process c={content} />
        <Studio c={content} />
        <Faq c={content} />
        <Contact c={content} />
      </main>
      <Footer c={content} />
    </>
  );
}
