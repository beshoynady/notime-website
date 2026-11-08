import { getLocale, getTranslations } from "next-intl/server";
import { BrandImage } from "@/components/ui/brand-image";
import { Numeral } from "@/components/ui/numeral";
import type { Category, Locale } from "@/content";
import { toRoman } from "@/lib/roman";
import { Breadcrumbs } from "./breadcrumbs";
import { THEME_TONE } from "./theme";

/**
 * Category page · hero shell (spec §4, part 1): breadcrumbs, eyebrow (numeral · service count),
 * H1, intro and the 16:9 category image, the page's only eager image. Static here; each theme
 * dresses and animates its own hero later (Task 3.2 and the CP8–CP11 tasks).
 */
export async function CategoryHero({ category, serviceCount }: { category: Category; serviceCount: number }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("megaMenu");
  return (
    <section data-tone={THEME_TONE[category.theme]} aria-labelledby="category-title" className="cat-hero">
      <div className="frame">
        <Breadcrumbs current={category.title[locale]} />
        <div className="cat-hero-head">
          <div>
            <p className="sec-eyebrow text-eyebrow cat-hero-eyebrow">
              <span>
                <Numeral>{toRoman(category.order)}</Numeral>
                <span aria-hidden="true"> · </span>
                {t("count", { count: serviceCount })}
              </span>
            </p>
            <h1 id="category-title" className="text-h1">
              {category.title[locale]}
            </h1>
          </div>
          {/* TODO: replace placeholder — category intros are written per category (Task 3.1 and later). */}
          <p className="cat-hero-intro text-lead">{category.intro[locale]}</p>
        </div>
        <BrandImage
          slot={category.imageWide}
          sizes="(min-width: 1280px) 1200px, (min-width: 760px) calc(100vw - 80px), calc(100vw - 32px)"
          priority
          className="cat-hero-image"
        />
      </div>
    </section>
  );
}
