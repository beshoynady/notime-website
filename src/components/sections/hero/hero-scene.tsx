"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { canvasScale, particleCount } from "@/lib/hero-math";
import { formatTimecode, secondHandAngle } from "@/lib/time";
import type { SceneState } from "./scene-state";

/** Below this width: half the bokeh discs (perf lever, DECISIONS D39; DPR cap is in canvasScale). */
const SMALL = 900;
const SPRITE = 128;

type Particle = {
  x: number;
  y: number;
  z: number;
  near: boolean;
  r: number;
  vx: number;
  vy: number;
  a: number;
  ph: number;
};

function sprite(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr;
  g.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

/** Anamorphic flare: a wide, thin horizontal streak (elevation; alpha stays ≤ 0.06). */
function flareSprite() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 32;
  const g = c.getContext("2d")!;
  g.setTransform(1, 0, 0, 1 / 16, 0, 0); // squash a radial gradient into a streak
  const gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  gr.addColorStop(0, "rgba(245,233,211,1)");
  gr.addColorStop(0.25, "rgba(234,212,171,0.55)");
  gr.addColorStop(1, "rgba(234,212,171,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 512, 512);
  return c;
}

/**
 * Hero atmosphere (layer 1), additive over the CSS espresso→night gradient: 4 swaying stage-light
 * rays, an anamorphic flare where they enter the frame, and 70–170 depth particles
 * (dust < 0.5, mid, bokeh > 0.82) drifting upward with pointer parallax by depth.
 * Each frame also turns the clock hand to real time and writes the 24fps timecode.
 *
 * Pauses when off-screen, when the tab is hidden and while a menu is open
 * (html[data-overlay-open]). Reduced motion: one draw, then hand + timecode once per second.
 */
export function HeroScene({ state }: { state: SceneState }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    const hero = cv?.closest<HTMLElement>("#hero");
    if (!cv || !ctx || !hero) return;
    const hand = hero.querySelector<SVGLineElement>("[data-hero-hand]");
    const tc = hero.querySelector<HTMLElement>("[data-hero-tc]");
    const reduced = prefersReducedMotion();
    const root = document.documentElement;

    const dust = sprite([
      [0, "rgba(255,238,210,1)"],
      [0.22, "rgba(234,212,171,0.6)"],
      [0.6, "rgba(187,154,121,0.12)"],
      [1, "rgba(187,154,121,0)"],
    ]);
    const bokeh = sprite([
      [0, "rgba(234,212,171,0.16)"],
      [0.78, "rgba(234,212,171,0.2)"],
      [0.9, "rgba(245,233,211,0.32)"],
      [1, "rgba(245,233,211,0)"],
    ]);
    const flare = flareSprite();

    let W = 0;
    let H = 0;
    let parts: Particle[] = [];
    let tx = 0;
    let ty = 0;
    let lastTc = "";
    let raf = 0;
    const t0 = performance.now();
    const flags = { onScreen: true, visible: !document.hidden, overlay: root.hasAttribute("data-overlay-open") };

    const make = (anyY: boolean): Particle => {
      let z = Math.random();
      // Small screens: half the bokeh discs (the most expensive draws) become mid particles.
      if (z > 0.82 && W < SMALL && Math.random() < 0.5) z = 0.5 + Math.random() * 0.32;
      const near = z > 0.82;
      return {
        x: Math.random() * W,
        y: anyY ? Math.random() * H : H + 60,
        z,
        near,
        r: near ? 18 + Math.random() * 46 : 1.5 + z * 9,
        vy: -(0.06 + z * 0.32),
        vx: (Math.random() - 0.5) * 0.14,
        a: near ? 0.12 + Math.random() * 0.22 : 0.22 + Math.random() * 0.6,
        ph: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      const scale = canvasScale(w, h, devicePixelRatio);
      cv.width = Math.round(w * scale);
      cv.height = Math.round(h * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      const n = particleCount(w, h);
      // Re-seed only when the count changes by more than 10%; otherwise rescale positions,
      // so an address-bar resize mid-warp doesn't reshuffle the field.
      if (!parts.length || Math.abs(n - parts.length) / parts.length > 0.1) {
        W = w;
        H = h;
        parts = Array.from({ length: n }, () => make(true));
      } else {
        const sx = w / W;
        const sy = h / H;
        for (const p of parts) {
          p.x *= sx;
          p.y *= sy;
        }
        W = w;
        H = h;
      }
    };

    const clock = (now: number) => {
      if (hand) hand.setAttribute("transform", `rotate(${(secondHandAngle(new Date()) * state.handIntro).toFixed(2)} 300 300)`);
      if (tc) {
        const txt = formatTimecode(now - t0);
        if (txt !== lastTc) {
          tc.textContent = txt;
          lastTc = txt;
        }
      }
    };

    let last = 0;
    const draw = (t: number) => {
      // Drift is per 60fps frame, scaled by real elapsed time so slow devices don't slow
      // the motion; capped so a resumed loop doesn't jump.
      const k = last ? Math.min((t - last) / (1000 / 60), 3) : 1;
      last = t;
      const ease = 1 - Math.pow(1 - 0.045, k);
      tx += (state.pointer.x - tx) * ease;
      ty += (state.pointer.y - ty) * ease;
      // Transparent canvas: the background gradient is the CSS one on .hero, and the
      // canvas blends with plus-lighter (hero.css), so it is additive like the "lighter" ops
      // below without repainting a full-frame gradient each frame (fill rate, DECISIONS D39).
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      const sway = Math.sin(t * 0.00011);
      let flareX = 0;
      for (let i = 0; i < 4; i++) {
        const ang = Math.PI / 2 + (i - 1.5) * 0.26 + Math.sin(t * 0.00011 + i * 1.7) * 0.12;
        const w = 0.07 + 0.035 * Math.sin(t * 0.00027 + i * 2.1);
        const ox = W * (0.28 + i * 0.15) + tx * 24;
        const oy = -H * 0.18;
        const len = H * 1.7;
        flareX += ox + Math.cos(ang) * (-oy / Math.sin(ang)); // where the ray crosses y = 0
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.cos(ang - w) * len, oy + Math.sin(ang - w) * len);
        ctx.lineTo(ox + Math.cos(ang + w) * len, oy + Math.sin(ang + w) * len);
        ctx.closePath();
        const lg = ctx.createLinearGradient(ox, oy, ox, oy + len * 0.9);
        lg.addColorStop(0, "rgba(234,212,171,.11)");
        lg.addColorStop(0.45, "rgba(234,212,171,.035)");
        lg.addColorStop(1, "rgba(234,212,171,0)");
        ctx.globalAlpha = state.alpha;
        ctx.fillStyle = lg;
        ctx.fill();
      }
      // Flare sits where the rays meet the top of the frame and breathes with their sway.
      ctx.globalAlpha = Math.min(0.06, 0.045 + 0.015 * sway) * state.alpha;
      const fw = W * 0.95;
      const fh = Math.max(18, H * 0.05);
      ctx.drawImage(flare, flareX / 4 - fw / 2, H * 0.035 - fh / 2, fw, fh);

      const cx = W / 2;
      const cy = H / 2;
      const step = reduced ? 0 : k * state.speed;
      for (const p of parts) {
        p.y += p.vy * step;
        p.x += p.vx * step;
        if (!reduced) p.ph += 0.012 * k;
        if (p.y < -90) Object.assign(p, make(false));
        const f = 1 + (state.spread - 1) * (0.35 + p.z * 1.1);
        const px = cx + (p.x - cx) * f + tx * (8 + p.z * 70);
        const py = cy + (p.y - cy) * f + ty * (6 + p.z * 44);
        const s = p.r * 2 * (1 + (state.spread - 1) * p.z);
        ctx.globalAlpha = p.a * state.alpha * (0.62 + 0.38 * Math.sin(p.ph * 1.3));
        ctx.drawImage(p.near ? bokeh : dust, px - s / 2, py - s / 2, s, s);
      }
      clock(t);
    };

    const running = () => flags.onScreen && flags.visible && !flags.overlay;
    const loop = (t: number) => {
      raf = 0;
      if (!running()) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!reduced && !raf && running()) raf = requestAnimationFrame(loop);
    };

    resize();
    let interval = 0;
    if (reduced) {
      draw(performance.now());
      interval = window.setInterval(() => clock(performance.now()), 1000);
    } else kick();

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduced) draw(performance.now());
      }, 150);
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      flags.onScreen = e.isIntersecting;
      kick();
    });
    io.observe(cv);
    const onVis = () => {
      flags.visible = !document.hidden;
      kick();
    };
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => {
      flags.overlay = root.hasAttribute("data-overlay-open");
      kick();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-overlay-open"] });

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [state]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
