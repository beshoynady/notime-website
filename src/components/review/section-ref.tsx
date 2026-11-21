import type { SectionRefId } from "@/lib/review";
import "./review.css";

/**
 * A section's reference number for Rand's notes ("change EV-05"). Review mode only; the literal
 * env test lets the build drop it from production. Decorative for assistive tech: the number is a
 * review aid, not content.
 */
export function SectionRef({ id }: { id: SectionRefId }) {
  if (process.env.NEXT_PUBLIC_REVIEW_MODE !== "1") return null;
  return (
    <span className="section-ref" data-ref={id} aria-hidden="true">
      {/* The tag follows the page direction (inline end); the id itself always reads left to right. */}
      <bdi dir="ltr">{id}</bdi>
    </span>
  );
}
