import { getLocale } from "next-intl/server";
import type { Locale } from "@/content";
import "./review.css";

/** The slim fixed bar on the review build: "Review version – not public". Production: nothing. */
export async function ReviewBanner() {
  if (process.env.NEXT_PUBLIC_REVIEW_MODE !== "1") return null;
  const [{ reviewUi }, locale] = await Promise.all([import("@/content/review/ui"), getLocale() as Promise<Locale>]);
  return (
    <div className="review-banner" role="note">
      <span>{reviewUi.banner[locale]}</span>
    </div>
  );
}
