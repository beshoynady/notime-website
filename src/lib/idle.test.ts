import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { afterFirstPaint } from "./idle";

type IdleCb = () => void;

describe("afterFirstPaint", () => {
  let rafCbs: FrameRequestCallback[];
  let idleCalls: { cb: IdleCb; opts?: { timeout?: number } }[];

  beforeEach(() => {
    vi.useFakeTimers();
    rafCbs = [];
    idleCalls = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => rafCbs.push(cb));
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      rafCbs[id - 1] = () => {};
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const frame = () => rafCbs.splice(0).forEach((cb) => cb(0));

  it("waits for a frame, then the task after it, then an idle callback with the timeout", () => {
    vi.stubGlobal("requestIdleCallback", (cb: IdleCb, opts?: { timeout?: number }) => idleCalls.push({ cb, opts }));
    vi.stubGlobal("cancelIdleCallback", () => {});
    const cb = vi.fn();
    afterFirstPaint(cb, { timeout: 400 });
    expect(idleCalls).toHaveLength(0);
    frame();
    expect(idleCalls).toHaveLength(0); // still before paint: rAF runs ahead of the frame
    vi.runOnlyPendingTimers(); // the task after the painted frame
    expect(idleCalls).toHaveLength(1);
    expect(idleCalls[0].opts).toEqual({ timeout: 400 });
    expect(cb).not.toHaveBeenCalled();
    idleCalls[0].cb();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("falls back to a short timer where requestIdleCallback is missing (Safari)", () => {
    vi.stubGlobal("requestIdleCallback", undefined);
    const cb = vi.fn();
    afterFirstPaint(cb, { timeout: 400 });
    frame();
    vi.advanceTimersByTime(0);
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("cancel stops a pending callback at every stage", () => {
    vi.stubGlobal("requestIdleCallback", (cb: IdleCb) => idleCalls.push({ cb }));
    vi.stubGlobal("cancelIdleCallback", vi.fn());
    const before = vi.fn();
    afterFirstPaint(before)();
    frame();
    vi.runAllTimers();
    expect(before).not.toHaveBeenCalled();

    const later = vi.fn();
    const cancel = afterFirstPaint(later);
    frame();
    vi.runOnlyPendingTimers();
    cancel();
    idleCalls.at(-1)?.cb(); // even if the browser still fires it
    expect(later).not.toHaveBeenCalled();
  });
});
