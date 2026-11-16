import type { Locale } from "@/content";
import { AGENDA } from "@/content/modules/agenda-timeline";
import { ExampleLabel } from "../example-label";
import "../events-modules.css";

/**
 * The agenda as markup (no hooks): the server fallback renders it lit, the client module renders
 * it and lets GSAP light the slots. Times are LTR-isolated Western digits (D50).
 */
export function AgendaView({ locale, lit = true }: { locale: Locale; lit?: boolean }) {
  return (
    <div className="evm" data-evm="agenda">
      <div className="evm-head">
        <h3 className="evm-title">{AGENDA.title[locale]}</h3>
        {AGENDA.example && <ExampleLabel />}
      </div>
      <p className="evm-note">{AGENDA.note[locale]}</p>
      <div className="ag-list">
        <span className="ag-rail" aria-hidden="true" />
        <span className="ag-fill" aria-hidden="true" />
        <ol className="ag-slots">
        {AGENDA.slots.map((s) => (
          <li key={s.time} className="ag-slot" data-lit={lit ? "" : undefined}>
            <span className="ag-time">
              <bdi lang="en" className="font-en tabular">
                {s.time}
              </bdi>
            </span>
            <span className="ag-dot" aria-hidden="true" />
            <div className="ag-body">
              <p className="ag-label">{s.label[locale]}</p>
              <p className="ag-handled">{s.handled[locale]}</p>
            </div>
          </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
