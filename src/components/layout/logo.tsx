import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
// The supplied logo PNGs vectorised as-is (scripts/vectorise-logos.mjs, D88 (6)): same artwork,
// same colours, checked against the PNGs. On dark grounds the wordmark (the lockup without the
// "CREATIVE HOUSE" line, which is too low-contrast there at this size) in the lockup's own box,
// so a tone switch never moves the letters. next/image serves SVGs unoptimized.
// TODO: replace placeholder — swap for the designer's SVGs when they arrive (CONTENT_CHECKLIST #14).
import logoOnDark from "../../../public/images/brand/logo/logo-dark-bg-wordmark.svg";
import logoOnLight from "../../../public/images/brand/logo/logo-light-bg.svg";

/** Rendered width at 1x (128px on phones, 150px from 900px; see the class below). */
const WIDTH = 150;

/**
 * Brand logo linking home.
 * - `tone="auto"` (header): both variants render; CSS shows the one matching
 *   `#site-header[data-header-tone]` (globals.css, "Logo variants").
 * - `tone="dark" | "light"`: the background it sits on.
 */
export function Logo({
  tone = "auto",
  className,
  onClick,
}: {
  tone?: "auto" | "dark" | "light";
  className?: string;
  onClick?: () => void;
}) {
  const t = useTranslations("brand");
  const img = (src: typeof logoOnDark, cls: string) => (
    <Image
      src={src}
      alt={t("logoAlt")}
      width={WIDTH}
      loading="eager"
      className={cn("block h-auto w-[128px] min-[900px]:w-[150px]", cls)}
    />
  );
  return (
    <Link
      href="/"
      aria-label={t("homeLabel")}
      onClick={onClick}
      className={cn("flex min-h-11 items-center no-underline", className)}
    >
      {tone !== "light" && img(logoOnDark, tone === "auto" ? "logo-on-dark" : "")}
      {tone !== "dark" && img(logoOnLight, tone === "auto" ? "logo-on-light" : "")}
    </Link>
  );
}
