import type { Metadata } from "next";
import { SoftwarePage } from "@/components/software/software-page";
import { categoryHref, getCategory, type Locale } from "@/content";
import { seo } from "@/content/software/page";
import { localeAlternates } from "@/lib/seo";

/**
 * Software & Digital (D91) on its own static route (Task 16, D111). A static segment wins over
 * `[category]`, so the URL is unchanged; the gain is the bundle: Turbopack builds one client
 * chunk group per route, and while this page lived in `[category]` its forms (zod and
 * react-hook-form, ~52 KB gzipped) loaded on the four other category pages too.
 */
const SLUG = "software-digital";

export async function generateMetadata({ params }: PageProps<"/[locale]/services/software-digital">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    // Its search intents (D91 brief, SEO): its own title and description.
    title: { absolute: seo.title[locale] },
    description: seo.description[locale],
    alternates: localeAlternates(locale, categoryHref(SLUG)),
  };
}

export default async function Page({ params }: PageProps<"/[locale]/services/software-digital">) {
  const locale = (await params).locale as Locale;
  return <SoftwarePage category={getCategory(SLUG)!} locale={locale} />;
}
