import type { Locale } from "@/content";
import { ogImage, ogMeta, ogText } from "@/lib/og-image";

/** This page's share image (D103), from its meta title and description. */
type Params = Promise<{ locale: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  return ogMeta(ogText(locale, "contactPage.metaTitle"));
}

export default async function Image({ params }: { params: Params }) {
  const { locale } = await params;
  return ogImage({ locale: locale as Locale, title: ogText(locale, "contactPage.metaTitle"), summary: ogText(locale, "contactPage.metaDescription") });
}
