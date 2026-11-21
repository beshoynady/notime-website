import type { Locale } from "@/content";
import { getWorkBySlug, workView } from "@/content/work";
import { ogImage, ogMeta } from "@/lib/og-image";

/** A case's share image (D103): its label and summary, named or anonymous as the page shows it. */
type Params = Promise<{ locale: string; slug: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const item = getWorkBySlug(slug);
  return ogMeta(item ? workView(item).label[locale as Locale] : undefined);
}

export default async function Image({ params }: { params: Params }) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const item = getWorkBySlug(slug);
  if (!item) return new Response(null, { status: 404 });
  const view = workView(item);
  return ogImage({ locale, kicker: locale === "ar" ? "من أعمالنا" : "SELECTED WORK", title: view.label[locale], summary: view.summary[locale] });
}
