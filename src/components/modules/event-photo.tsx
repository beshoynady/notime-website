import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import type { EventPhoto as Photo } from "@/content/modules/event-photos";
import { capSrcSet } from "@/lib/srcset";
import { cn } from "@/lib/utils";

/**
 * A real NO TIME event photo inside an Events module: next/image's optimiser (AVIF/WebP, lazy),
 * with the srcset capped at the file's native width (D51), filling its frame. No hooks, so the
 * server fallbacks and the client modules share it.
 */
export function EventPhoto({ photo, locale, sizes, className }: { photo: Photo; locale: Locale; sizes: string; className?: string }) {
  const { props } = getImageProps({ src: photo.src, alt: photo.alt[locale], width: photo.width, height: photo.height, sizes });
  return (
    <span className={cn("evm-photo", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51) */}
      <img {...props} srcSet={capSrcSet(props.srcSet, photo.width)} />
    </span>
  );
}
