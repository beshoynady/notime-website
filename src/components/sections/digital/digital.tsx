import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionRef } from "@/components/review/section-ref";
import { Badge } from "@/components/ui/badge";
import { categoryHref, getProducts, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { HOME_REF } from "@/lib/review";
import "./digital.css";

const CAPABILITIES = ["websites", "apps", "systems", "ecommerce"] as const;

/**
 * Home · Beyond events: Digital solutions (H-06, light). Visually distinct: the Interface theme's
 * ground (an 8px taupe grid) and UI-label type (category-pages.md §5.5), so it reads as the
 * software side of the house. Four capabilities, then the two products (D78 names) as cards
 * marked "Coming soon", kept apart from the capabilities so they're never read as demos.
 * The product pages and the interest form come later (Tasks F3, F4): no buttons until they exist.
 */
export async function Digital() {
  const [t, tc, locale] = await Promise.all([getTranslations("digital"), getTranslations("common"), getLocale() as Promise<Locale>]);
  const products = getProducts();
  return (
    <section id="digital" data-tone="light" aria-labelledby="digital-title" className="digital section-pad">
      <SectionRef id={HOME_REF.digital} />
      <div className="frame">
        <header className="digital-head">
          <div>
            <p className="sec-eyebrow text-eyebrow text-cocoa">{t("eyebrow")}</p>
            <h2 id="digital-title" className="text-h1">
              {t("headingLead")} <b>{t("headingKey")}</b>
            </h2>
          </div>
          <p className="digital-intro text-lead">{t("intro")}</p>
        </header>

        <ul className="digital-caps">
          {CAPABILITIES.map((k) => (
            <li key={k} className="digital-cap">
              <h3 className="digital-cap-title">{t(`capabilities.${k}.title`)}</h3>
              <p>{t(`capabilities.${k}.body`)}</p>
            </li>
          ))}
        </ul>

        <div className="digital-products">
          <div className="digital-products-head">
            <h3 className="text-eyebrow text-cocoa">{t("productsEyebrow")}</h3>
            <p>{t("productsIntro")}</p>
          </div>
          <ul className="digital-product-list">
            {products.map((p) => (
              <li key={p.slug} className="digital-product">
                <Badge tone="soon" size="sm">
                  {tc("comingSoon")}
                </Badge>
                <h4 className="digital-product-name">{p.name[locale]}</h4>
                <p className="digital-product-desc">{p.descriptor[locale]}</p>
                <p className="digital-product-summary">{p.summary[locale]}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="digital-foot">
          <Link href={categoryHref("software-digital")} className="text-link">
            {t("explore")}
            <ArrowRight aria-hidden="true" strokeWidth={1.25} className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
