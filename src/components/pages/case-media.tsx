import Image from "next/image";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { CaseVisual } from "@/components/ui/case-visual";
import type { Locale } from "@/content";
import type { WorkView } from "@/content/work";

/**
 * A case's media box (16:9 by default; the parent sizes it). Named, with the client's approval:
 * its own first photo, in duotone (colour on hover). Anonymous: the drawing of the work (CaseVisual, D106), never a stand-in
 * photo and never a branded one (work.test.ts).
 */
export function CaseMedia({ view, locale, sizes }: { view: WorkView; locale: Locale; sizes: string }) {
  const photo = view.named ? view.photos[0] : undefined;
  return (
    <>
      {photo ? (
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
