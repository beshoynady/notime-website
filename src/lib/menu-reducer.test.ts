import { describe, expect, it } from "vitest";
import { CLICK_GRACE_MS, initialMenuState, menuReducer, type MenuState } from "./menu-reducer";

const open = (now = 1000): MenuState => menuReducer(initialMenuState("events-hospitality"), { type: "INTENT_OPEN", now });

describe("menuReducer", () => {
  it("starts closed on the first category", () => {
    expect(initialMenuState("events-hospitality")).toEqual({ open: false, active: "events-hospitality", openedAt: 0 });
  });

  it("INTENT_OPEN opens and records the time", () => {
    expect(open(1000)).toMatchObject({ open: true, openedAt: 1000 });
  });

  it("INTENT_OPEN while open keeps the original openedAt", () => {
    expect(menuReducer(open(1000), { type: "INTENT_OPEN", now: 1300 }).openedAt).toBe(1000);
  });

  it("a click right after a hover-open does not close it (grace period)", () => {
    expect(CLICK_GRACE_MS).toBe(450);
    expect(menuReducer(open(1000), { type: "CLICK_TRIGGER", now: 1200 }).open).toBe(true);
  });

  it("a click after the grace period closes it", () => {
    expect(menuReducer(open(1000), { type: "CLICK_TRIGGER", now: 1600 }).open).toBe(false);
  });

  it("a click while closed opens it", () => {
    const s = menuReducer(initialMenuState("events-hospitality"), { type: "CLICK_TRIGGER", now: 5000 });
    expect(s).toMatchObject({ open: true, openedAt: 5000 });
  });

  it("CLOSE keeps the active category", () => {
    const s = menuReducer(menuReducer(open(), { type: "SET_ACTIVE", slug: "marketing-brand" }), { type: "CLOSE" });
    expect(s).toMatchObject({ open: false, active: "marketing-brand" });
  });

  it("SET_ACTIVE while closed only changes the category", () => {
    const s = menuReducer(initialMenuState("events-hospitality"), { type: "SET_ACTIVE", slug: "software-digital" });
    expect(s).toEqual({ open: false, active: "software-digital", openedAt: 0 });
  });

  it("returns the same object when nothing changes (no extra renders)", () => {
    const s = initialMenuState("events-hospitality");
    expect(menuReducer(s, { type: "CLOSE" })).toBe(s);
    expect(menuReducer(s, { type: "SET_ACTIVE", slug: "events-hospitality" })).toBe(s);
  });
});
