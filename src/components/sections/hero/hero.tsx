import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { contactCategoryHref, WORK_INDEX_HREF } from "@/content/links";
import { HERO_LINE } from "@/config/hero";
import { HeroClock } from "./hero-clock";
import { HeroController } from "./hero-controller";
import { HeroHud } from "./hero-hud";
import { SectionRef } from "@/components/review/section-ref";
import { HOME_REF } from "@/lib/review";

/**
 * Cinematic clock hero (server component). Every layer is server-rendered and visible
 * at rest (DECISIONS D15); intro-only states (shutters, hidden header) are CSS-gated under
 * `html[data-js]:not([data-reduced])` on `[data-hero-intro]`.
 *
 * One screen says it all (N05): the eyebrow (the old second beat, read once), the title, the
 * lead and two actions. The scroll pin only plays the exit.
 *
 * Layers, back to front: 1 canvas (HeroScene, mounted client-only by HeroController; it also
 * draws the film grain, D45) · 2 vignette · 3 clock · 5 content · 7 letterbox · 8 HUD · 9 shutters.
 */
export async function Hero() {
  const t = await getTranslations("hero");
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
        data-hero-intro=""
        aria-labelledby="hero-title"
      >
        <SectionRef id={HOME_REF.hero} />
        <HeroController />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-clock-wrap" aria-hidden="true">
          <HeroClock />
        </div>

        <div className="hero-content frame">
          {/* A <p>, not a heading: the H1 stays the page's first heading and its LCP element. */}
          <p className="hero-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
          {/* The lines are decorative (they get split into chars/words); the heading's
              name is the sentence-case label, so screen readers don't spell out capitals. */}
          <h1 id="hero-title" className="hero-title" aria-label={t(`title.${HERO_LINE}.label`)}>
            {/* .hero-line is the mask (scroll timeline moves it); .hero-line-inner rises
                inside it (intro / repeat-visit reveal). */}
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
        <div className="hero-shutter top" aria-hidden="true" />
        <div className="hero-shutter bottom" aria-hidden="true" />
      </section>
    </div>
  );
}
