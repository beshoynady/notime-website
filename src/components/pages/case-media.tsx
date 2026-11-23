import { FrameCorners } from "@/components/ornaments/frame-corners";
import { MediaImage } from "@/components/ui/media-image";
import type { Locale } from "@/content";
import type { MediaEntry } from "@/content/media";
import "@/components/motion/duotone.css";

/**
 * A Work card's or case's media box (16:9 by default; the parent sizes it): its own photo from the
 * registry, in duotone (colour on hover). A case's cover shows its client (D150, Rand approves); a
 * collection's is Rand's own work (D164). Never a stand-in photo (D106); without one the box is
 * left out by the caller.
 */
export function CaseMedia({ cover, locale, sizes }: { cover: MediaEntry; locale: Locale; sizes: string }) {
  return (
    <>
      <div className="duotone absolute inset-0">
        <MediaImage entry={cover} locale={locale} sizes={sizes} />
      </div>
      <FrameCorners inset="md" />
    </>
  );
}
