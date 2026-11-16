import { getProducts, productLockup, type Locale } from "@/content";
import { PRODUCT_IDS, type ProductId } from "@/content/product-pages";
import { productsCopy } from "@/content/software/page";
import { ogImage, ogMeta } from "@/lib/og-image";

/** A product's share image (D103): its lockup and summary. */
type Params = Promise<{ locale: string; product: string }>;

const productOf = (id: string) =>
  PRODUCT_IDS.includes(id as ProductId) ? getProducts().find((p) => p.slug === productsCopy.items[id as ProductId].slug) : undefined;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale, product } = await params;
  const p = productOf(product);
  return ogMeta(p ? productLockup(p, locale as Locale) : undefined);
}

export default async function Image({ params }: { params: Params }) {
  const { locale: l, product } = await params;
  const locale = l as Locale;
  const p = productOf(product);
  if (!p) return new Response(null, { status: 404 });
  return ogImage({ locale, title: productLockup(p, locale), summary: p.summary[locale] });
}
