import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/config/site";
import { getServices, type Category, type Locale } from "@/content";
import type { SceneConfig } from "@/content/scenes";
import { categoryJsonLd } from "@/lib/jsonld";
import { orderNumeral } from "@/lib/roman";
import { CategoryFaq } from "./category-faq";
import { CategoryOpening } from "./category-opening";
import { CategoryQuote } from "./category-quote";
import { ServiceIndex } from "./service-index";
import { ServiceSection } from "./service-section";
import { END_TONE, THEME_TONE } from "./theme";
import "./category.css";
import "./themes/studio.css";
import "./themes/editorial.css";
import "./themes/workshop.css";

/**
 * A category page (D57, D64): the opening, then the six services, with the service index on a
 * track that spans both, so the rail (desktop) and the chip bar (mobile) show from the first
 * frame and stay sticky down the page (storyboards README §2).
 *
 * The track comes after the opening in the DOM (Tab: breadcrumbs, skip control, index) and is
 * the index's anchor scope (`data-anchor-scope` on the page box), so landings still count the
 * chip bar although it isn't the sections' sibling.
 *
 * Act 3 (the FAQ and the quote block) sits after the page box, so the index ends with the
 * services; its tone is the theme's END_TONE (the Evening ends light). When that tone differs, the
 * track releases the index early (`data-release="early"`), so the rail never sits on the new ground.
 *
 * Grain (dark only): one layer on the page box, not one per section, so the opening and the
 * services share one texture with no seam. A light page box has none, and light Act 3 sections
 * have none (the global rule only grains `[data-tone="dark"]`). It spans more than the viewport, which keeps it out
 * of LCP (Chrome takes a full-viewport image for background); a short static opening's own
 * grain was the LCP at 390. Hence `data-grain="off"` on the sections and the track.
 *
 * `lab` renders the hidden animatic (Task 2.9): the scene as labelled boxes, and the module
 * slots as boxes named by their module key. Public pages never pass it.
 */
export async function CategoryView({
  category,
  locale,
  scene,
  lab = false,
}: {
  category: Category;
  locale: Locale;
  scene?: SceneConfig;
  lab?: boolean;
}) {
  const services = getServices(category.slug);
  const tone = THEME_TONE[category.theme];
  const endTone = END_TONE[category.theme];
  const t = await getTranslations("category");
  const index = services.map((s) => ({ anchor: s.anchor, numeral: orderNumeral(s.order, locale), title: s.title[locale] }));
  return (
    <main id="main" data-theme={category.theme}>
      {!lab && <JsonLd data={categoryJsonLd(category, services, locale, SITE_URL)} />}
      <div className="cat-page" data-anchor-scope="" data-tone={tone}>
        <CategoryOpening
          category={category}
          serviceCount={services.length}
          firstAnchor={services[0].anchor}
          scene={scene}
          variant={lab ? "animatic" : "live"}
        />
        <div className="cat-index-track" data-tone={tone} data-grain="off" data-release={endTone !== tone ? "early" : undefined}>
          <div className="cat-index-frame frame">
            <ServiceIndex items={index} label={t("indexLabel")} />
          </div>
        </div>
        <section data-tone={tone} data-grain="off" className="cat-body">
          <div className="cat-layout frame">
            <div className="cat-sections">
              {services.map((s) => (
                <ServiceSection key={s.slug} service={s} tone={tone} lab={lab} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <CategoryFaq category={category} locale={locale} tone={endTone} />
      {/* Hidden on public pages until the quote form works (D74, P6; Task 4.2); the lab keeps it for review. */}
      {lab && <CategoryQuote category={category} services={services} locale={locale} tone={endTone} />}
    </main>
  );
}
