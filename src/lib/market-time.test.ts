import { describe, expect, it } from "vitest";
import { marketTime } from "./market-time";

// 2026-07-01 09:05 UTC (Cairo on summer time) and 2026-01-15 21:40 UTC (winter).
const SUMMER = new Date(Date.UTC(2026, 6, 1, 9, 5));
const WINTER = new Date(Date.UTC(2026, 0, 15, 21, 40));

describe("marketTime", () => {
  it("gives Dubai's local time and its UTC offset", () => {
    expect(marketTime(SUMMER, "Asia/Dubai")).toEqual({ time: "13:05", offset: "UTC+4" });
  });

  it("uses a 24-hour clock with two-digit hours past midnight", () => {
    expect(marketTime(WINTER, "Asia/Dubai")).toEqual({ time: "01:40", offset: "UTC+4" });
  });

  it("follows daylight saving where the zone has it (Cairo)", () => {
    expect(marketTime(SUMMER, "Africa/Cairo").offset).toBe("UTC+3");
    expect(marketTime(WINTER, "Africa/Cairo")).toEqual({ time: "23:40", offset: "UTC+2" });
  });

  it("covers the other markets (UTC+3 and UTC+4 all year)", () => {
    expect(marketTime(WINTER, "Asia/Riyadh").offset).toBe("UTC+3");
    expect(marketTime(WINTER, "Asia/Qatar").offset).toBe("UTC+3");
    expect(marketTime(WINTER, "Asia/Kuwait").offset).toBe("UTC+3");
    expect(marketTime(WINTER, "Asia/Muscat").offset).toBe("UTC+4");
  });

  it("always returns Western digits (D50), whatever the runtime's default locale", () => {
    const { time, offset } = marketTime(SUMMER, "Asia/Riyadh");
    expect(`${time}${offset}`).toMatch(/^[0-9:UTC+-]+$/);
  });
});
