import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WorkIndex } from "@/components/pages/work/work-index";
import { WORK_INDEX_HREF, type Locale } from "@/content";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workIndex" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: localeAlternates(locale as Locale, WORK_INDEX_HREF) };
}

/** /work: every case (F1). The filtered views are /work/filter/… (static pages, work-filter.ts). */
export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  return <WorkIndex locale={locale as Locale} filter={{}} />;
}
