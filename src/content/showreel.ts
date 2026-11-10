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

export const reelFrames: ReelFrame[] = [
  f("private-celebrations", 1, 1600, 1066),
  f("catering", 2, 1247, 703),
  f("private-celebrations", 4, 811, 541),
  f("catering", 1, 1408, 794),
  f("heritage", 5, 891, 668),
  f("catering", 3, 1247, 702),
  f("private-celebrations", 7, 850, 638),
  f("catering", 4, 1187, 668),
  f("private-celebrations", 5, 949, 534),
  f("catering", 7, 939, 529),
];

/** Seconds per frame: 10 frames × 2.8 s ≈ 28 s per loop (the plan's 20–30 s). */
export const REEL_FRAME_SECONDS = 2.8;
