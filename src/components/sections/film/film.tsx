import { ArrowRight } from "lucide-react";
import { getImageProps } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionRef } from "@/components/review/section-ref";
import { ButtonLink } from "@/components/ui/button";
import { HERO_LINE } from "@/config/hero";
import { getCategories, type Locale } from "@/content";
import { FILM, sceneCounter, type FilmBeat } from "@/content/film";
import { categoryHref, contactCategoryHref, WORK_INDEX_HREF } from "@/content/links";
import { media } from "@/content/media";
import { Link } from "@/i18n/navigation";
import { HOME_REF } from "@/lib/review";
import { capSrcSet } from "@/lib/srcset";
import { FilmDial } from "./film-dial";
import { FilmMotion } from "./film-motion";
import { CampaignPhone, CampaignWall, CheckinTablet, PrintedCard, Viewfinder } from "./film-props";

/**
 * Home · the film (docs/review/film-storyboard/; replaces the D173 hero and the categories grid).
 * "The night of the event": an empty hall comes to life over seven scenes, each a full-screen
 * plate with its copy. Layout is CSS alone (film.css), so nothing shifts when JS arrives:
 * - motion (html[data-js], no reduced motion): every scene's plate and copy are sticky; each
 *   scene overlaps the one before by a screen, so it rises over it, and FilmMotion turns that
 *   rise into a dissolve, a slow dolly and the props' moves;
 * - reduced motion or no JS: the scenes stack, each at its final frame.
 * The opening is the first screen: eyebrow, H1, lead and both actions at first paint; its plate
 * is the only eager image (LCP is the title or the plate, the N06 allowance).
 */
export async function Film() {
  const [t, th, locale] = await Promise.all([getTranslations("film"), getTranslations("hero"), getLocale() as Promise<Locale>]);
  const categories = new Map(getCategories().map((c) => [c.slug, c]));
  return (
    <>
      <section id="film" className="film" data-tone="dark" data-header="hero" data-bg="own" data-grain="off" aria-label={t("label")}>
        <SectionRef id={HOME_REF.hero} />
        <FilmMotion />
        <div className="film-skip-rail">
          <a className="film-skip" href="#after-film">
            {t("skip")}
          </a>
        </div>
        {FILM.map((beat, i) => {
          const category = beat.category ? categories.get(beat.category) : undefined;
          return (
            <div
              key={beat.key}
              className="film-beat"
              data-beat={beat.key}
              data-mirror={beat.mirror}
              // The opening keeps the hero's hooks (the CTA bar's opening, e2e); Events is the old
              // categories anchor (`/en#services`, D53).
              id={i === 0 ? "hero" : i === 1 ? "services" : undefined}
              data-cta-opening={i === 0 ? "" : undefined}
            >
              <div className="film-plate" aria-hidden="true">
                <div className="film-cover">
                  <FilmPicture beat={beat} eager={i === 0} />
                  {beat.prop === "campaign" && <CampaignWall />}
                  {beat.prop === "card" && <PrintedCard />}
                </div>
                {beat.prop === "beams" && <span className="film-veil" data-film-veil="" />}
                <span className="film-shade" />
                {beat.prop === "beams" && <span className="film-haze" data-film-haze="" />}
                {beat.prop === "viewfinder" && <Viewfinder />}
                {beat.prop === "campaign" && <CampaignPhone />}
                {beat.prop === "checkin" && <CheckinTablet />}
                {beat.prop === "dial" && (
                  <div className="film-dial-wrap">
                    <FilmDial />
                  </div>
                )}
                {i > 0 && <p className="film-slate">{t(`slate.${beat.key}`)}</p>}
              </div>

              <div className="film-copy">
                <div className="film-copy-in frame" data-film-copy="">
                  {i === 0 ? (
                    <>
                      {/* A <p>, not a heading: the H1 stays the page's first heading. */}
                      <p className="hero-eyebrow text-eyebrow text-champagne">{th("eyebrow")}</p>
                      {/* The text sits in .hero-line-inner, which nothing animates (LCP, D156). */}
                      <h1 id="hero-title" className="hero-title" aria-label={th(`title.${HERO_LINE}.label`)}>
                        <span className="hero-line" aria-hidden="true">
                          <span className="hero-line-inner">{th("titleLine1")}</span>
                        </span>
                        <span className="hero-line" aria-hidden="true">
                          <b className="hero-line-inner">{th(`title.${HERO_LINE}.line2`)}</b>
                        </span>
                      </h1>
                      <p className="hero-lead text-lead">{th("lead")}</p>
                      <div className="hero-actions">
                        {/* "Plan your event" opens the brief on Events, with the event fields (D126). */}
                        <ButtonLink href={contactCategoryHref("events-hospitality")} arrow data-cursor="">
                          {th("cta")}
                        </ButtonLink>
                        <ButtonLink href={WORK_INDEX_HREF} variant="ghost" data-cursor="">
                          {th("ctaWork")}
                        </ButtonLink>
                      </div>
                    </>
                  ) : beat.key === "finale" ? (
                    <>
                      <p className="film-count">
                        <bdi dir="ltr">{sceneCounter(i)}</bdi>
                      </p>
                      <p className="film-line film-line-lead">{t("line.finale")}</p>
                      <h2 className="hero-title film-final-title" aria-label={th(`title.${HERO_LINE}.label`)}>
                        <span className="hero-line" aria-hidden="true">
                          {th("titleLine1")}
                        </span>
                        <span className="hero-line" aria-hidden="true">
                          <b>{th(`title.${HERO_LINE}.line2`)}</b>
                        </span>
                      </h2>
                      <div className="hero-actions">
                        <ButtonLink href={contactCategoryHref("events-hospitality")} arrow data-cursor="">
                          {th("cta")}
                        </ButtonLink>
                      </div>
                    </>
                  ) : category ? (
                    <>
                      <p className="film-count">
                        <bdi dir="ltr">{sceneCounter(i)}</bdi>
                      </p>
                      <h2 className="film-cat">{category.title[locale]}</h2>
                      <p className="film-line">{t(`line.${beat.key}`)}</p>
                      <Link href={categoryHref(category.slug)} className="film-go">
                        {t("explore", { name: category.title[locale] })}
                        <ArrowRight aria-hidden="true" strokeWidth={1.25} className="size-4 rtl:-scale-x-100" />
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      {/* Where "Skip the film" lands: the next section follows. */}
      <div id="after-film" tabIndex={-1} className="film-after" />
    </>
  );
}

/** A scene's plate: the 9:16 crop below 900px (art direction), lazy except the opening's. */
function FilmPicture({ beat, eager }: { beat: FilmBeat; eager: boolean }) {
  const m = media(beat.plate);
  if (!m) return null;
  const common = {
    alt: "",
    fill: true,
    sizes: "100vw",
    ...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {}),
  };
  const { props } = getImageProps({ ...common, src: m.file, className: "film-img" });
  const mobile = m.mobile ? getImageProps({ ...common, src: m.mobile.file }).props : null;
  return (
    <picture>
      {mobile && <source media="(max-width: 899.98px)" srcSet={capSrcSet(mobile.srcSet, m.mobile?.width)} sizes="100vw" />}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps output (decorative); the srcset is trimmed (D51) */}
      <img {...props} srcSet={capSrcSet(props.srcSet, m.width)} />
    </picture>
  );
}
