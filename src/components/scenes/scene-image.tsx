import { getImageProps } from "next/image";
import { useLocale } from "next-intl";
import type { Locale } from "@/content";
import { getSceneImage } from "@/content/scenes";
import type { ImageLoading } from "@/lib/scene-math";
import { capSrcSet } from "@/lib/srcset";

/**
 * A scene layer's image (layers.md): decorative (`alt=""`) unless its slot shows real work as
 * evidence. Plates switch to their 9:16 file below 900px (art direction). `loading` comes from
 * the scene (imageLoading, N06; lazy when absent): the hero still's first image is fetched with
 * high priority (`fetchPriority`, not `preload`: a `<picture>` picks its file per width, and a
 * preload link would fetch the wrong one), the build scene's are lazy. Nothing renders while the slot has no
 * file; the stage's ground shows instead. A cutout (no plate, `fit="contain"`) is never cropped
 * by its box (D109).
 */
export function SceneImage({ slot, sizes, loading, fit = "cover" }: { slot: string; sizes: string; loading?: ImageLoading; fit?: "cover" | "contain" }) {
  const locale = useLocale() as Locale;
  const s = getSceneImage(slot);
  if (!s?.src) return null;
  const common = {
    alt: s.alt?.[locale] ?? "",
    fill: true,
    sizes,
    ...(loading?.eager ? { loading: "eager" as const } : {}),
    ...(loading?.high ? { fetchPriority: "high" as const } : {}),
  };
  const { props } = getImageProps({ ...common, src: s.src, className: fit === "contain" ? "object-contain" : "object-cover" });
  const mobile = s.mobile?.src ? getImageProps({ ...common, src: s.mobile.src }).props : null;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (alt included); the srcset is trimmed (D51)
  const img = <img {...props} srcSet={capSrcSet(props.srcSet, s.width)} />;
  return mobile ? (
    <picture>
      <source media="(max-width: 899.98px)" srcSet={capSrcSet(mobile.srcSet, s.mobile?.width)} sizes={sizes} />
      {img}
    </picture>
  ) : (
    img
  );
}
