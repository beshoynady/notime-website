import { HxCopy } from "./hx-copy";
import { HxDial } from "./hx-dial";
import { OptionCMotion } from "./option-c-motion";

/**
 * Option C · "The dial" (after 21st.dev's "Minimalist Spotlight Hero", MIT; its code sits behind
 * a login, so this is written from scratch): no photograph. A watch face far larger than the
 * screen sits half outside it at the end side, engraved in taupe on espresso; a warm light follows
 * the cursor and lights the engraving where it passes. On load the second hand sweeps up to 12 and
 * stops there: zero, the start. Scrolling turns the bezel a few degrees as the hero leaves.
 *
 * The lit copy of the dial is the same SVG under a radial mask centred on --sx/--sy: Motion moves
 * the light on desktop (pointer), GSAP on phones (the scroll), each on its own wrapper.
 */
export function OptionC() {
  return (
    <section id="hero" className="hx hx-c" data-tone="dark" data-header="hero" data-bg="own" data-cta-opening="" aria-labelledby="hero-title">
      <div className="hx-c-face" aria-hidden="true">
        <div className="hx-c-turn">
          <HxDial className="hx-c-dial hx-c-dial-base" minute={-60} sunray />
          <div className="hx-c-spot">
            <div className="hx-c-spot-m">
              <HxDial className="hx-c-dial hx-c-dial-lit" minute={-60} sunray />
            </div>
          </div>
        </div>
      </div>
      <div className="hx-c-glow" aria-hidden="true" />
      <div className="hx-c-content frame">
        <HxCopy variant="c" />
      </div>
      <OptionCMotion />
    </section>
  );
}
