import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { WorkIndex } from "@/components/pages/work/work-index";
import { getCategories, getCategory, WORK_INDEX_HREF, type Locale } from "@/content";
import { markets } from "@/content/markets";
import { localeAlternates } from "@/lib/seo";
import { allFacetSegments, filterHref, parseFacets } from "@/lib/work-filter";

/**
 * The Work index filtered by service category and/or market (F1, D88): one static page per
 * combination, so the chips are plain links that work without JavaScript and can be shared.
 * Any other path 404s on the first request (`ensureStatic`, as the category route, D68).
 * Not indexed: each view is a subset of /work, which stays the canonical listing.
 */
export const ensureStatic = "navigation";

const CATEGORY_SLUGS = getCategories().map((c) => c.slug);

export function generateStaticParams() {
  return allFacetSegments(
    CATEGORY_SLUGS,
    markets.map((m) => m.key),
  ).map((facets) => ({ facets }));
}

async function resolve(params: PageProps<"/[locale]/work/filter/[...facets]">["params"]) {
  const { locale, facets } = await params;
  const filter = parseFacets(facets, CATEGORY_SLUGS);
  if (!filter) notFound();
  return { locale: locale as Locale, filter };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/filter/[...facets]">): Promise<Metadata> {
  const { locale, filter } = await resolve(params);
  const [t, tm] = await Promise.all([getTranslations({ locale, namespace: "workIndex" }), getTranslations({ locale, namespace: "markets" })]);
  const parts = [filter.category && getCategory(filter.category)!.title[locale], filter.market && tm(`countries.${filter.market}`)].filter(Boolean);
  return {
    title: t("metaFiltered", { filter: parts.join(" · ") }),
    description: t("metaDescription"),
    alternates: { ...localeAlternates(locale, filterHref(filter)), canonical: `/${locale}${WORK_INDEX_HREF}` },
    robots: { index: false, follow: true },
  };
}

export default async function WorkFilterPage({ params }: PageProps<"/[locale]/work/filter/[...facets]">) {
  const { locale, filter } = await resolve(params);
  return <WorkIndex locale={locale} filter={filter} />;
}
