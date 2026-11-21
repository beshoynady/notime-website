import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import { media } from "@/content/media";
import { visibleGallery } from "@/content/galleries";
import { capSrcSet } from "@/lib/srcset";

/**
 * Rand's own work under a section (D153): a strip of 3:4 photos that snaps tile by tile and starts
 * at the inline-start (so it reads right to left in Arabic). Server-rendered and lazy (it's always
 * below the section's scene); a hidden photo drops out, and under two photos nothing is shown.
 * The strip is a named, focusable region so a keyboard can scroll it.
 */
export function ServiceGallery({ ids, label, locale }: { ids: string[]; label: string; locale: Locale }) {
  const shown = visibleGallery(ids, (id) => !!media(id));
  if (!shown.length) return null;
  return (
    <div className="svc-gallery" role="region" aria-label={label} tabIndex={0}>
      <ul>
        {shown.map((id) => {
          const m = media(id)!;
          const { props } = getImageProps({
            src: m.file,
            alt: m.alt?.[locale] ?? "",
            width: m.width,
            height: m.height,
            sizes: "(min-width: 1024px) 20vw, 70vw",
          });
          return (
            <li key={id}>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51) */}
              <img {...props} srcSet={capSrcSet(props.srcSet, m.width)} loading="lazy" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
