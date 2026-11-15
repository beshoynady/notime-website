import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage, productFor } from "@/components/pages/product/product-page";
import { productHref, productLockup, type Locale } from "@/content";
import { PRODUCT_IDS, type ProductId } from "@/content/product-pages";
import { localeAlternates } from "@/lib/seo";

/** The two product pages (F4), prerendered; any other id 404s on the first request (D68). */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return PRODUCT_IDS.map((product) => ({ product }));
}

async function resolve(params: PageProps<"/[locale]/products/[product]">["params"]) {
  const { locale, product } = await params;
  if (!PRODUCT_IDS.includes(product as ProductId)) notFound();
  return { locale: locale as Locale, id: product as ProductId };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[product]">): Promise<Metadata> {
  const { locale, id } = await resolve(params);
  const p = productFor(id);
  return { title: productLockup(p, locale), description: p.summary[locale], alternates: localeAlternates(locale, productHref(id)) };
}

export default async function Page({ params }: PageProps<"/[locale]/products/[product]">) {
  const { locale, id } = await resolve(params);
  return <ProductPage id={id} locale={locale} />;
}
