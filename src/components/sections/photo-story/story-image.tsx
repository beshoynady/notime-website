import type { Locale } from "@/content";
import { storySrc, type StoryPhoto } from "@/content/photo-stories";
import { FillImage } from "@/components/ui/media-image";

/**
 * A graded story photo (D109), filling its box. Lazy: every story sits below an opening. Its alt
 * describes the scene (real work, shown as evidence), unless the caller marks it decorative.
 */
export function StoryImage({ photo, locale, sizes, decorative = false }: { photo: StoryPhoto; locale: Locale; sizes: string; decorative?: boolean }) {
  return <FillImage src={storySrc(photo)} width={photo.width} alt={decorative ? "" : photo.alt[locale]} sizes={sizes} />;
}
