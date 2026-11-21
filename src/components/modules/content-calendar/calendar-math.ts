/**
 * The content calendar's month maths (pure, unit-tested). Weekdays use JS numbering
 * (0 = Sunday … 6 = Saturday); months are 0-based, as in `Date`.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The first day of the week per locale. Nothing else on the site sets one, so this follows the
 * common print convention for each audience: Monday for the English calendar, Sunday for the
 * Arabic one.
 */
export const WEEK_START = { en: 1, ar: 0 } as const satisfies Record<"en" | "ar", Weekday>;

/** The seven weekdays in column order, starting from `start`. */
export function weekdayOrder(start: Weekday): Weekday[] {
  return Array.from({ length: 7 }, (_, i) => ((start + i) % 7) as Weekday);
}

/** Always six weeks, so the grid keeps one height whatever the month (the slot's box, CLS 0). */
const WEEKS = 6;

/** The month as six weeks of seven cells: the day of the month, or null outside it. */
export function monthWeeks(year: number, month: number, start: Weekday): (number | null)[][] {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first - start + 7) % 7;
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = w * 7 + d - lead + 1;
      return day >= 1 && day <= days ? day : null;
    }),
  );
}

/** The entries that match the active filters (null = any). */
export function filterEntries<E extends { pillar: string; channel: string }>(
  entries: readonly E[],
  filter: { pillar: string | null; channel: string | null },
): E[] {
  return entries.filter((e) => (!filter.pillar || e.pillar === filter.pillar) && (!filter.channel || e.channel === filter.channel));
}
