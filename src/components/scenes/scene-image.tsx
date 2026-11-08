import { getImageProps } from "next/image";
import { useLocale } from "next-intl";
import type { Locale } from "@/content";
import { getSceneImage } from "@/content/scenes";
import { capSrcSet } from "@/lib/srcset";

/**
 * A scene layer's image (layers.md): decorative (`alt=""`) unless its slot shows real work as
 * evidence. Plates switch to their 9:16 file below 900px (art direction). Never `priority`:
 * shot-1 layers within the budget load eagerly at normal priority, so the H1 stays the LCP.
 * Nothing renders while the slot has no file; the stage's ground shows instead.
 */
export function SceneImage({ slot, sizes, eager = false }: { slot: string; sizes: string; eager?: boolean }) {
  const locale = useLocale() as Locale;
  const s = getSceneImage(slot);
  if (!s?.src) return null;
  const common = { alt: s.alt?.[locale] ?? "", fill: true, sizes, ...(eager ? { loading: "eager" as const } : {}) };
  const { props } = getImageProps({ ...common, src: s.src, className: "object-cover" });
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
