import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkCase } from "@/components/pages/work/work-case";
import { WorkCollectionPage } from "@/components/pages/work/work-collection";
import { workHref, type Locale } from "@/content";
import { getCollectionBySlug, getWorkBySlug, workCards, workView } from "@/content/work";
import { localeAlternates } from "@/lib/seo";

/** The case and collection pages (F1, D164), prerendered; any other slug 404s on the first request (D68). */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return workCards().map((w) => ({ slug: w.slug }));
}

async function resolve(params: PageProps<"/[locale]/work/[slug]">["params"]) {
  const { locale, slug } = await params;
  const item = getWorkBySlug(slug);
  const collection = item ? undefined : getCollectionBySlug(slug);
  if (!item && !collection) notFound();
  return { locale: locale as Locale, slug, item, collection };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug, item, collection } = await resolve(params);
  const { label, summary } = item ? workView(item) : collection!;
  return { title: label[locale], description: summary[locale], alternates: localeAlternates(locale, workHref(slug)) };
}

export default async function WorkSlugPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, item, collection } = await resolve(params);
  return item ? <WorkCase item={item} locale={locale} /> : <WorkCollectionPage collection={collection!} locale={locale} />;
}
