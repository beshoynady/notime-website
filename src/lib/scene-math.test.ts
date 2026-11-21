import { describe, expect, it } from "vitest";
import type { SceneConfig, SceneLayer, SceneShot } from "@/content/scenes/types";
import { PIN_LIMIT, SECTION_PIN_LIMIT, enterFrom, imageLoading, layerDrift, layerSizes, lineSpans, pinLength, sceneMode, sceneProblems, shotAt, stillState, stillLead, wipeInset } from "./scene-math";

const shots: SceneShot[] = [
  { id: "a", copyKey: "a", desktop: [0, 0.45], mobile: [0, 0.35] },
  { id: "b", copyKey: "b", desktop: [0.45, 0.95], mobile: null },
  { id: "c", copyKey: "c", desktop: [0.95, 1.5], mobile: [0.35, 0.8] },
  { id: "d", copyKey: "d", desktop: [1.5, 2.0], mobile: [0.8, 1.2] },
];

const layer = (over: Partial<SceneLayer> = {}): SceneLayer => ({
  id: "l",
  level: 1,
  depth: 0.5,
  mobile: true,
  box: { block: "0", inline: "0" },
  ...over,
});

const scene = (over: Partial<SceneConfig> = {}): SceneConfig => ({ id: "s", shots, layers: [], ...over });

describe("pinLength", () => {
  it("is the end of the last shot that plays at this width", () => {
    expect(pinLength(shots, "desktop")).toBe(2.0);
    expect(pinLength(shots, "mobile")).toBe(1.2);
  });

  it("the limits are 2.0 vh on desktop and 1.2 vh on mobile (D64)", () => {
    expect(PIN_LIMIT).toEqual({ desktop: 2.0, mobile: 1.2 });
  });
});

describe("shotAt", () => {
  it("finds the shot whose range holds the scrolled distance (vh)", () => {
    expect(shotAt(0, shots, "desktop")).toBe(0);
    expect(shotAt(0.5, shots, "desktop")).toBe(1);
    expect(shotAt(1.0, shots, "desktop")).toBe(2);
    expect(shotAt(1.99, shots, "desktop")).toBe(3);
  });

  it("a shot owns its start: at exactly 0.45 vh, shot b is playing", () => {
    expect(shotAt(0.45, shots, "desktop")).toBe(1);
  });

  it("clamps before the start and past the end", () => {
    expect(shotAt(-1, shots, "desktop")).toBe(0);
    expect(shotAt(5, shots, "desktop")).toBe(3);
  });

  it("skips shots that do not play at this width", () => {
    expect(shotAt(0.4, shots, "mobile")).toBe(2); // b has no mobile range
    expect(shotAt(1.2, shots, "mobile")).toBe(3);
  });
});

describe("layerDrift", () => {
  it("does not move a depth-0 layer", () => {
    expect(layerDrift(0, 0, 1)).toEqual({ y: 0, scale: 1 });
  });

  it("drifts up by depth × 14 vh over the scene, and scales by push", () => {
    expect(layerDrift(1, 0, 0.5).y).toBeCloseTo(-7);
    expect(layerDrift(0.15, 0.06, 1).y).toBeCloseTo(-2.1);
    expect(layerDrift(0.15, 0.06, 1).scale).toBeCloseTo(1.06);
  });
});

describe("enterFrom", () => {
  it("turns inline offsets into physical ones: inline-start is left in EN, right in AR", () => {
    expect(enterFrom({ x: -30 }, 1).xPercent).toBe(-30);
    expect(enterFrom({ x: -30 }, -1).xPercent).toBe(30);
  });

  it("starts hidden unless the shot says otherwise", () => {
    expect(enterFrom({ y: 8 }, 1)).toEqual({ xPercent: 0, yPercent: 8, opacity: 0, scale: 1 });
    expect(enterFrom({ x: -30, opacity: 1 }, 1).opacity).toBe(1);
  });
});

describe("stillState", () => {
  it("is the last keyframe's values (the end frame), or nothing", () => {
    expect(stillState(layer())).toEqual({});
    const shade = layer({ style: { opacity: 0.7 }, keys: [{ shot: 1, to: { opacity: 0.4 } }, { shot: 3, to: { opacity: 0.25 } }] });
    expect(stillState(shade)).toEqual({ opacity: 0.25 });
  });
});

