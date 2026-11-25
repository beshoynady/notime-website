import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { InterestForm } from "@/components/forms/interest-form";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { SectionRef } from "@/components/review/section-ref";
import { JsonLd } from "@/components/seo/json-ld";
import { InvitelyScreens, SmartMenuScreens } from "@/components/software/product-screens";
import { ButtonArrow, buttonVariants } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { SITE_URL } from "@/config/site";
import { categoryHref, getCategory, getProducts, productHref, type Locale } from "@/content";
import { media } from "@/content/media";
import { productPages, type ProductId } from "@/content/product-pages";
import { productsCopy } from "@/content/software/page";
import { Link } from "@/i18n/navigation";
import { trailJsonLd } from "@/lib/jsonld";
import { PAGE_REF } from "@/lib/review";
import { cn } from "@/lib/utils";
import "@/components/category/category.css";
import "@/components/software/software.css";
import "./product.css";

const REGISTER_ID = "register";

/** The product as products.ts and the Software page's block describe it, for one page id. */
export function productFor(id: ProductId) {
  const slug = productsCopy.items[id].slug;
  return getProducts().find((p) => p.slug === slug)!;
}

/**
 * A product page (F4), in the Software page's Interface theme: the problem, 4–6 features, the
 * concept screens labelled "Preview" with "Example" data, status Coming soon, and "Register
 * interest" on the interest form (D92 `submitInterest`; delivery is a stub until step 5, so a valid
 * submit shows the designed success state). No price, date or capacity claims.
 */
export async function ProductPage({ id, locale }: { id: ProductId; locale: Locale }) {
  const [t, tc] = await Promise.all([getTranslations("productPage"), getTranslations("common")]);
  const page = productPages[id];
  const product = productFor(id);
  const copy = productsCopy.items[id];
  const name = product.name[locale];
  const other = productFor(page.other);
  const software = getCategory("software-digital")!;
  const hook = id === "invitely" ? t("hookInvitely") : t("hookSmartMenu");
  const photo = media(page.photo);

  return (
    <main id="main" data-theme={software.theme} className="sw-page pp">
      <JsonLd
        data={[
          trailJsonLd(
            [
              { name: software.title[locale], path: categoryHref(software.slug) },
              { name, path: productHref(id) },
            ],
            locale,
            SITE_URL,
          ),
        ]}
      />

      <section data-tone="light" aria-labelledby="pp-title" className="pg-open pp-hero" data-cta-opening="">
        <SectionRef id={PAGE_REF.productHero} />
        <div className="frame">
          <PageCrumbs trail={[{ href: categoryHref(software.slug), label: software.title[locale] }]} current={name} />
          <div className="pp-hero-grid">
            <div className="pp-hero-text">
              <p className="pp-status">
                <span className="badge badge-soon badge-md">{tc("comingSoon")}</span>
                <span className="sw-block-kicker">{product.descriptor[locale]}</span>
              </p>
              <h1 id="pp-title" className="pp-title">
                {name}
              </h1>
              <p className="pp-hook">{hook}</p>
              <p className="sw-lead">{product.summary[locale]}</p>
              <a href={`#${REGISTER_ID}`} className={cn(buttonVariants({ variant: "dark" }), "pp-cta")}>
                <span>{t("registerCta")}</span>
                <ButtonArrow />
              </a>
            </div>
            <figure className="pp-visual">
              <SectionRef id={PAGE_REF.productScreens} />
              <span className="sw-product-tags">
                <span className="sw-tag sw-tag-fill">{tc("preview")}</span>
                <span className="sw-tag">{tc("example")}</span>
              </span>
              {id === "invitely" ? <InvitelyScreens locale={locale} /> : <SmartMenuScreens locale={locale} />}
              <figcaption className="pp-visual-note">{t("screensNote")}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* The problem over the place it happens (Task 14, D162): the door, the pass at rush. Below the
          first screen, so the photo never competes with the text for LCP; decorative, lazy. */}
      <section
        data-tone={photo ? "dark" : "light"}
        data-grain={photo ? "off" : undefined}
        data-photo={photo ? "" : undefined}
        aria-labelledby="pp-problem"
        className="sw-section pp-problem"
      >
        <SectionRef id={PAGE_REF.productProblem} />
        {photo && (
          <div className="pp-problem-photo">
            <MediaImage entry={photo} locale={locale} decorative sizes="100vw" />
          </div>
        )}
        <div className="frame pp-split">
          <h2 id="pp-problem" className="sw-mini-label">
            {t("problemTitle")}
          </h2>
          <div>
            <p className="sw-h2 pp-problem-line">{copy.problem[locale]}</p>
            <p className="sw-lead pp-problem-detail">{page.problemDetail[locale]}</p>
          </div>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="pp-features" className="sw-section pp-features">
        <SectionRef id={PAGE_REF.productFeatures} />
        <div className="frame pp-split">
          <h2 id="pp-features" className="sw-mini-label">
            {t("featuresTitle")}
          </h2>
          <ul className="pp-feature-list">
            {page.features.map((f) => (
              <li key={f.title.en} className="pp-feature">
                <h3 className="pp-feature-title">{f.title[locale]}</h3>
                <p className="pp-feature-line">{f.line[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={REGISTER_ID} data-tone="light" aria-labelledby="pp-register" className="sw-section pp-register">
        <SectionRef id={PAGE_REF.productInterest} />
        <div className="frame pp-register-grid">
          <header className="pp-register-head">
            <span className="badge badge-soon badge-md">{tc("comingSoon")}</span>
            <h2 id="pp-register" className="sw-h2">
              {t("registerTitle", { product: name })}
            </h2>
            <p className="sw-lead">{t("registerBody")}</p>
          </header>
          <div className="pp-form">
            <InterestForm locale={locale} source={id} product={id} productName={name} />
          </div>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="pp-other" className="sw-section pp-other">
        <SectionRef id={PAGE_REF.productOther} />
        <div className="frame pp-other-grid">
          <div className="pp-other-card">
            <h2 id="pp-other" className="sw-mini-label">
              {t("otherProduct")}
            </h2>
            <p className="pp-other-name">
              <Link href={productHref(page.other)} className="pp-other-link">
                {other.name[locale]}
                <span className="pp-other-desc"> · {other.descriptor[locale]}</span>
              </Link>
            </p>
            <p className="pp-other-summary">{other.summary[locale]}</p>
            <ArrowRight aria-hidden="true" strokeWidth={1.25} className="pp-other-arrow rtl:-scale-x-100" />
          </div>
          <Link href={categoryHref(software.slug)} className="text-link">
            {t("softwareLink")}
          </Link>
        </div>
      </section>
    </main>
  );
}
