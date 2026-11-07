import { getImageProps } from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getImageSlot, type Aspect, type Locale } from "@/content";
import { capSrcSet } from "@/lib/srcset";
import { cn } from "@/lib/utils";
import { AiPlaceholder } from "./ai-placeholder";

const ASPECT: Record<Aspect, string> = {
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "1:1": "aspect-square",
};

interface BrandImageProps {
  /** Image slot id from src/content/images.ts. */
  slot: string;
  /** next/image `sizes`; required so the browser picks the right width. */
  sizes: string;
  /** Only the hero image may be eager. */
  priority?: boolean;
  className?: string;
  /** Let the parent control the box (e.g. absolute fill) instead of the slot's aspect ratio. */
  fill?: boolean;
}

/**
 * Renders an image slot: the real/AI file via the next/image optimizer (AVIF/WebP, lazy unless
 * `priority`), or the designed placeholder while the slot has no file.
 * The srcset is capped at the file's native width (D51), so no screen ever requests more pixels
 * than the image has; that is why this uses getImageProps instead of <Image>.
 * AI images that stand in for real past projects carry the visible "Illustrative" label.
 */
export function BrandImage({ slot, sizes, priority = false, className, fill = false }: BrandImageProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const s = getImageSlot(slot);
  const alt = s.alt[locale];
  const img = s.src
    ? getImageProps({
        src: s.src,
        alt,
        fill: true,
        sizes,
        ...(priority ? { loading: "eager", fetchPriority: "high" } : {}),
        placeholder: s.blurDataURL ? "blur" : "empty",
        blurDataURL: s.blurDataURL,
        className: "object-cover",
      }).props
    : null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-[var(--radius)] bg-espresso-2", !fill && ASPECT[s.aspect], fill && "absolute inset-0", className)}
      {...(s.src ? {} : { role: "img", "aria-label": alt })}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); <Image> cannot take a trimmed srcset
        <img {...img} srcSet={capSrcSet(img.srcSet, s.width)} />
      ) : (
        <AiPlaceholder paint={s.paint} />
      )}
      {s.illustrative && <span className="image-tag absolute end-3 top-3 z-[2]">{t("illustrative")}</span>}
    </div>
  );
}
