import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * The visible label on demo content (Global Constraints): "Example" on demo data. Modules render
 * it from their data's `example` flag, so it can't be forgotten.
 * Same tag style as the image label.
 */
export function ExampleLabel({ className }: { className?: string }) {
  const t = useTranslations("common");
  return <span className={cn("image-tag", className)}>{t("example")}</span>;
}
