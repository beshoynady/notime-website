import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { SERVICES_HREF } from "@/components/layout/nav-links";
import { BrandImage } from "@/components/ui/brand-image";
import { getCategories, getServices, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { toRoman } from "@/lib/roman";
import { CategoryCardsScroll } from "./category-cards-scroll";
import "./categories.css";

/**
 * Expanding category cards (approved in the styleguide). Desktop: the hovered or focused card
 * widens (CSS flex-grow, 0.9s). Phone: the card in view opens as you scroll (ScrollTrigger
 * toggles a class; CSS does the transition). The numeral is the category's fixed order.
 */
export async function CategoryCards() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("categories");
  return (
    <CategoryCardsScroll>
      {getCategories().map((c, i) => (
        // TODO: replace placeholder — link to the category page once the Phase 2 routes exist.
        <Link key={c.slug} href={SERVICES_HREF} className={i === 0 ? "cat is-on" : "cat"}>
          <div className="cat-media">
            {/* Open card: about 55% of the 1280px frame (≈ 700px); closed or stacked: full width on phones. */}
            <BrandImage slot={c.image} fill sizes="(min-width: 1280px) 700px, (min-width: 900px) 55vw, 100vw" />
          </div>
          <div className="cat-txt">
            <span className="cat-num tabular" aria-hidden="true">
              {toRoman(c.order)}
            </span>
            <h3>{c.title[locale]}</h3>
            <div className="cat-fold">
              <ul role="list">
                {getServices(c.slug)
                  .slice(0, 3)
                  .map((s) => (
                    <li key={s.slug}>{s.title[locale]}</li>
                  ))}
              </ul>
              <span className="cat-more">
                {t("viewServices")}
                <ArrowRight aria-hidden="true" strokeWidth={1.25} className="size-3.5 rtl:-scale-x-100" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </CategoryCardsScroll>
  );
}
