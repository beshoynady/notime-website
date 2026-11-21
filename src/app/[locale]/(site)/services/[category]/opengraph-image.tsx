import { getCategory, type CategorySlug, type Locale } from "@/content";
import { orderNumeral } from "@/lib/roman";
import { ogImage, ogMeta } from "@/lib/og-image";

/** A category's share image (D57): its numeral, title and summary (src/lib/og-image.tsx). */
type Params = Promise<{ locale: string; category: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale, category } = await params;
  return ogMeta(getCategory(category as CategorySlug)?.title[locale as Locale]);
}

export default async function Image({ params }: { params: Params }) {
  const { locale: l, category } = await params;
  const locale = l as Locale;
  const c = getCategory(category as CategorySlug);
  if (!c) return new Response(null, { status: 404 });
  return ogImage({ locale, kicker: orderNumeral(c.order, locale), title: c.title[locale], summary: c.summary[locale] });
}
