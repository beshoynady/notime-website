import { LAUNCH_REVEAL as D } from "@/content/modules/launch-reveal";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { LaunchPlinth, LaunchSetting } from "./launch-stage";
import "../events-modules.css";

/** Server fallback (the reduced-motion state): the curtain open on the product, the first setting. */
export function LaunchRevealStatic({ locale }: ModuleProps) {
  const format = D.formats[0];
  return (
    <div className="evm" data-evm="launch">
      <div className="evm-head">
        <h3 className="evm-title">{D.title[locale]}</h3>
        {D.example && <ExampleLabel kind="example" />}
      </div>
      <p className="evm-note">{D.note[locale]}</p>
      <div className="lr-stage">
        <div className="lr-setting">
          <LaunchSetting format={format.id} />
        </div>
        <div className="lr-spot" aria-hidden="true" />
        <div className="lr-plinth">
          <LaunchPlinth />
        </div>
        <p className="lr-product-label">{D.productLabel[locale]}</p>
      </div>
      <div className="lr-controls">
        <button type="button" className="evm-btn evm-btn-solid" disabled>
          {D.start[locale]}
        </button>
        <div className="evm-row" role="group" aria-label={D.formatsLabel[locale]}>
          {D.formats.map((f) => (
            <button key={f.id} type="button" className="evm-chip" aria-pressed={f.id === format.id} disabled>
              {f.label[locale]}
            </button>
          ))}
        </div>
      </div>
      <p className="lr-format-line">{format.line[locale]}</p>
      <p className="evm-live" />
    </div>
  );
}
