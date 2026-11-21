import type { Locale } from "@/content";
import { ogImage, ogMeta, ogText } from "@/lib/og-image";

/** The default share image (D103): the home page's line and lead. Pages without their own inherit it. */
type Params = Promise<{ locale: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  return ogMeta(ogText(locale, "hero.title.create.label"));
}

export default async function Image({ params }: { params: Params }) {
  const { locale } = await params;
  return ogImage({ locale: locale as Locale, title: ogText(locale, "hero.title.create.label"), summary: ogText(locale, "hero.lead") });
}