describe("sceneProblems", () => {
  const images = (n: number, mobile: boolean) => Array.from({ length: n }, (_, i) => layer({ id: `i${i}`, slot: `slot-${i}`, mobile }));

  it("accepts a scene within every limit", () => {
    expect(sceneProblems(scene({ layers: [...images(2, true), ...images(1, false).map((l) => ({ ...l, id: "x" }))] }))).toEqual([]);
  });

  it("rejects a pin over the limit", () => {
    const long = shots.map((s, i) => (i === 3 ? { ...s, desktop: [1.5, 2.1] as [number, number] } : s));
    expect(sceneProblems(scene({ shots: long }))).toContain("desktop pin 2.1 vh > 2 vh");
  });

  it("rejects more than 5 image layers, or more than 3 on mobile", () => {
    expect(sceneProblems(scene({ layers: images(6, false) }))).toContain("6 image layers > 5");
    expect(sceneProblems(scene({ layers: images(4, true) }))).toContain("4 mobile image layers > 3");
  });

  it("rejects overlapping or out-of-order shot ranges", () => {
    const bad = shots.map((s, i) => (i === 1 ? { ...s, desktop: [0.4, 0.95] as [number, number] } : s));
    expect(sceneProblems(scene({ shots: bad }))).toContain("desktop shot b starts before shot a ends");
  });

  it("rejects an image on L3 (atmosphere is code only) and duplicate layer ids", () => {
    expect(sceneProblems(scene({ layers: [layer({ level: 3, slot: "x" })] }))).toContain("layer l: L3 is code only");
    expect(sceneProblems(scene({ layers: [layer(), layer()] }))).toContain("duplicate layer id l");
  });

  it("allows eager loading only for layers visible in shot 1", () => {
    const late = layer({ slot: "x", eager: true, enter: { shot: 2, from: { y: 8 } } });
    expect(sceneProblems(scene({ layers: [late] }))).toContain("layer l: eager but enters in shot 3");
  });

  it("rejects keys or enters that point at a missing shot", () => {
    expect(sceneProblems(scene({ layers: [layer({ enter: { shot: 4, from: {} } })] }))).toContain("layer l: shot 5 does not exist");
  });
});

describe("sceneProblems · pass scenes (not pinned, e.g. the majlis)", () => {
  // Shots are fractions of the crossing: from the scene's top entering the viewport (0) to its bottom leaving (1).
  const crossing: SceneShot[] = [
    { id: "dusk", desktop: [0, 0.4], mobile: [0, 0.4] },
    { id: "pour", desktop: [0.4, 0.7], mobile: [0.4, 0.7] },
    { id: "night", desktop: [0.7, 1], mobile: [0.7, 1] },
  ];

  it("accepts shots within the crossing, without lines", () => {
    expect(sceneProblems(scene({ mode: "pass", shots: crossing }))).toEqual([]);
  });

  it("rejects a shot that ends past the crossing", () => {
    const long = crossing.map((s, i) => (i === 2 ? { ...s, mobile: [0.7, 1.4] as [number, number] } : s));
    expect(sceneProblems(scene({ mode: "pass", shots: long }))).toEqual(["mobile shot night ends past the crossing (1.4 > 1)"]);
  });
});

describe("lineSpans (D74, P1: three lines over four shots)", () => {
  it("a line holds until the next line comes in, so a shot without one keeps the previous line", () => {
    const three = shots.map((s, i) => (i === 1 ? { ...s, copyKey: undefined } : s));
    expect(lineSpans(three, "desktop")).toEqual([
      { shot: 0, start: 0, end: 0.95 },
      { shot: 2, start: 0.95, end: 1.5 },
      { shot: 3, start: 1.5, end: 2.0 },
    ]);
  });

  it("skips shots that don't play at this width; the last line lasts to the pin's end", () => {
    expect(lineSpans(shots, "mobile")).toEqual([
      { shot: 0, start: 0, end: 0.35 },
      { shot: 2, start: 0.35, end: 0.8 },
      { shot: 3, start: 0.8, end: 1.2 },
    ]);
  });

  it("is empty for a scene without lines", () => {
    expect(lineSpans(shots.map((s) => ({ ...s, copyKey: undefined })), "desktop")).toEqual([]);
  });
});

describe("sceneMode", () => {
  it("is a pin unless the scene says otherwise, at one or both widths", () => {
    expect(sceneMode(scene(), "desktop")).toBe("pin");
    expect(sceneMode(scene({ mode: "pass" }), "mobile")).toBe("pass");
    const mixed = scene({ mode: { desktop: "pin", mobile: "pass" } });
    expect([sceneMode(mixed, "desktop"), sceneMode(mixed, "mobile")]).toEqual(["pin", "pass"]);
  });
});

describe("sceneProblems · a section scene pinned on desktop, passing on mobile (the majlis, D74 P2)", () => {
  const beats: SceneShot[] = [
    { id: "dusk", desktop: null, mobile: [0, 0.4] },
    { id: "pour", desktop: [0, 0.3], mobile: [0.4, 0.7] },
    { id: "bloom", desktop: [0.3, 0.6], mobile: [0.7, 1] },
  ];
  const majlis = (over: Partial<SceneConfig> = {}) => scene({ mode: { desktop: "pin", mobile: "pass" }, shots: beats, ...over });

  it("a section scene pins 0.6 vh at most, and never on mobile", () => {
    expect(SECTION_PIN_LIMIT).toEqual({ desktop: 0.6, mobile: 0 });
  });

  it("accepts a short desktop pin with a mobile crossing", () => {
    expect(sceneProblems(majlis(), SECTION_PIN_LIMIT)).toEqual([]);
  });

  it("rejects a desktop pin over the section limit", () => {
    const long = beats.map((s, i) => (i === 2 ? { ...s, desktop: [0.3, 0.7] as [number, number] } : s));
    expect(sceneProblems(majlis({ shots: long }), SECTION_PIN_LIMIT)).toEqual(["desktop pin 0.7 vh > 0.6 vh"]);
  });

  it("rejects a pin on mobile", () => {
    expect(sceneProblems(majlis({ mode: "pin" }), SECTION_PIN_LIMIT)).toContain("mobile pin 1 vh > 0 vh");
  });

  it("still checks the mobile crossing", () => {
    const long = beats.map((s, i) => (i === 2 ? { ...s, mobile: [0.7, 1.2] as [number, number] } : s));
    expect(sceneProblems(majlis({ shots: long }), SECTION_PIN_LIMIT)).toEqual(["mobile shot bloom ends past the crossing (1.2 > 1)"]);
  });
});

