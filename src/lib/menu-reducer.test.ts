import { describe, expect, it } from "vitest";
import { initialMenuState, menuReducer, type MenuState } from "./menu-reducer";

const hoverOpen = (): MenuState => menuReducer(initialMenuState("events-hospitality"), { type: "INTENT_OPEN" });
const click = (s: MenuState) => menuReducer(s, { type: "CLICK_TRIGGER" });

describe("menuReducer", () => {
  it("starts closed on the first category", () => {
    expect(initialMenuState("events-hospitality")).toEqual({ open: false, active: "events-hospitality", openedBy: null });
  });

  it("INTENT_OPEN opens it by hover", () => {
    expect(hoverOpen()).toMatchObject({ open: true, openedBy: "hover" });
  });

  it("INTENT_OPEN while open changes nothing", () => {
    const s = hoverOpen();
    expect(menuReducer(s, { type: "INTENT_OPEN" })).toBe(s);
  });

  // Self-audit B09 (2026-11-20): a visitor who hovers, reads, then clicks «Services» means
  // "open it"; the click used to close a hover-opened panel once 450 ms had passed.
  it("a click on a hover-opened panel keeps it open, however late, and holds it as clicked", () => {
    expect(click(hoverOpen())).toMatchObject({ open: true, openedBy: "click" });
  });

  it("the next click then closes it", () => {
    expect(click(click(hoverOpen())).open).toBe(false);
  });

  it("a click while closed opens it; a second click closes it", () => {
    const s = click(initialMenuState("events-hospitality"));
    expect(s).toMatchObject({ open: true, openedBy: "click" });
    expect(click(s)).toMatchObject({ open: false, openedBy: null });
  });

  it("CLOSE keeps the active category", () => {
    const s = menuReducer(menuReducer(hoverOpen(), { type: "SET_ACTIVE", slug: "marketing-brand" }), { type: "CLOSE" });
    expect(s).toMatchObject({ open: false, active: "marketing-brand", openedBy: null });
  });

  it("SET_ACTIVE while closed only changes the category", () => {
    const s = menuReducer(initialMenuState("events-hospitality"), { type: "SET_ACTIVE", slug: "software-digital" });
    expect(s).toEqual({ open: false, active: "software-digital", openedBy: null });
  });

  it("returns the same object when nothing changes (no extra renders)", () => {
    const s = initialMenuState("events-hospitality");
    expect(menuReducer(s, { type: "CLOSE" })).toBe(s);
    expect(menuReducer(s, { type: "SET_ACTIVE", slug: "events-hospitality" })).toBe(s);
  });
});
