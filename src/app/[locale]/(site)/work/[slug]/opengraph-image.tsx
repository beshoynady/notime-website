import type { Locale } from "@/content";
import { resolveWorkSlug, workView } from "@/content/work";
import { ogImage, ogMeta } from "@/lib/og-image";

/** A case's or collection's share image (D103, D164): its label and summary, as the page shows them. */
type Params = Promise<{ locale: string; slug: string }>;

function copyFor(slug: string) {
  const found = resolveWorkSlug(slug);
  return found?.item ? workView(found.item) : found?.collection;
}

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  return ogMeta(copyFor(slug)?.label[locale as Locale]);
}

export default async function Image({ params }: { params: Params }) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const copy = copyFor(slug);
  if (!copy) return new Response(null, { status: 404 });
  return ogImage({ locale, kicker: locale === "ar" ? "من أعمالنا" : "SELECTED WORK", title: copy.label[locale], summary: copy.summary[locale] });
}
