import type { Locale } from "@/content";
import { media } from "@/content/media";
import type { ServiceVisual as Visual } from "@/content/service-visuals";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { FillImage } from "@/components/ui/media-image";
import { ServiceDrawing } from "./service-drawings";

const SIZES = "(min-width: 900px) 720px, calc(100vw - 32px)";

/**
 * A service section's lightweight visual while its module waits for v1.1 (D100): a graded real
 * photo, or a hairline drawing in the theme's colours. Static and server-rendered, in a fixed
 * 16:9 box so nothing shifts; lazy-loaded (below the opening).
 */
export function ServiceVisual({ visual, locale }: { visual: Visual; locale: Locale }) {
  if (visual.kind === "drawing") {
    return (
      <div className="svc-visual" data-visual="drawing">
        <ServiceDrawing drawing={visual.drawing} />
      </div>
    );
  }
  const photo = visual.kind === "media" ? media(visual.id) : { file: visual.src, width: visual.width, alt: visual.alt };
  if (!photo) return null;
  // The photo opens with a mask wipe from inline-start as it enters (D109; MaskReveal, GSAP, once).
  return (
    <figure className="svc-visual" data-visual="photo">
      <MaskReveal className="absolute inset-0 overflow-hidden">
        <FillImage src={photo.file} width={photo.width} alt={photo.alt?.[locale] ?? ""} sizes={SIZES} />
      </MaskReveal>
    </figure>
  );
}
