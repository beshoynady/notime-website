import { About } from "@/components/sections/about/about";
import { Categories } from "@/components/sections/categories/categories";
import { Digital } from "@/components/sections/digital/digital";
import { FinalCta } from "@/components/sections/final-cta/final-cta";
import { Hero } from "@/components/sections/hero/hero";
import { Markets } from "@/components/sections/markets/markets";
import { Process } from "@/components/sections/process/process";
import { ServicesMarquee } from "@/components/sections/services-marquee/services-marquee";
import { Work } from "@/components/sections/work/work";
import { ExampleBlock } from "@/components/review/example-block";
import { HOME_REF } from "@/lib/review";

/**
 * The homepage, in the brief's order (PROJECT_BRIEF §4). The tones alternate so the page ground
 * turns at each section (ToneController): dark hero and about, light categories, dark work and
 * marquee, light digital, dark process, light markets, dark CTA and footer.
 */
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Categories />
      {/* Hidden in production until the real material exists (D78); badged examples in review mode. */}
      <ExampleBlock kind="logos" refId={HOME_REF.logos} />
      <Work />
      <ServicesMarquee />
      <Digital />
      <Process />
      <Markets />
      <ExampleBlock kind="testimonials" refId={HOME_REF.testimonials} />
      <FinalCta />
    </main>
  );
}
