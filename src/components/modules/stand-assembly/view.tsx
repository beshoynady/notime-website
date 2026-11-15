import type { Locale } from "@/content";
import { STAND } from "@/content/modules/stand-assembly";
import { ExampleLabel } from "../example-label";
import { StandSvg } from "./stand-svg";
import "../events-modules.css";

const ORDER = STAND.parts.map((p) => p.id);

/** The stand and its six steps (no hooks): the server renders it assembled, every step lit. */
export function StandView({ locale }: { locale: Locale }) {
  const total = STAND.parts.length;
  return (
    <div className="evm" data-evm="stand">
      <div className="evm-head">
        <h3 className="evm-title">{STAND.title[locale]}</h3>
        {STAND.example && <ExampleLabel kind="example" />}
      </div>
      <p className="evm-note">{STAND.note[locale]}</p>
      <div className="sa-grid">
        <div className="sa-drawing">
          <StandSvg order={ORDER} />
        </div>
        <ol className="sa-steps">
          {STAND.parts.map((p, i) => (
            <li key={p.id} className="sa-step" data-step={p.id} data-lit="">
              <span className="sa-step-num font-en" aria-hidden="true">
                {i + 1}
              </span>
              <p className="sa-step-label">
                <span className="sr-only">{STAND.stepLabel[locale].replace("{n}", String(i + 1)).replace("{total}", String(total))}: </span>
                {p.label[locale]}
              </p>
              <p className="sa-step-line">{p.line[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
