import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoStrip } from "@/components/sections/photo-story/photo-strip";
import { OptionA } from "@/components/sections/hero-options/option-a";
import { OptionB } from "@/components/sections/hero-options/option-b";
import { OptionC } from "@/components/sections/hero-options/option-c";
import type { Locale } from "@/content";
import { STRIP } from "@/content/photo-stories";

/**
 * Hero options for the owner's choice (branch hero-options; never merged as is): `/[locale]/hero-lab/a|b|c`
 * shows one option over the home page's next section, so the hand-over reads as it would on Home.
 * Not indexed, not linked, not in the sitemap.
 */
const OPTIONS = { a: OptionA, b: OptionB, c: OptionC } as const;

export function generateStaticParams() {
  return Object.keys(OPTIONS).map((option) => ({ option }));
}

export const metadata: Metadata = { title: "Hero options", robots: { index: false, follow: false } };

export default async function HeroLab({ params }: PageProps<"/[locale]/hero-lab/[option]">) {
  const { locale, option } = await params;
  const Option = OPTIONS[option as keyof typeof OPTIONS];
  if (!Option) notFound();
  return (
    <main id="main">
      <Option />
      <PhotoStrip id="home-strip" tone="dark" eyebrow={STRIP.eyebrow} title={STRIP.title} frames={STRIP.frames} locale={locale as Locale} />
    </main>
  );
}
