import { getLocale } from "next-intl/server";
import { getImageProps } from "next/image";
import { getCategories, type Locale } from "@/content";
import { media } from "@/content/media";
import { HxCopy } from "./hx-copy";
import { HxDial } from "./hx-dial";
import { OptionAMotion } from "./option-a-motion";

/**
 * Option A · "Countdown to zero" (the owner's brief): the five services, one photograph each,
 * gather around the clock while it counts the last five seconds; at zero the fifth lands on 12
 * and the promise is all that is left in the middle. The title, lead and actions are on screen
 * from the first paint (first-screen.spec); the story plays around them.
 *
 * The resting state in CSS is the end of the story (no JS, reduced motion). Desktop: the section
 * is 220vh with a sticky stage, the scroll scrubs it (no pin spacer, nothing to shift). Phones:
 * one short timed gathering on load, no scrub.
 *
 * Prototype: the cards reuse the category cards' photos; the final build gives the hero five
 * photos of its own (D169).
 */
export async function OptionA() {
  const locale = (await getLocale()) as Locale;
  const cards = getCategories().map((c) => ({ slug: c.slug, title: c.title[locale], photo: c.photo ? media(c.photo) : null }));
  return (
    <section id="hero" className="hx hx-a" data-tone="dark" data-header="hero" data-bg="own" data-cta-opening="" aria-labelledby="hero-title">
      <OptionAMotion />
      <div className="hx-a-stage">
        <div className="hx-a-dial-wrap" aria-hidden="true">
          <HxDial className="hx-a-dial" second={0} minute={0} />
        </div>
        <p className="hx-a-tc" aria-hidden="true">
          00:00:<span className="hx-a-tc-s">00</span>
        </p>
        <ul className="hx-a-cards" aria-hidden="true">
          {cards.map((c, i) => (
            <li key={c.slug} className="hx-a-card" data-i={i}>
              <figure>
                <span className="hx-a-photo">
                  {/* Eager: the cards start outside the frame, where lazy loading would never fetch them. */}
                  {c.photo && (
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output; decorative
                    <img {...getImageProps({ src: c.photo.file, width: c.photo.width, height: c.photo.height, alt: "", sizes: "128px", loading: "eager", fetchPriority: "low" }).props} />
                  )}
                </span>
                <figcaption>{c.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="hx-a-content frame">
          <HxCopy variant="a" />
        </div>
      </div>
    </section>
  );
}
