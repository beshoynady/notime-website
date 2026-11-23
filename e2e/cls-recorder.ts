// Injected with page.addInitScript; it runs in the page, so it must stay self-contained.
/**
 * Evidence recorder (D168), injected before any page script. It keeps, from navigation start:
 * - every layout shift with each source's node and both rects;
 * - every element that turns `position: fixed` or back (ScrollTrigger pins work that way; a full
 *   screen box pinned at the top scores exactly 1.0), with its inline style and box;
 * - each frame's change in scrollY, document height and How we work's stage box;
 * - font faces (status, load events) and font, image and script resource timings.
 * Nothing is filtered: a failure writes all of it to cls-evidence.json in the test's output folder.
 */
export function recorder() {
  type Rect = { x: number; y: number; width: number; height: number };
  type Shift = { value: number; startTime: number; hadRecentInput: boolean; sources: { node?: Node; previousRect: Rect; currentRect: Rect }[] };
  const now = () => Math.round(performance.now());
  const name = (n?: Node | null): string => {
    if (!(n instanceof Element)) return String(n?.nodeName);
    const id = n.id ? `#${n.id}` : "";
    const cls = [...n.classList].slice(0, 4).map((c) => `.${c}`).join("");
    const parent = n.parentElement && !n.id ? `${name(n.parentElement).split(" > ").pop()} > ` : "";
    return `${parent}${n.tagName.toLowerCase()}${id}${cls}`;
  };
  const box = (r: Rect) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
  const ev = {
    cls: 0,
    viewport: { w: innerWidth, h: innerHeight },
    shifts: [] as unknown[],
    fixed: [] as unknown[],
    frames: [] as unknown[],
    fontEvents: [] as unknown[],
    marks: [] as unknown[],
    pinWrites: [] as unknown[],
  };
  (window as unknown as { __ev: typeof ev }).__ev = ev;

  new PerformanceObserver((list) => {
    for (const e of list.getEntries() as unknown as Shift[]) {
      if (e.hadRecentInput) continue;
      ev.cls += e.value;
      ev.shifts.push({
        t: Math.round(e.startTime),
        value: e.value,
        scrollY: Math.round(scrollY),
        sources: e.sources.map((s) => ({ node: name(s.node), from: box(s.previousRect), to: box(s.currentRect) })),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });

  // Elements entering or leaving position: fixed, through a style or class change.
  const fixedNow = new WeakSet<Element>();
  const check = (el: Element) => {
    const pos = getComputedStyle(el).position;
    const was = fixedNow.has(el);
    if ((pos === "fixed") === was) return;
    if (pos === "fixed") fixedNow.add(el);
    else fixedNow.delete(el);
    ev.fixed.push({ t: now(), node: name(el), position: pos, style: (el as HTMLElement).style?.cssText ?? "", box: box(el.getBoundingClientRect()), scrollY: Math.round(scrollY) });
  };
  const start = () => {
    new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "attributes" && m.target instanceof Element) {
          check(m.target);
          // How we work's pin (the 1.0 source, D168): every write with the value it replaced, so
          // a pin set and reverted inside one task still shows.
          if (m.target.matches(".process-stage, .process-pin") && ev.pinWrites.length < 400)
            ev.pinWrites.push({ t: now(), node: name(m.target), attr: m.attributeName, old: m.oldValue ?? "", now: m.target.getAttribute(m.attributeName!) ?? "" });
        }
        if (m.type === "childList") {
          for (const n of m.addedNodes) {
            if (!(n instanceof Element)) continue;
            // A pin spacer is inserted around the pinned box.
            if (n.classList.contains("pin-spacer") || n.querySelector?.(".pin-spacer")) ev.marks.push({ t: now(), mark: "pin-spacer added", node: name(n), box: box(n.getBoundingClientRect()) });
          }
        }
      }
    }).observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ["style", "class"], subtree: true, childList: true });
  };
  if (document.documentElement) start();
  else document.addEventListener("readystatechange", start, { once: true });

  // Per frame, only what changed: scrollY, document height, and the How we work stage.
  let last = "";
  const frame = () => {
    const stage = document.querySelector(".process-stage");
    const s = stage ? getComputedStyle(stage) : null;
    const r = stage?.getBoundingClientRect();
    const row = {
      scrollY: Math.round(scrollY),
      docH: document.documentElement?.scrollHeight ?? 0,
      stage: stage && r && s ? `${s.position} top ${Math.round(r.top)} h ${Math.round(r.height)} ${s.transform === "none" ? "" : s.transform}` : "absent",
      htmlAttrs: document.documentElement ? [...document.documentElement.attributes].map((a) => a.name).filter((n) => n.startsWith("data-")).join(",") : "",
    };
    const key = JSON.stringify(row);
    if (key !== last) {
      ev.frames.push({ t: now(), ...row });
      last = key;
    }
    if (performance.now() < 15_000) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  document.fonts?.addEventListener("loadingdone", (e) => ev.fontEvents.push({ t: now(), type: "loadingdone", faces: (e as FontFaceSetLoadEvent).fontfaces.map((f) => `${f.family} ${f.weight} ${f.style}`) }));
  document.fonts?.addEventListener("loadingerror", (e) => ev.fontEvents.push({ t: now(), type: "loadingerror", faces: (e as FontFaceSetLoadEvent).fontfaces.map((f) => `${f.family} ${f.weight}`) }));
  document.addEventListener("DOMContentLoaded", () => ev.marks.push({ t: now(), mark: "DOMContentLoaded", scrollY: Math.round(scrollY) }));
  addEventListener("load", () => ev.marks.push({ t: now(), mark: "load", scrollY: Math.round(scrollY) }));
  addEventListener("scroll", () => ev.marks.push({ t: now(), mark: "scroll", scrollY: Math.round(scrollY) }), { passive: true });
  addEventListener("resize", () => ev.marks.push({ t: now(), mark: "resize", w: innerWidth, h: innerHeight }));
}
