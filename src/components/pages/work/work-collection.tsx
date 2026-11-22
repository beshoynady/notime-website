import { getTranslations } from "next-intl/server";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { ClosingCta } from "@/components/sections/closing-cta/closing-cta";
import { SectionRef } from "@/components/review/section-ref";
import { JsonLd } from "@/components/seo/json-ld";
import { MediaImage } from "@/components/ui/media-image";
import { SITE_URL } from "@/config/site";
import { BREADCRUMB_LABELS, getCategory, workHref, WORK_INDEX_HREF, type Locale } from "@/content";
import { collectionPhotos, type WorkCollection } from "@/content/work";
import { Link } from "@/i18n/navigation";
import { trailJsonLd } from "@/lib/jsonld";
import { PAGE_REF } from "@/lib/review";
import { CopyLink } from "./copy-link";
import "./work.css";

/**
 * A collection page (Task 15, D164): Rand's own photos of one kind of work, at their own URL so they
 * can be shared. The opening says only what the photos show; the gallery keeps each photo's own
 * shape (CSS columns, which follow the reading direction in Arabic) and its alt text.
 */
export async function WorkCollectionPage({ collection, locale }: { collection: WorkCollection; locale: Locale }) {
  const [t, tc, tl, ti, th] = await Promise.all([
    getTranslations("workCollection"),
    getTranslations("workCase"),
    getTranslations("copyLink"),
    getTranslations("workIndex"),
    getTranslations("header"),
  ]);
  const photos = collectionPhotos(collection) ?? [];
  const label = collection.label[locale];
  const path = workHref(collection.slug);

  return (
    <main id="main" className="wc wcol">
      <JsonLd
        data={[
          trailJsonLd(
            [
              { name: BREADCRUMB_LABELS.work[locale], path: WORK_INDEX_HREF },
              { name: label, path },
            ],
            locale,
            SITE_URL,
          ),
        ]}
      />

      <section data-tone="dark" aria-labelledby="wc-title" className="pg-open wcol-open" data-cta-opening="">
        <SectionRef id={PAGE_REF.collectionOpening} />
        <div className="frame">
          <PageCrumbs trail={[{ href: WORK_INDEX_HREF, label: BREADCRUMB_LABELS.work[locale] }]} current={label} />
          <p className="wc-eyebrow text-eyebrow">{collection.categories.map((c) => getCategory(c)!.title[locale]).join(" · ")}</p>
          <h1 id="wc-title" className="text-h1 wc-title">
            {label}
          </h1>
          <p className="wc-summary text-lead">{collection.summary[locale]}</p>
          <CopyLink labels={{ copy: tl("copy"), copied: tl("copied"), failed: tl("failed") }} />
        </div>
      </section>

      <section data-tone="dark" aria-label={t("photosLabel")} className="wcol-gallery">
        <SectionRef id={PAGE_REF.collectionGallery} />
        <div className="frame">
          <ul className="wcol-grid">
            {photos.map((p) => (
              <li key={p.id} className="wcol-item" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                <MediaImage entry={p} locale={locale} sizes="(min-width: 1100px) 400px, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
          <p className="wk-note">{t("note")}</p>
          <p className="wk-reset">
            <Link href={WORK_INDEX_HREF} className="text-link">
              {t("more")}
            </Link>
          </p>
        </div>
      </section>

      <ClosingCta id="wcol-closing" title={tc("ctaTitle")} body={ti("closing.body")} href={QUOTE_LINK.href} label={th("quote")} tone="light" />
    </main>
  );
}
