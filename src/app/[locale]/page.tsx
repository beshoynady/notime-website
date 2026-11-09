import { About } from "@/components/sections/about/about";
import { Categories } from "@/components/sections/categories/categories";
import { Hero } from "@/components/sections/hero/hero";
import { ExampleBlock } from "@/components/review/example-block";
import { HOME_REF } from "@/lib/review";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Categories />
      {/* Hidden in production until the real material exists (D78); badged examples in review mode. */}
      <ExampleBlock kind="logos" refId={HOME_REF.logos} />
      {/* TODO: replace placeholder — Work, Marquee, Digital, How we work, Markets, CTA (Phase 2) */}
      <ExampleBlock kind="testimonials" refId={HOME_REF.testimonials} />
    </main>
  );
}
