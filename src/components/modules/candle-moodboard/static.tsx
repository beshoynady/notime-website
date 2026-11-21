import { MOODBOARD as D } from "@/content/modules/candle-moodboard";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { MoodBoardBody, MoodPhotos } from "./board";
import "../events-modules.css";

/** Server fallback (the reduced-motion state): the first mood, static, its tabs drawn in place. */
export function CandleMoodboardStatic({ locale }: ModuleProps) {
  const mood = D.moods[0];
  return (
    <div className="evm" data-evm="moodboard">
      <div className="evm-head">
        <h3 className="evm-title">{D.title[locale]}</h3>
        {D.example && <ExampleLabel />}
      </div>
      <p className="evm-note">{D.note[locale]}</p>
      <div className="evm-row" role="group" aria-label={D.moodsLabel[locale]}>
        {D.moods.map((m) => (
          <button key={m.id} type="button" className="evm-chip" aria-pressed={m.id === mood.id} disabled>
            {m.label[locale]}
          </button>
        ))}
      </div>
      <div className="cm-wrap">
        <span className="cm-glow" aria-hidden="true" />
        <div className="cm-grid">
          <MoodPhotos mood={mood} locale={locale} />
          <div className="cm-board">
            <MoodBoardBody mood={mood} locale={locale} />
          </div>
        </div>
      </div>
      <p className="evm-live" />
    </div>
  );
}
