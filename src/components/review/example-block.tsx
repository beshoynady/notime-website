import { getLocale } from "next-intl/server";
import type { Locale } from "@/content";
import type { ExampleKind } from "@/content/review/examples";
import type { SectionRefId } from "@/lib/review";

/**
 * A trust block that production hides until the real material exists (D78), shown in review mode
 * with badged example content. Production renders nothing and never loads the example module.
 */
export async function ExampleBlock({ kind, refId, tone = "light" }: { kind: ExampleKind; refId: SectionRefId; tone?: "light" | "dark" }) {
  if (process.env.NEXT_PUBLIC_REVIEW_MODE !== "1") return null;
  const [{ ExampleContent }, locale] = await Promise.all([import("./example-content"), getLocale() as Promise<Locale>]);
  return <ExampleContent kind={kind} refId={refId} tone={tone} locale={locale} />;
}
