import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CaseMedia } from "@/components/pages/case-media";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { SectionRef } from "@/components/review/section-ref";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { SITE_URL } from "@/config/site";
import { BREADCRUMB_LABELS, getCategories, getCategory, SERVICES_INDEX_HREF, workHref, WORK_INDEX_HREF, type Locale } from "@/content";
import { markets } from "@/content/markets";
import { RELATED_WORK_COPY } from "@/content/related-work";
import { workItems, workView } from "@/content/work";
import { Link } from "@/i18n/navigation";
import { trailJsonLd } from "@/lib/jsonld";
import { PAGE_REF } from "@/lib/review";
import { applyFilter, facetChips, filterHref, type Chip, type WorkFilter } from "@/lib/work-filter";
import "@/components/motion/duotone.css";
import "./work.css";

const FILTERS_ID = "filters";
const CATEGORY_SLUGS = getCategories().map((c) => c.slug);
const MARKET_KEYS = markets.map((m) => m.key);

/**
 * /work and its filtered views (F1). The chips are plain links to static pages (work-filter.ts),
 * each landing back on the filter bar, so the page works without JavaScript and every view can be
 * shared. A chip whose count is 0 under the other facet is shown but not linked (no dead end); a
 * view with no case shows the empty state, which points to all work and to the services.
 */
export async function WorkIndex({ locale, filter }: { locale: Locale; filter: WorkFilter }) {
  const [t, tw, tm] = await Promise.all([getTranslations("workIndex"), getTranslations("work"), getTranslations("markets")]);
  const cases = applyFilter(workItems, filter).map((w) => ({ item: w, view: workView(w) }));
  const chips = facetChips(workItems, filter, CATEGORY_SLUGS, MARKET_KEYS);
  const categoryName = (c: (typeof CATEGORY_SLUGS)[number]) => getCategory(c)!.title[locale];
  const filtered = Boolean(filter.category || filter.market);

  return (
    <main id="main" className="wk">
      <JsonLd data={[trailJsonLd([{ name: BREADCRUMB_LABELS.work[locale], path: WORK_INDEX_HREF }], locale, SITE_URL)]} />
      <section data-tone="dark" aria-labelledby="wk-title" className="wk-head pg-open">
        <SectionRef id={PAGE_REF.workHead} />
        <div className="frame">
          <PageCrumbs current={BREADCRUMB_LABELS.work[locale]} />
          <div className="wk-head-grid">
            <div>
              <p className="sec-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
              <h1 id="wk-title" className="text-h1 wk-title">
                {t("headingLead")} <b>{t("headingKey")}</b>
              </h1>
            </div>
            <p className="wk-intro text-lead">{t("intro")}</p>
          </div>
        </div>
      </section>

      <section data-tone="dark" className="wk-browse">
        <div className="frame">
          <nav id={FILTERS_ID} aria-label={t("filterLabel")} className="wk-filters">
            <SectionRef id={PAGE_REF.workFilters} />
            <Facet id="wk-facet-service" label={t("serviceFacet")} chips={chips.category} allLabel={t("allServices")} name={categoryName} />
            <Facet id="wk-facet-market" label={t("marketFacet")} chips={chips.market} allLabel={t("allMarkets")} name={(m) => tm(`countries.${m}`)} />
          </nav>

          <SectionRef id={PAGE_REF.workList} />
          <p className="wk-count text-eyebrow">{t("count", { count: cases.length })}</p>

          {cases.length > 0 ? (
            <ul className="wk-list">
              {cases.map(({ item, view }) => {
                const titleId = `wk-case-${view.slug}`;
                return (
                  <li key={view.slug} className="wk-case">
                    <article aria-labelledby={titleId} className="wk-case-grid" data-card="">
                      <div className="wk-media">
                        <div className={view.named ? "duotone absolute inset-0" : "absolute inset-0"}>
                          <CaseMedia view={view} locale={locale} sizes="(min-width: 900px) 56vw, 100vw" />
                        </div>
                      </div>
                      <div className="wk-body">
                        <ul className="wk-meta text-eyebrow" aria-label={tw("spansLabel")}>
                          {item.categories.map((c) => (
                            <li key={c}>{categoryName(c)}</li>
                          ))}
                        </ul>
                        <h2 id={titleId} className="wk-name">
                          <Link href={workHref(view.slug)} className="wk-link">
                            {view.label[locale]}
                          </Link>
                        </h2>
                        <p className="wk-summary">{view.summary[locale]}</p>
                        <p className="wk-more" aria-hidden="true">
                          {tw("viewProject")}
                          <ArrowRight strokeWidth={1.25} className="wk-arrow rtl:-scale-x-100" />
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="wk-empty">
              <h2 className="text-h2">{t("emptyTitle")}</h2>
              <p className="text-lead">{t("emptyBody")}</p>
              <div className="wk-empty-actions">
                <ButtonLink href={WORK_INDEX_HREF} variant="primary" arrow>
                  {t("showAll")}
                </ButtonLink>
                <Link href={filter.category ? `/services/${filter.category}` : SERVICES_INDEX_HREF} className="text-link">
                  {filter.category ? categoryName(filter.category) : t("exploreServices")}
                </Link>
              </div>
            </div>
          )}

          {cases.length > 0 && (
            <p className="wk-note">
              {RELATED_WORK_COPY.note[locale]}
            </p>
          )}
          {filtered && cases.length > 0 && (
            <p className="wk-reset">
              <Link href={filterHref({})} className="text-link">
                {t("showAll")}
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

/** One facet: a labelled row of chip links; the current one carries aria-current. */
function Facet<V extends string>({ id, label, chips, allLabel, name }: { id: string; label: string; chips: Chip<V>[]; allLabel: string; name: (v: V) => string }) {
  return (
    <div className="wk-facet">
      <p id={id} className="wk-facet-label text-eyebrow">
        {label}
      </p>
      <ul aria-labelledby={id} className="wk-chips">
        {chips.map((c) => {
          const text = c.value ? name(c.value) : allLabel;
          const inner = (
            <>
              <span>{text}</span>
              <span className="wk-chip-count tabular">{c.count}</span>
            </>
          );
          return (
            <li key={c.value ?? "all"}>
              {c.count === 0 && !c.active ? (
                <span className="wk-chip" aria-disabled="true">
                  {inner}
                </span>
              ) : (
                <Link href={`${c.href}#${FILTERS_ID}`} className="wk-chip" aria-current={c.active ? "page" : undefined} scroll={false}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
