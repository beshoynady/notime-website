import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { HxCopy } from "./hx-copy";
import { HxDial } from "./hx-dial";
import { OptionBMotion } from "./option-b-motion";

/** The graded still (first frame of the loop): the base layer, and all a phone ever loads. */
const POSTER = { src: "/images/stock/hero-hall-poster.webp", width: 1920, height: 1080 };
const VIDEO = "/video/hero-hall.webm";

/**
 * Option B · "Cinematic loop" (openhero.art's full-bleed video hero, MIT, rebuilt in our tokens):
 * a slow loop under a hall's chandelier before the guests sit (Pexels, graded espresso), the
 * title set low and to the start like a film's opening card, and a small live dial on Dubai time
 * in the corner: every second is planned, and this one is real.
 *
 * Desktop on a good connection plays the loop; phones, Save-Data, slow networks and reduced motion
 * keep the still (OptionBMotion decides). As the hero scrolls away, GSAP darkens and eases in the
 * picture; the copy is never animated (LCP, D156).
 */
export async function OptionB() {
  const hud = await getTranslations("hud");
  const poster = getImageProps({ ...POSTER, alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" }).props;
  return (
    <section id="hero" className="hx hx-b" data-tone="dark" data-header="hero" data-bg="own" data-cta-opening="" aria-labelledby="hero-title">
      <div className="hx-b-media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output; decorative */}
        <img {...poster} className="hx-b-poster" />
        <OptionBMotion video={VIDEO} poster={POSTER.src} />
        <div className="hx-b-shade" />
      </div>
      <div className="hx-b-clock" aria-hidden="true">
        <HxDial className="hx-b-dial" />
        <span className="hx-b-time" data-dubai-time={hud("city")}>
          {hud("city")} --:--:--
        </span>
      </div>
      <div className="hx-b-content frame">
        <HxCopy variant="b" />
      </div>
    </section>
  );
}
