import { About } from "@/components/sections/about/about";
import { Categories } from "@/components/sections/categories/categories";
import { Hero } from "@/components/sections/hero/hero";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Categories />
      {/* TODO: replace placeholder — Work, Marquee, Digital, How we work, Markets, CTA (Phase 2) */}
    </main>
  );
}
