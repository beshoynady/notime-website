import { getLocale } from "next-intl/server";
import { BrandImage } from "@/components/ui/brand-image";
import { getCategories, getServices, type Locale } from "@/content";
import { CategoryCardsScroll } from "./category-cards-scroll";

const NUMERALS = ["I", "II", "III", "IV", "V"] as const; // categories have a fixed order (1–5)

/**
 * Expanding category cards from the reference. Desktop: the hovered or focused card
 * widens (CSS flex-grow, 0.9s). Phone: the card in view opens as you scroll
 * (ScrollTrigger toggles a class; CSS does the transition).
 */
export async function CategoryCards() {
  const locale = (await getLocale()) as Locale;
  return (
    <CategoryCardsScroll>
      {getCategories().map((c, i) => (
        // TODO: replace placeholder — link to the category page once the Phase 2 routes exist.
        <a key={c.slug} href="#components" className={i === 0 ? "sg-cat is-on" : "sg-cat"}>
          <div className="sg-cat-media">
            <BrandImage slot={c.image} fill sizes="(min-width: 900px) 40vw, 100vw" />
          </div>
          <div className="sg-cat-txt">
            <span className="sg-cat-num tabular" aria-hidden="true">
              {NUMERALS[c.order - 1]}
            </span>
            <h3>{c.title[locale]}</h3>
            <ul role="list">
              {getServices(c.slug)
                .slice(0, 3)
                .map((s) => (
                  <li key={s.slug}>{s.title[locale]}</li>
                ))}
            </ul>
          </div>
        </a>
      ))}
    </CategoryCardsScroll>
  );
}
