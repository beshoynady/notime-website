import type { CSSProperties } from "react";
import { Numeral } from "@/components/ui/numeral";
import type { Locale, Localized } from "@/content";
import { storyPhoto, type StoryBeat } from "@/content/photo-stories";
import { StoryImage } from "./story-image";
import { PhotoStoryMotion } from "./photo-story-motion";
import "./photo-story.css";

/**
 * Split screen (D109, technique 6): each beat's line holds beside its photo while the photo
 * scrolls past, then the next beat takes over. One DOM for both widths: below 900px the beats
 * stack (line, then photo) with no pin. Each photo opens with a mask wipe and settles from a slight
 * push-in, scrubbed (PhotoStoryMotion, GSAP). Server-rendered; without JS or under reduced motion,
 * every photo is simply there.
 */
export function PhotoStory({
  id,
  eyebrow,
  title,
  beats,
  locale,
  tone = "dark",
}: {
  id: string;
  eyebrow: Localized<string>;
  title: Localized<string>;
  beats: readonly StoryBeat[];
  locale: Locale;
  tone?: "dark" | "light";
}) {
  const titleId = `${id}-title`;
  return (
    <section id={id} data-tone={tone} aria-labelledby={titleId} className="ps section-pad">
      <div className="frame">
        <header className="ps-head">
          <p className="sec-eyebrow text-eyebrow text-champagne">{eyebrow[locale]}</p>
          <h2 id={titleId} className="text-h1 ps-title">
            {title[locale]}
          </h2>
        </header>
        <ol className="ps-beats">
          {beats.map((beat, i) => {
            const photo = storyPhoto(beat.photo);
            return (
              <li key={beat.photo} className="ps-beat">
                <div className="ps-text">
                  <Numeral className="ps-num">{String(i + 1).padStart(2, "0")}</Numeral>
                  <h3 className="ps-beat-title">{beat.title[locale]}</h3>
                  <p className="ps-beat-body">{beat.body[locale]}</p>
                </div>
                <figure className="ps-photo" style={{ "--ar": `${photo.width} / ${photo.height}` } as CSSProperties}>
                  <div className="ps-mask">
                    <div className="ps-push">
                      <StoryImage photo={photo} locale={locale} sizes="(min-width: 900px) 56vw, calc(100vw - 32px)" />
                    </div>
                  </div>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
      <PhotoStoryMotion />
    </section>
  );
}
