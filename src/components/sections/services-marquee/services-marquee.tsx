import { getLocale, getTranslations } from "next-intl/server";
import { Marquee } from "@/components/motion/marquee";
import { SectionRef } from "@/components/review/section-ref";
import { getServices, type Locale } from "@/content";
import { HOME_REF } from "@/lib/review";
import "./services-marquee.css";

/**
 * Home · Services marquee (H-05): all 30 services from `services.ts`, in category order. CSS
 * marquee (motion/marquee.tsx): reverses in Arabic, pauses on hover, still under reduced motion.
 * A hinge between the dark Work section and the light Digital band, so it keeps the dark tone.
 */
export async function ServicesMarquee() {
  const [t, locale] = await Promise.all([getTranslations("marquee"), getLocale() as Promise<Locale>]);
  const items = getServices().map((s) => s.title[locale]);
  return (
    <section data-tone="dark" className="relative">
      <SectionRef id={HOME_REF.marquee} />
      <Marquee items={items} label={t("label")} durationSec={90} className="services-marquee" />
    </section>
  );
}
