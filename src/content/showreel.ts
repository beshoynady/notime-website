/**
 * The code-driven showreel (D78; v1 plan B6): curated real photos from the 2026 profile with no
 * people in them (profile-inventory.md, People = none) and no client name, landscape, at their
 * native size (D51). Played as a sequence of stills (Ken Burns, crossfades, grain) until a real
 * video exists (CONTENT_CHECKLIST #1). The frames are decorative; the dialog names the reel.
 */
export interface ReelFrame {
  src: string;
  width: number;
  height: number;
}

const f = (dir: string, n: number, width: number, height: number): ReelFrame => ({
  src: `/images/work/${dir}/${dir}-${n}.webp`,
  width,
  height,
});

// The Work pages' photos only (D169): the reel is a montage of the Work, so it repeats no photo
// that the hero, the Home strip, About's story or a service page shows.
export const reelFrames: ReelFrame[] = [
  f("private-celebrations", 4, 811, 541),
  f("catering", 3, 1247, 702),
  f("heritage", 1, 1050, 788),
  f("catering", 4, 1187, 668),
  f("private-celebrations", 7, 850, 638),
  f("catering", 7, 939, 529),
  f("heritage", 2, 688, 516),
  f("private-celebrations", 9, 811, 541),
  f("heritage", 3, 688, 516),
  f("heritage", 6, 688, 516),
];

/** Seconds per frame: 10 frames × 2.8 s ≈ 28 s per loop (the plan's 20–30 s). */
export const REEL_FRAME_SECONDS = 2.8;
