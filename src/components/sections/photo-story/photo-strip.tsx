import type { CSSProperties } from "react";
import type { Locale, Localized } from "@/content";
import { storyPhoto, type StoryPhotoKey } from "@/content/photo-stories";
import { StoryImage } from "./story-image";
import { PhotoStripMotion } from "./photo-strip-motion";
import "./photo-strip.css";

/**
 * A pinned horizontal photo strip (D109, technique 2). Desktop with motion: the strip's wrapper
 * is as tall as its own horizontal overflow plus one screen, the stage inside it is sticky, and
 * GSAP scrubs the track's x across that height (PhotoStripMotion), towards inline-end, so it
 * mirrors in Arabic. The height comes from the frames' ratios in CSS, so it is reserved from the
 * server render and nothing shifts when the script arrives. Phones, reduced motion and no JS: a
 * native swipe row with snap points (mirrored by the page's direction).
 *
 * Its own section (a region named by its title) with a ground tone for the ToneController; the
 * title is an h2, as a top-level block of the page (home: right after the hero, N05).
 */
export function PhotoStrip({
  id,
  eyebrow,
  title,
  frames,
  locale,
  tone,
}: {
  id: string;
  tone: "dark" | "light";
  eyebrow: Localized<string>;
  title: Localized<string>;
  frames: readonly { photo: StoryPhotoKey; caption: Localized<string> }[];
  locale: Locale;
}) {
  const titleId = `${id}-title`;
  const photos = frames.map((f) => ({ ...f, p: storyPhoto(f.photo) }));
  const ratios = photos.reduce((sum, { p }) => sum + p.width / p.height, 0);
  const style = { "--strip-r": ratios.toFixed(3), "--strip-n": frames.length } as CSSProperties;
  return (
    <section className="pstrip" id={id} data-tone={tone} aria-labelledby={titleId} style={style}>
      <div className="pstrip-stage">
        <div className="frame pstrip-head">
          <p className="text-eyebrow text-champagne">{eyebrow[locale]}</p>
          <h2 id={titleId} className="pstrip-title">
            {title[locale]}
          </h2>
        </div>
        {/* Focusable, so a keyboard can scroll the swipe row (phones, reduced motion); WCAG 2.1.1. */}
        <ul className="pstrip-track" tabIndex={0} aria-labelledby={titleId}>
          {photos.map(({ photo, p, caption }) => (
            <li key={photo} className="pstrip-frame" style={{ "--ar": `${p.width} / ${p.height}` } as CSSProperties}>
              <figure>
                <div className="pstrip-img">
                  <StoryImage photo={p} locale={locale} sizes="(min-width: 900px) 46vh, 72vw" />
                </div>
                <figcaption className="text-eyebrow">{caption[locale]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <PhotoStripMotion />
    </section>
  );
}
