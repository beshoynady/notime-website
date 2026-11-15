import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkCase } from "@/components/pages/work/work-case";
import { workHref, type Locale } from "@/content";
import { getWorkBySlug, workItems, workView } from "@/content/work";
import { localeAlternates } from "@/lib/seo";

/** The case pages (F1), prerendered; any other slug 404s on the first request (D68). */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return workItems.map((w) => ({ slug: w.slug }));
}

async function resolve(params: PageProps<"/[locale]/work/[slug]">["params"]) {
  const { locale, slug } = await params;
  const item = getWorkBySlug(slug);
  if (!item) notFound();
  return { locale: locale as Locale, item };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, item } = await resolve(params);
  const view = workView(item);
  return { title: view.label[locale], description: view.summary[locale], alternates: localeAlternates(locale, workHref(item.slug)) };
}

export default async function WorkCasePage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, item } = await resolve(params);
  return <WorkCase item={item} locale={locale} />;
}
