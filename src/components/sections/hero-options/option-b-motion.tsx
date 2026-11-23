"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

type Conn = { saveData?: boolean; effectiveType?: string };
const noop = () => () => {};

/** Desktop, no reduced motion, no Save-Data, not a 2G/3G connection: only then the loop loads. */
function canPlay() {
  if (typeof window === "undefined") return false;
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (c?.saveData || /(^|-)2g|3g/.test(c?.effectiveType ?? "")) return false;
  return matchMedia("(min-width: 900px)").matches && !prefersReducedMotion();
}

/**
 * Option B's client part: mounts the loop when it may play (it fades in over the poster once it
 * plays), runs the Dubai clock in the corner, and scrubs the picture as the hero leaves (GSAP, on
 * .hx-b-media only).
 */
export function OptionBMotion({ video, poster }: { video: string; poster: string }) {
  // Decided once on the client; the server and the first hydration pass render the still only.
  const play = useSyncExternalStore(noop, canPlay, () => false);
  const ref = useRef<HTMLVideoElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);

  // The live clock: Dubai time, the second hand stepping each second.
  useEffect(() => {
    const section = anchor.current?.closest(".hx-b");
    const label = section?.querySelector<HTMLElement>("[data-dubai-time]");
    const second = section?.querySelector<SVGGElement>(".hx-b-dial .hx-dial-second");
    const minute = section?.querySelector<SVGGElement>(".hx-b-dial .hx-dial-minute");
    const fmt = new Intl.DateTimeFormat(document.documentElement.lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", {
      timeZone: "Asia/Dubai",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const city = label?.dataset.dubaiTime ?? "";
    const tick = () => {
      const now = new Date();
      const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
      if (label) label.textContent = `${city} ${parts.hour}:${parts.minute}:${parts.second}`;
      second?.style.setProperty("transform", `rotate(${Number(parts.second) * 6}deg)`);
      minute?.style.setProperty("transform", `rotate(${Number(parts.minute) * 6 + Number(parts.second) / 10}deg)`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    const section = anchor.current?.closest<HTMLElement>(".hx-b");
    const media = section?.querySelector(".hx-b-media");
    if (!section || !media || prefersReducedMotion()) return;
    gsap.to(media, { scale: 1.08, filter: "brightness(0.55)", ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
  }, []);

  return (
    <>
      <span ref={anchor} hidden />
      {play && (
        <video
          ref={ref}
          className="hx-b-video"
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={(e) => e.currentTarget.setAttribute("data-playing", "")}
        />
      )}
    </>
  );
}
