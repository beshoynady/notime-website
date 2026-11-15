import { WORK_NAMED } from "./work";

/**
 * Software & Digital page switches (D65, D67). Flip one only with its condition met:
 * - `lighthouseProof`: the production domain measures 90+ on mobile in every category; the
 *   numbers then come from the latest Lighthouse summary, never typed in (D65).
 * The case study's named variant follows `WORK_NAMED.uaeaf` (src/config/work.ts, OQ #17).
 */
export const SOFTWARE_FLAGS = {
  lighthouseProof: false,
} as const;

export type LighthouseScores = { performance: number; accessibility: number; bestPractices: number; seo: number };

/** True once the federation approves its name and screens: every text and visual switches. */
export const caseStudyNamed = (): boolean => WORK_NAMED.uaeaf;

/** The scores to show, or null: only with the flag on and every category at 90 or more. */
export function lighthouseProof(flag: boolean, scores: LighthouseScores | null): LighthouseScores | null {
  if (!flag || !scores) return null;
  return Object.values(scores).every((v) => Number.isFinite(v) && v >= 90) ? scores : null;
}
