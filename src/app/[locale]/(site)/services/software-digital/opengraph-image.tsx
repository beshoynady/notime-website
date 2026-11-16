import { getCategory, type Locale } from "@/content";
import { orderNumeral } from "@/lib/roman";
import { ogImage, ogMeta } from "@/lib/og-image";

/** Software & Digital's share image, as every category's (services/[category]/opengraph-image.tsx). */
type Params = Promise<{ locale: string }>;
const category = getCategory("software-digital")!;

export async function generateImageMetadata({ params }: { params: Params }) {
  return ogMeta(category.title[(await params).locale as Locale]);
}

export default async function Image({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  return ogImage({ locale, kicker: orderNumeral(category.order, locale), title: category.title[locale], summary: category.summary[locale] });
}
