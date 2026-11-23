import type { Locale } from "@/content";
import { media } from "@/content/media";
import type { ServiceVisual as Visual } from "@/content/service-visuals";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { FillImage } from "@/components/ui/media-image";

const SIZES = "(min-width: 900px) 720px, calc(100vw - 32px)";

/**
 * A service section's lightweight visual while its module waits for v1.1 (D100): a graded real
 * photo (its own file, or a registry picture). Static and server-rendered, in a fixed box
 * so nothing shifts (16:9; a portrait or square photo keeps its own shape, at most 480px tall, so a
 * published post is never cropped); lazy-loaded (below the opening).
 */
const TALL = 480;
export function ServiceVisual({ visual, locale }: { visual: Visual; locale: Locale }) {
  const photo = visual.kind === "media" ? media(visual.id) : { file: visual.src, width: visual.width, height: visual.height, alt: visual.alt };
  if (!photo) return null;
  const ratio = photo.width / photo.height;
  const own = ratio < 4 / 3 ? { aspectRatio: `${photo.width} / ${photo.height}`, maxInlineSize: `${Math.round(TALL * ratio)}px` } : undefined;
  // The photo opens with a mask wipe from inline-start as it enters (D109; MaskReveal, GSAP, once).
  return (
    <figure className="svc-visual" data-visual="photo" style={own}>
      <MaskReveal className="absolute inset-0 overflow-hidden">
        <FillImage src={photo.file} width={photo.width} alt={photo.alt?.[locale] ?? ""} sizes={SIZES} />
      </MaskReveal>
    </figure>
  );
}
