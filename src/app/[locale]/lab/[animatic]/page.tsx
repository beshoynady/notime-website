import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/category/category-view";
import { getCategory, type Locale } from "@/content";
import { DRAFT_SCENE, getScene, LAB_IDS, labCategory } from "@/content/scenes";

/**
 * The hidden animatic route (Task 2.9; D64): `/[locale]/lab/<id>-animatic` renders a category
 * page with its scene as labelled boxes and its modules as named boxes, for reviewing rhythm and
 * layout before any image exists. A category without an approved scene shows the draft template.
 *
 * Off unless the build sets NEXT_PUBLIC_ENABLE_LAB=1 (a 404 otherwise). Never indexed, never in
 * the sitemap (sitemap.test.ts), never linked.
 */
const enabled = () => process.env.NEXT_PUBLIC_ENABLE_LAB === "1";

/** All five, always: under Cache Components an empty list is a build error; `enabled` gates the render. */
export function generateStaticParams() {
  return Object.keys(LAB_IDS).map((id) => ({ animatic: `${id}-animatic` }));
}

async function resolve(params: PageProps<"/[locale]/lab/[animatic]">["params"]) {
  const { locale, animatic } = await params;
  const slug = labCategory(animatic);
  const category = slug && getCategory(slug);
  if (!enabled() || !category) notFound();
  return { locale: locale as Locale, category };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/lab/[animatic]">): Promise<Metadata> {
  const { locale, category } = await resolve(params);
  return { title: category.title[locale], robots: { index: false, follow: false } };
}

export default async function LabPage({ params }: PageProps<"/[locale]/lab/[animatic]">) {
  const { locale, category } = await resolve(params);
  return <CategoryView category={category} locale={locale} scene={getScene(category.slug) ?? DRAFT_SCENE} lab />;
}
