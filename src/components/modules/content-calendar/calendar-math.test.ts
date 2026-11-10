import { describe, expect, it } from "vitest";
import { filterEntries, monthWeeks, WEEK_START, weekdayOrder } from "./calendar-math";

describe("weekdayOrder", () => {
  it("starts on Monday in English and on Sunday in Arabic", () => {
    expect(WEEK_START).toEqual({ en: 1, ar: 0 });
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});

describe("monthWeeks", () => {
  // 1 November 2026 is a Sunday; the month has 30 days.
  it("pads the first week up to the 1st from the locale's first weekday (Monday start)", () => {
    const weeks = monthWeeks(2026, 10, 1);
    expect(weeks[0]).toEqual([null, null, null, null, null, null, 1]);
    expect(weeks[1]).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(weeks[5]).toEqual([30, null, null, null, null, null, null]);
  });

  it("starts on the 1st when the month starts on the first weekday (Sunday start)", () => {
    const weeks = monthWeeks(2026, 10, 0);
    expect(weeks[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(weeks[4]).toEqual([29, 30, null, null, null, null, null]);
  });

  it("always returns six weeks of seven days, so the grid's height never depends on the month", () => {
    for (let m = 0; m < 12; m++) {
      for (const start of [0, 1] as const) {
        const weeks = monthWeeks(2027, m, start);
        expect(weeks).toHaveLength(6);
        for (const w of weeks) expect(w).toHaveLength(7);
      }
    }
    // February 2027 (28 days, starts on a Monday) fits in four Monday-start weeks: two empty weeks follow.
    expect(monthWeeks(2027, 1, 1)[4]).toEqual([null, null, null, null, null, null, null]);
  });

  it("lists every day of the month once, in order", () => {
    const days = monthWeeks(2028, 1, 0).flat().filter((d) => d !== null);
    expect(days).toEqual(Array.from({ length: 29 }, (_, i) => i + 1)); // 2028 is a leap year
  });
});

describe("filterEntries", () => {
  const entries = [
    { id: "a", pillar: "launch", channel: "instagram" },
    { id: "b", pillar: "craft", channel: "instagram" },
    { id: "c", pillar: "launch", channel: "blog" },
  ];

  it("keeps everything with no filter", () => {
    expect(filterEntries(entries, { pillar: null, channel: null }).map((e) => e.id)).toEqual(["a", "b", "c"]);
  });

  it("filters by pillar, by channel, or both", () => {
    expect(filterEntries(entries, { pillar: "launch", channel: null }).map((e) => e.id)).toEqual(["a", "c"]);
    expect(filterEntries(entries, { pillar: null, channel: "instagram" }).map((e) => e.id)).toEqual(["a", "b"]);
    expect(filterEntries(entries, { pillar: "launch", channel: "instagram" }).map((e) => e.id)).toEqual(["a"]);
    expect(filterEntries(entries, { pillar: "craft", channel: "blog" })).toEqual([]);
  });
});
