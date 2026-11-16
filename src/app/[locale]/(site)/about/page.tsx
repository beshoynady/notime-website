import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutPage } from "@/components/pages/about/about-page";
import { ABOUT_HREF, type Locale } from "@/content";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: localeAlternates(locale as Locale, ABOUT_HREF) };
}

export default async function Page({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  return <AboutPage locale={locale as Locale} />;
}