describe("wipeInset (D109)", () => {
  it("opens from the centre outwards, clamped to 0..1", () => {
    expect(wipeInset(0)).toBe("inset(0% 50% 0% 50%)");
    expect(wipeInset(0.5)).toBe("inset(0% 25% 0% 25%)");
    expect(wipeInset(1)).toBe("inset(0% 0% 0% 0%)");
    expect(wipeInset(-1)).toBe(wipeInset(0));
    expect(wipeInset(2)).toBe(wipeInset(1));
  });
});

describe("imageLoading (N06)", () => {
  const files = new Set(["room", "table", "desk"]);
  const has = (slot: string) => files.has(slot);
  const layers = [
    layer({ id: "hall", level: 0, slot: "hall-plate" }), // no file yet: never loads
    layer({ id: "room", level: 0, slot: "room", style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] }),
    layer({ id: "table", level: 1, slot: "table", style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] }),
    layer({ id: "desk", level: 2, slot: "desk", mobile: false }),
    layer({ id: "shade", level: 3, fx: "shade" }),
  ];
  const high = { eager: true, high: true, phoneGate: false };
  const eager = { eager: true, high: false, phoneGate: false };
  const lazy = { eager: false, high: false, phoneGate: false };

  it("the still: the first image it shows has high priority, the other phone layers load eagerly, desktop-only ones lazily", () => {
    expect(imageLoading(scene({ layers }), "still", has)).toEqual({ room: high, table: eager, desk: lazy });
  });

  it("the still skips an image its end frame hides", () => {
    const gone = [layer({ id: "flash", slot: "room", style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }, { shot: 2, to: { opacity: 0 } }] }), layers[2]];
    expect(imageLoading(scene({ layers: gone }), "still", has)).toEqual({ flash: lazy, table: high });
  });

  it("a desktop-only first image is eager with high priority on desktop, and gated from phones", () => {
    // `phoneGate`: SceneImage gives phones a placeholder source, so they never fetch the file.
    expect(imageLoading(scene({ layers: [layers[3], layers[2]] }), "still", has)).toEqual({ desk: { eager: true, high: true, phoneGate: true }, table: eager });
  });

  it("the hero (D154): desktop's first frame and the phone's still both load first; a later entrance waits", () => {
    const night = layer({ id: "night", level: 0, slot: "desk", mobile: false });
    const entrance = layer({ id: "door", level: 2, slot: "table", mobile: false, enter: { shot: 3, from: { opacity: 0 } } });
    expect(imageLoading(scene({ layers: [night, layers[1], layers[2], entrance] }), "hero", has)).toEqual({
      night: { eager: true, high: true, phoneGate: true },
      room: high,
      table: eager,
      door: lazy,
    });
  });

  it("the build scene never competes with the hero: every image is lazy", () => {
    expect(imageLoading(scene({ layers }), "build", has)).toEqual({ room: lazy, table: lazy, desk: lazy });
  });
});

describe("stillLead (N06)", () => {
  it("is the copy key of the last shot that has a line", () => {
    expect(stillLead(shots)).toBe("d");
    expect(stillLead([...shots, { id: "e", desktop: [2, 2.1], mobile: null }])).toBe("d");
    expect(stillLead([{ id: "x", desktop: [0, 1], mobile: null }])).toBeUndefined();
  });
});

// Self-audit B10 (2026-11-20): every layer above the ground asked for "50vw", so a full-frame plate
// got a 750px file for a 1440px frame (×2.1 upscale) and a phone plate 384px for ~950.
describe("layerSizes", () => {
  it("a full-frame layer fills the viewport's width", () => {
    expect(layerSizes({ block: "0", inline: "0" })).toBe("100vw");
    expect(layerSizes({ block: "0 30%", inline: "0" })).toBe("100vw");
  });
  it("a cutout asks for its share of the width (start and end insets)", () => {
    expect(layerSizes({ block: "10% 30%", inline: "26% 26%" })).toBe("48vw");
    expect(layerSizes({ block: "0", inline: "30% 58%" })).toBe("12vw");
  });
  it("one inline value insets both ends", () => {
    expect(layerSizes({ block: "0", inline: "10%" })).toBe("80vw");
  });
  it("an inset it can't read (px, calc) falls back to the full width: never too small", () => {
    expect(layerSizes({ block: "0", inline: "40px 10%" })).toBe("100vw");
  });
});
