import { Hero } from "@/components/sections/hero/hero";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      {/* TODO: replace placeholder — About section, Phase 2 */}
      <section data-tone="light" aria-hidden="true" className="min-h-svh" />
    </main>
  );
}
