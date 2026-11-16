import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import type { Locale } from "@/content/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/cookies">): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata("cookies", locale as Locale);
}

export default async function Page({ params }: PageProps<"/[locale]/cookies">) {
  const { locale } = await params;
  return <LegalPage slug="cookies" locale={locale as Locale} />;
}
