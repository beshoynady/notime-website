import type { Locale } from "@/content";
import { MOODBOARD as D, type Mood } from "@/content/modules/candle-moodboard";
import { EventPhoto } from "../event-photo";

/** The three photos of a mood (no hooks: shared by the fallback and the client module). */
export function MoodPhotos({ mood, locale }: { mood: Mood; locale: Locale }) {
  return (
    <div className="cm-photos">
      {mood.photos.map((p, i) => (
        <EventPhoto key={p.src} photo={p} locale={locale} sizes={i === 0 ? "(min-width: 900px) 30vw, 60vw" : "(min-width: 900px) 20vw, 40vw"} />
      ))}
    </div>
  );
}

/** The board's contents: the mood's line, its palette, florals and keepsake. */
export function MoodBoardBody({ mood, locale }: { mood: Mood; locale: Locale }) {
  return (
    <>
      <p className="cm-line">{mood.line[locale]}</p>
      <div>
        <span className="cm-label">{D.paletteLabel[locale]}</span>
        <ul className="cm-swatches">
          {mood.swatches.map((s) => (
            <li key={s.hex} className="cm-swatch">
              <i style={{ background: s.hex }} aria-hidden="true" />
              {s.name[locale]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <span className="cm-label">{D.floralsLabel[locale]}</span>
        <p className="cm-text">{mood.florals[locale]}</p>
      </div>
      <div>
        <span className="cm-label">{D.keepsakeLabel[locale]}</span>
        <p className="cm-text">{mood.keepsake[locale]}</p>
      </div>
    </>
  );
}
