import type { Locale } from "@/content";
import { productsCopy } from "@/content/software/page";

/**
 * Concept screens for the two products (brief, Images): clean UI drawn in HTML in the brand
 * palette. They are concepts: the frame carries "Preview" and the data "Example" (labelled by
 * the card). Decorative for assistive tech; the card's text lists the features.
 */
const d = productsCopy.demo;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="sw-ps">
      <div className="sw-ps-screen">{children}</div>
      <figcaption className="sw-ps-cap">{title}</figcaption>
    </figure>
  );
}

export function MinuteZeroScreens({ locale }: { locale: Locale }) {
  const s = productsCopy.items["minute-zero"].screens;
  return (
    <div className="sw-ps-row" aria-hidden="true">
      <Panel title={s[0][locale]}>
        <div className="sw-ps-kpis">
          <span>
            <b className="tabular">248</b>
            {d.arrived[locale]}
          </span>
          <span>
            <b className="tabular">320</b>
            {d.expected[locale]}
          </span>
        </div>
        <div className="sw-ps-bars">
          {[0.3, 0.55, 0.9, 0.7, 0.45, 0.2].map((h, i) => (
            <i key={i} style={{ transform: `scaleY(${h})` }} />
          ))}
        </div>
      </Panel>
      <Panel title={s[1][locale]}>
        <div className="sw-ps-scan">
          <span className="sw-ps-qr">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} className={[0, 1, 2, 4, 6, 9, 11, 13, 14, 15].includes(i) ? "on" : undefined} />
            ))}
          </span>
          <span className="sw-ps-hint">{d.scan[locale]}</span>
          <span className="sw-ps-toast">{d.valid[locale]}</span>
        </div>
      </Panel>
      <Panel title={s[2][locale]}>
        <ul className="sw-ps-list">
          {d.guests.map((g, i) => (
            <li key={i}>
              <span>{g[locale]}</span>
              <b className={i < 2 ? "is-in" : undefined}>{i < 2 ? d.in[locale] : d.due[locale]}</b>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export function PeakHourScreens({ locale }: { locale: Locale }) {
  const s = productsCopy.items["peak-hour"].screens;
  return (
    <div className="sw-ps-row" aria-hidden="true">
      <Panel title={s[0][locale]}>
        <div className="sw-ps-tables">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n} className={[1, 3, 4].includes(n) ? "is-seated" : undefined}>
              <b className="tabular">{n}</b>
              {[1, 3, 4].includes(n) ? d.seated[locale] : d.free[locale]}
            </span>
          ))}
        </div>
      </Panel>
      <Panel title={s[1][locale]}>
        <div className="sw-ps-kitchen">
          <div>
            <span className="sw-ps-col">{d.preparing[locale]}</span>
            <i className="sw-ps-ticket">
              {d.order[locale]} <b className="tabular">14</b>
            </i>
            <i className="sw-ps-ticket">
              {d.order[locale]} <b className="tabular">15</b>
            </i>
          </div>
          <div>
            <span className="sw-ps-col">{d.ready[locale]}</span>
            <i className="sw-ps-ticket is-ready">
              {d.order[locale]} <b className="tabular">12</b>
            </i>
          </div>
        </div>
      </Panel>
      <Panel title={s[2][locale]}>
        <div className="sw-ps-kpis">
          <span>
            <b className="tabular">86</b>
            {d.covers[locale]}
          </span>
          <span>
            <b className="tabular">41</b>
            {d.orders[locale]}
          </span>
        </div>
        <div className="sw-ps-bars sw-ps-bars-peak">
          {[0.2, 0.35, 0.95, 0.6, 0.3].map((h, i) => (
            <i key={i} className={i === 2 ? "is-peak" : undefined} style={{ transform: `scaleY(${h})` }} />
          ))}
        </div>
        <span className="sw-ps-hint">{d.peak[locale]}</span>
      </Panel>
    </div>
  );
}
