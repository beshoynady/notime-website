import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactPage } from "@/components/pages/contact/contact-page";
import { CONTACT_HREF, type Locale } from "@/content";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: localeAlternates(locale as Locale, CONTACT_HREF) };
}

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  return <ContactPage locale={locale as Locale} />;
}
