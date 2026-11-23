import { getImageProps } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import type { Locale } from "@/content";
import { contactCategoryHref, WORK_INDEX_HREF } from "@/content/links";
import { media } from "@/content/media";
import { HERO_LINE } from "@/config/hero";
import { capSrcSet } from "@/lib/srcset";
import { HeroClock } from "./hero-clock";
import { HeroController } from "./hero-controller";
import { HeroHud } from "./hero-hud";
import { SectionRef } from "@/components/review/section-ref";
import { HOME_REF } from "@/lib/review";

/** Rand's dressed hall (the 2026 profile, p9-2), through the image registry (D152). */
const PLATE = "private-celebrations-1";

/**
 * Home hero (server component; D156). The whole first screen is there at first paint: the header,
 * the eyebrow, the title, the lead and both actions, over a real photograph of NO TIME's work
 * (Rand's dressed hall), graded dark so the ivory text holds AA. No intro and no gate: the old
 * shutters, the hidden header and the canvas atmosphere are gone.
 *
 * One screen says it all (N05). The scroll pin only plays the exit (HeroController).
 *
 * Layers, back to front: 0 plate + its grade · 1 vignette · 2 clock (one CSS sweep of the hand)
 * · 4 content · 6 letterbox · 7 HUD.
 */
export async function Hero() {
  const [t, locale] = await Promise.all([getTranslations("hero"), getLocale() as Promise<Locale>]);
  const plate = media(PLATE);
  const img = plate
    ? getImageProps({
        src: plate.file,
        alt: plate.alt?.[locale] ?? "",
        width: plate.width,
        height: plate.height,
        sizes: "100vw",
        loading: "eager",
        fetchPriority: "high",
      }).props
    : null;
  return (
    // Server-rendered pin spacer for the scroll pin (D43): with its own spacer, ScrollTrigger
    // never moves #hero in the DOM. When it created one, it re-inserted the hero on every
    // refresh, and Chrome then re-timed the title's paint (LCP) to the last re-insertion.
    // A plain block without JS or under reduced motion.
    <div className="hero-pin">
      <section
        id="hero"
        data-cta-opening=""
        className="hero"
        data-tone="dark"
        data-header="hero"
        data-bg="own"
        data-grain="off"
        aria-labelledby="hero-title"
      >
        <SectionRef id={HOME_REF.hero} />
        <HeroController />
        {img && plate && (
          <div className="hero-plate">
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51) */}
            <img {...img} srcSet={capSrcSet(img.srcSet, plate.width)} />
          </div>
        )}
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-clock-wrap" aria-hidden="true">
          <HeroClock />
        </div>

        <div className="hero-content frame">
          {/* A <p>, not a heading: the H1 stays the page's first heading. */}
          <p className="hero-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
          {/* The lines are decorative; the heading's name is the sentence-case label, so screen
              readers don't spell out capitals. */}
          <h1 id="hero-title" className="hero-title" aria-label={t(`title.${HERO_LINE}.label`)}>
            {/* .hero-line is what the scroll timeline moves; the text sits in .hero-line-inner, which
                nothing animates. When GSAP gave the text's own box its rest transform at hydration,
                Chrome repainted the line as a new, larger LCP entry (+0.9 s at 4x CPU, D156). */}
            <span className="hero-line" aria-hidden="true">
              <span className="hero-line-inner">{t("titleLine1")}</span>
            </span>
            <span className="hero-line" aria-hidden="true">
              <b className="hero-line-inner">{t(`title.${HERO_LINE}.line2`)}</b>
            </span>
          </h1>
          <div className="hero-sub">
            <p className="hero-lead text-lead">{t("lead")}</p>
            <div className="hero-actions">
              {/* "Plan your event" opens the brief on Events, with the event fields (D126). */}
              <ButtonLink href={contactCategoryHref("events-hospitality")} arrow data-cursor="">
                {t("cta")}
              </ButtonLink>
              <ButtonLink href={WORK_INDEX_HREF} variant="ghost" data-cursor="">
                {t("ctaWork")}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="hero-letterbox top" aria-hidden="true" />
        <div className="hero-letterbox bottom" aria-hidden="true" />
        <HeroHud />
      </section>
    </div>
  );
}
