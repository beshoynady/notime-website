import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Logo lockup: "NO TIME" (600, +0.28em) over "CREATIVE HOUSE" (300, +0.42em).
 * The brand name stays in Latin script in both languages.
 */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  const t = useTranslations("brand");
  return (
    <Link href="/" aria-label={t("homeLabel")} onClick={onClick} className={cn("flex min-h-11 flex-col justify-center leading-none no-underline", className)}>
      <span lang="en" className="text-base font-semibold tracking-[0.28em]">
        {t("name")}
      </span>
      <span lang="en" className="mt-[5px] text-[0.56rem] font-light tracking-[0.42em] uppercase opacity-75">
        {t("tagline")}
      </span>
    </Link>
  );
}
