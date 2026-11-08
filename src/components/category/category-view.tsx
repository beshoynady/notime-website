import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/config/site";
import { getServices, type Category, type Locale } from "@/content";
import type { SceneConfig } from "@/content/scenes";
import { categoryJsonLd } from "@/lib/jsonld";
import { toRoman } from "@/lib/roman";
import { CategoryOpening } from "./category-opening";
import { ServiceIndex } from "./service-index";
import { ServiceSection } from "./service-section";
import { THEME_TONE } from "./theme";
import "./category.css";

/**
 * A category page (D57, D64): the opening, then the six services, with the service index on a
 * track that spans both, so the rail (desktop) and the chip bar (mobile) show from the first
 * frame and stay sticky down the page (storyboards README §2).
 *
 * The track comes after the opening in the DOM (Tab: breadcrumbs, skip control, index) and is
 * the index's anchor scope (`data-anchor-scope` on the page box), so landings still count the
 * chip bar although it isn't the sections' sibling.
 *
 * Grain (dark themes): one layer on the page box, not one per section, so the opening and the
 * services share one texture with no seam. It spans more than the viewport, which keeps it out
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
  const t = await getTranslations("category");
  const index = services.map((s) => ({ anchor: s.anchor, numeral: toRoman(s.order), title: s.title[locale] }));
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
        <div className="cat-index-track" data-tone={tone} data-grain="off">
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
      {/* TODO: replace placeholder — FAQ and the quote block (#quote) arrive in Task 2.5. */}
    </main>
  );
}
