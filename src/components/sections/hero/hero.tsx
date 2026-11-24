import { getImageProps } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { getCategories, type Locale } from "@/content";
import { contactCategoryHref, WORK_INDEX_HREF } from "@/content/links";
import { media } from "@/content/media";
import { HERO_OBJECTS } from "@/content/hero";
import { HERO_LINE } from "@/config/hero";
import { capSrcSet } from "@/lib/srcset";
import { formatTimecode } from "@/lib/time";
import { HeroController } from "./hero-controller";
import { HeroDial } from "./hero-dial";
import { SectionRef } from "@/components/review/section-ref";
import { HOME_REF } from "@/lib/review";

/**
 * Home hero (server component; D156, D173 "countdown to zero"). The whole first screen is there at
 * first paint: the header, the eyebrow, the title, the lead and both actions, centred on a gold
 * dial. Around it, one object for each of the five services. HeroController turns the clock back
 * five seconds and brings the objects in, one per second, as the visitor scrolls (desktop, a short
 * pin) or once on load (phones); Events lands last, on 12, at zero.
 *
 * The markup is the end state: no JS or reduced motion shows the dial at zero with every object
 * in place. Layers, back to front: 0 dial · 2 objects · 4 content · 5 timecode.
 */
export async function Hero() {
  const [t, locale] = await Promise.all([getTranslations("hero"), getLocale() as Promise<Locale>]);
  const objects = getCategories().flatMap((c) => {
    const m = media(HERO_OBJECTS[c.slug]);
    if (!m || m.hidden) return [];
    // Eager at low priority: the objects start outside the frame, where lazy loading never fires.
    const img = getImageProps({
      src: m.file,
      alt: "",
      width: m.width,
      height: m.height,
      sizes: "(min-width: 900px) 200px, 72px",
      loading: "eager",
      fetchPriority: "low",
    }).props;
    return [{ slug: c.slug, title: c.title[locale], img: { ...img, srcSet: capSrcSet(img.srcSet, m.width) } }];
  });
  return (
    // Server-rendered pin spacer for the desktop pin (D43): ScrollTrigger adopts it, so #hero is
    // never moved in the DOM (a re-inserted hero re-timed the title's LCP). A plain block on phones,
    // without JS and under reduced motion.
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
        <div className="hero-dial-wrap" aria-hidden="true">
          <HeroDial />
        </div>

        {/* The five services as objects; each caption names its service (the picture is decorative). */}
        <ul className="hero-objects">
          {objects.map((o, i) => (
            <li key={o.slug} className="hero-object" data-slot={i}>
              <figure>
                <span className="hero-object-img">
                  {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt ""); the srcset is trimmed (D51) */}
                  <img {...o.img} />
                </span>
                <figcaption>{o.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="hero-content frame">
          {/* A <p>, not a heading: the H1 stays the page's first heading. */}
          <p className="hero-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
          {/* The lines are decorative; the heading's name is the sentence-case label, so screen
              readers don't spell out capitals. The text sits in .hero-line-inner, which nothing
              animates (LCP, D156). */}
          <h1 id="hero-title" className="hero-title" aria-label={t(`title.${HERO_LINE}.label`)}>
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

        {/* The countdown (decorative; always LTR with tabular figures). The end state: zero. */}
        <p className="hero-tc" aria-hidden="true" dir="ltr" lang="en" data-hero-tc="">
          {formatTimecode(0)}
        </p>
      </section>
    </div>
  );
}
