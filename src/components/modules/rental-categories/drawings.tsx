import type { ReactNode } from "react";
import type { RentalCategoryId } from "@/content/modules/rental-categories";

/**
 * Line drawings for the four rental categories: generic shapes, no model or brand (D81).
 * Drawn on a 64 × 40 grid in the current colour; decorative (the card's name says what it is).
 */
const DRAWINGS: Record<RentalCategoryId, ReactNode> = {
  // A cine camera: two magazine reels on a body, a lens, a matte box.
  cameras: (
    <>
      <circle cx="16" cy="9" r="6" />
      <circle cx="29" cy="9" r="6" />
      <rect x="8" y="15" width="30" height="18" rx="2" />
      <rect x="38" y="19" width="8" height="10" />
      <path d="M46 16 56 12v24l-10-4z" />
      <path d="M14 33v4M32 33v4" />
    </>
  ),
  // A lens in profile: the mount, the barrel with its focus and iris rings, the front element.
  lenses: (
    <>
      <rect x="6" y="16" width="5" height="8" />
      <rect x="11" y="12" width="38" height="16" rx="1.5" />
      <path d="M21 12v16M27 12v16M38 12v16" />
      <rect x="49" y="9" width="7" height="22" rx="1.5" />
    </>
  ),
  // A fresnel head on a stand, with its barn doors open.
  lighting: (
    <>
      <rect x="22" y="7" width="20" height="17" rx="2" />
      <circle cx="32" cy="15.5" r="5" />
      <circle cx="32" cy="15.5" r="2" />
      <path d="M22 7 16 3M42 7l6-4M22 24l-6 4M42 24l6 4" />
      <path d="M32 24v10M24 39l8-5 8 5" />
    </>
  ),
  // A shotgun microphone on a short pole, its grille slots along the body.
  audio: (
    <>
      <rect x="8" y="14" width="40" height="9" rx="4.5" />
      <path d="M18 16.5v4M23 16.5v4M28 16.5v4M33 16.5v4" />
      <rect x="48" y="15.5" width="7" height="6" rx="1" />
      <path d="M38 23v5M38 28 30 38" />
    </>
  ),
};

export function RentalDrawing({ id, className }: { id: RentalCategoryId; className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {DRAWINGS[id]}
    </svg>
  );
}
