import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import type { MediaEntry } from "@/content/media";
import { capSrcSet } from "@/lib/srcset";

/**
 * A picture filling its positioned box, object-cover, lazy. The srcset is trimmed to the file's
 * native width (D51), which is why this uses getImageProps, not <Image>.
 */
export function FillImage({ src, width, alt, sizes }: { src: string; width: number; alt: string; sizes: string }) {
  const { props } = getImageProps({ src, alt, fill: true, sizes, className: "object-cover" });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51)
  return <img {...props} srcSet={capSrcSet(props.srcSet, width)} />;
}

/** A registry picture (media.ts); its alt comes from the registry unless the caller marks it decorative. */
export function MediaImage({ entry, locale, sizes, decorative = false }: { entry: MediaEntry; locale: Locale; sizes: string; decorative?: boolean }) {
  return <FillImage src={entry.file} width={entry.width} alt={decorative ? "" : (entry.alt?.[locale] ?? "")} sizes={sizes} />;
}
