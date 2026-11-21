import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import type { MediaEntry } from "@/content/media";
import { capSrcSet } from "@/lib/srcset";

/**
 * A registry picture (media.ts) filling its positioned box, lazy, object-cover. The srcset is
 * trimmed to the file's native width (D51), which is why this uses getImageProps, not <Image>.
 * Its alt comes from the registry unless the caller marks it decorative.
 */
export function MediaImage({ entry, locale, sizes, decorative = false }: { entry: MediaEntry; locale: Locale; sizes: string; decorative?: boolean }) {
  const { props } = getImageProps({
    src: entry.file,
    alt: decorative ? "" : (entry.alt?.[locale] ?? ""),
    fill: true,
    sizes,
    className: "object-cover",
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51)
  return <img {...props} srcSet={capSrcSet(props.srcSet, entry.width)} />;
}
