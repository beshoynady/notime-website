import { getLocale, getTranslations } from "next-intl/server";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Parallax } from "@/components/motion/parallax";
import { RevealWords } from "@/components/motion/reveal-words";
import { ScrubColorWords } from "@/components/motion/scrub-color-words";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { getServices, type Locale } from "@/content";

// TEMPORARY dev harness for Task 4 primitives — replaced by the hero in Task 9.
export default async function HomePage() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  return (
    <main id="main">
      <section data-tone="dark" className="grid min-h-dvh place-items-center">
        <h1 className="text-display frame text-center">
          {t("hero.titleLine1")} <b className="text-champagne">{t("hero.titleLine2")}</b>
        </h1>
      </section>
      <section data-tone="light" className="section-pad">
        <div className="frame grid gap-16">
          <RevealWords className="text-h1">{t("hero.lead")}</RevealWords>
          <MaskReveal className="relative aspect-video overflow-hidden rounded-[var(--radius)]">
            <AiPlaceholder paint="table" />
          </MaskReveal>
          <Parallax className="aspect-video rounded-[var(--radius)]">
            <AiPlaceholder paint="studio" />
          </Parallax>
          <Magnetic>
            <span className="inline-block rounded-[var(--radius)] bg-espresso px-6 py-4 text-ivory">{t("hero.cta")}</span>
          </Magnetic>
        </div>
      </section>
      <section data-tone="dark" className="section-pad">
        <div className="frame grid gap-16">
          <ScrubColorWords className="text-h1 max-w-[22ch]" text={t("meta.description")} />
          <Marquee label={t("nav.services")} items={getServices().map((s) => s.title[locale])} />
        </div>
      </section>
    </main>
  );
}
