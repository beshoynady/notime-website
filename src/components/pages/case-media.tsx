import Image from "next/image";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { CaseVisual } from "@/components/ui/case-visual";
import { MediaImage } from "@/components/ui/media-image";
import type { Locale } from "@/content";
import type { MediaEntry } from "@/content/media";
import type { WorkView } from "@/content/work";
import "@/components/motion/duotone.css";

/**
 * A case's media box (16:9 by default; the parent sizes it). Named, with the client's approval:
 * its own first photo, in duotone (colour on hover). Anonymous: the drawing of the work (CaseVisual, D106), never a stand-in
 * photo and never a branded one (work.test.ts). With `cover` (the case's own registry photo,
 * client-visible, D150: home's Real projects), that photo in duotone, named or not.
 */
export function CaseMedia({ view, locale, sizes, cover }: { view: WorkView; locale: Locale; sizes: string; cover?: MediaEntry }) {
  const photo = view.named ? view.photos[0] : undefined;
  return (
    <>
      {cover ? (
        <div className="duotone absolute inset-0">
          <MediaImage entry={cover} locale={locale} sizes={sizes} />
        </div>
      ) : photo ? (
        <div className="duotone absolute inset-0">
          <Image src={photo} alt={view.label[locale]} fill sizes={sizes} className="object-cover" />
        </div>
      ) : (
        <CaseVisual drawing={view.visual ?? "stand"} />
      )}
      <FrameCorners inset="md" />
    </>
  );
}
