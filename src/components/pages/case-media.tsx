import Image from "next/image";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { BrandImage } from "@/components/ui/brand-image";
import { getImageSlot, type Locale } from "@/content";
import type { WorkView } from "@/content/work";

/** True when a case shows a stand-in file, so the page adds the "Illustrative" note. */
export const showsIllustrative = (v: WorkView) => !v.named && !!v.image && !!getImageSlot(v.image).src;

/**
 * A case's media box (16:9 by default; the parent sizes it). Named, with the client's approval:
 * its own first photo. Anonymous: its stand-in slot, which BrandImage tags "Illustrative" once it
 * has a file; until then the designed ground, with no tag and no claim (D84). Never a branded
 * photo while anonymous (work.test.ts).
 */
export function CaseMedia({ view, locale, sizes }: { view: WorkView; locale: Locale; sizes: string }) {
  const photo = view.named ? view.photos[0] : undefined;
  const slot = !view.named && view.image ? getImageSlot(view.image) : undefined;
  return (
    <>
      {photo ? (
        <Image src={photo} alt={view.label[locale]} fill sizes={sizes} className="object-cover" />
      ) : slot?.src ? (
        <BrandImage slot={slot.id} sizes={sizes} fill />
      ) : (
        <AiPlaceholder paint={slot?.paint ?? "event"} showTag={false} />
      )}
      <FrameCorners inset="md" />
    </>
  );
}
