import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/category/category-view";
import { categoryHref, getCategories, getCategory, type CategorySlug, type Locale } from "@/content";
import { getScene } from "@/content/scenes";
import { localeAlternates } from "@/lib/seo";

/**
 * The five category pages (D57), prerendered. Under Cache Components `dynamicParams` is not
 * available. `ensureStatic = "navigation"` makes any other slug wait for its complete render
 * instead of getting the App Shell with a 200, so resolve()'s notFound() is a real 404 on the
 * first request (D68).
 */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

async function resolve(params: PageProps<"/[locale]/services/[category]">["params"]) {
  const { locale, category: slug } = await params;
  const category = getCategory(slug as CategorySlug);
  if (!category) notFound();
  return { locale: locale as Locale, category };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[category]">): Promise<Metadata> {
  const { locale, category } = await resolve(params);
  return {
    title: category.title[locale],
    description: category.summary[locale],
    alternates: localeAlternates(locale, categoryHref(category.slug)),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/services/[category]">) {
  const { locale, category } = await resolve(params);
  return <CategoryView category={category} locale={locale} scene={getScene(category.slug)} />;
}
