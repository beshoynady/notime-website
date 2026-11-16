import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import { storySrc, type StoryPhoto } from "@/content/photo-stories";
import { capSrcSet } from "@/lib/srcset";

/**
 * A graded story photo (D109), filling its box. Lazy: every story sits below an opening. Its alt
 * describes the scene (real work, shown as evidence), unless the caller marks it decorative.
 */
export function StoryImage({ photo, locale, sizes, decorative = false }: { photo: StoryPhoto; locale: Locale; sizes: string; decorative?: boolean }) {
  const { props } = getImageProps({
    src: storySrc(photo),
    alt: decorative ? "" : photo.alt[locale],
    fill: true,
    sizes,
    className: "object-cover",
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51)
  return <img {...props} srcSet={capSrcSet(props.srcSet, photo.width)} />;
}
