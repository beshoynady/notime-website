import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import type { Locale } from "@/content/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata("terms", locale as Locale);
}

export default async function Page({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  return <LegalPage slug="terms" locale={locale as Locale} />;
}
