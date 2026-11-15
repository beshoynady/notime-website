import { getImageProps } from "next/image";
import type { Locale } from "@/content";
import type { ServiceVisual as Visual } from "@/content/service-visuals";
import { capSrcSet } from "@/lib/srcset";
import { ServiceDrawing } from "./service-drawings";

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
  const { props } = getImageProps({
    src: visual.src,
    alt: visual.alt[locale],
    fill: true,
    sizes: "(min-width: 900px) 720px, calc(100vw - 32px)",
    className: "object-cover",
  });
  return (
    <figure className="svc-visual" data-visual="photo">
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51) */}
      <img {...props} srcSet={capSrcSet(props.srcSet, visual.width)} />
    </figure>
  );
}
