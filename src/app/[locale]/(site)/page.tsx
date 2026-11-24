import { About } from "@/components/sections/about/about";
import { Digital } from "@/components/sections/digital/digital";
import { FinalCta } from "@/components/sections/final-cta/final-cta";
import { Film } from "@/components/sections/film/film";
import { Markets } from "@/components/sections/markets/markets";
import { Process } from "@/components/sections/process/process";
import { ServicesMarquee } from "@/components/sections/services-marquee/services-marquee";
import { Work } from "@/components/sections/work/work";
import { PhotoStrip } from "@/components/sections/photo-story/photo-strip";
import { ExampleBlock } from "@/components/review/example-block";
import { JsonLd } from "@/components/seo/json-ld";
import { contact } from "@/config/contact";
import { SITE_URL } from "@/config/site";
import type { Locale } from "@/content";
import { STRIP } from "@/content/photo-stories";
import { homeJsonLd } from "@/lib/jsonld";
import { HOME_REF } from "@/lib/review";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/** The home title names what the house does; `meta.title` stays the template every other title ends with. */
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("homeTitle") } };
}

/**
 * The homepage, in the brief's order (PROJECT_BRIEF §4). It opens with the film (the night of an
 * event, one scene per category; it replaces the hero and the categories grid). The tones alternate
 * so the page ground turns at each section (ToneController): dark film, photo strip and about, dark
 * work and marquee, light digital, dark process, light markets, dark CTA and footer.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return (
    <main id="main">
      <JsonLd data={homeJsonLd(locale as Locale, SITE_URL, contact.email)} />
      <Film />
      {/* Real rooms from our events, unnamed (D109): the proof right after the promise (N05). */}
      <PhotoStrip id="home-strip" tone="dark" eyebrow={STRIP.eyebrow} title={STRIP.title} frames={STRIP.frames} locale={locale as Locale} />
      <About />
      {/* Trust blocks (B8): hidden in production until the real material exists (D78); badged
          examples in review mode, where the benchmarks put them. */}
      <ExampleBlock kind="stats" refId={HOME_REF.stats} tone="dark" />
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
