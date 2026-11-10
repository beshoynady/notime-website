/**
 * The consultation form's prefill (Software page): "Discuss this" on a service and "Talk about
 * Launch / Grow / Platform" on a tier land on `#consult` with the form preset. The URL alone
 * carries it (`?build=apps#consult`), so a shared or reloaded link presets the same way; on
 * the page a click also pushes it through `prefill-store` without a navigation. Pure.
 */
import { BUILD_OPTIONS, TIERS } from "./forms/schemas";

export type Build = (typeof BUILD_OPTIONS)[number];
export type Tier = (typeof TIERS)[number];
export type Prefill = { build?: Build; tier?: Tier };

/** The id of the section that holds the consultation form. */
export const CONSULT_ID = "consult";

/** What a tier is usually about, when the link names no build. */
const TIER_BUILD: Record<Tier, Build> = { launch: "websites", grow: "websites", platform: "systems" };

const oneOf = <T extends string>(list: readonly T[], v: string | null): T | undefined => {
  const s = v?.trim().toLowerCase() ?? "";
  return (list as readonly string[]).includes(s) ? (s as T) : undefined;
};

/** Reads `build` (or the storyboard's `service`) and `tier`; anything unknown is dropped. */
export function parsePrefill(search: string): Prefill {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const tier = oneOf(TIERS, q.get("tier"));
  const build = oneOf(BUILD_OPTIONS, q.get("build")) ?? oneOf(BUILD_OPTIONS, q.get("service")) ?? (tier ? TIER_BUILD[tier] : undefined);
  const out: Prefill = {};
  if (build) out.build = build;
  if (tier) out.tier = tier;
  return out;
}

/** The link for a prefill CTA: relative, so it stays on the current page and locale. */
export function prefillHref(p: Prefill): string {
  const q = new URLSearchParams();
  if (p.build) q.set("build", p.build);
  if (p.tier) q.set("tier", p.tier);
  return `?${q.toString()}#${CONSULT_ID}`;
}
