import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const KEY = { example: "example", ai: "aiExample", illustrative: "illustrative" } as const;

/**
 * The visible disclosure on demo content (Global Constraints): "Example" on demo data,
 * "AI-generated example" on AI content samples, "Illustrative" on AI images standing in for a
 * real project. Modules render it from their data's `example` flag, so it can't be forgotten.
 * Same tag style as the image label.
 */
export function ExampleLabel({ kind, className }: { kind: keyof typeof KEY; className?: string }) {
  const t = useTranslations("common");
  return <span className={cn("image-tag", className)}>{t(KEY[kind])}</span>;
}
