import { getTranslations } from "next-intl/server";
import { CHECKIN, checkinCount } from "@/content/film";
import { formatTimecode } from "@/lib/time";

/**
 * What the film draws in code over its plates (decorative, aria-hidden by the plate): real text in
 * the brand's faces, never baked into a picture, so it stays sharp, localized and light. Screens
 * that show data carry an "Example" badge (CLAUDE.md: demo data is labelled).
 */

/** Creative: a cinema viewfinder (frame corners, REC, a timecode FilmMotion counts down to zero). */
export function Viewfinder() {
  return (
    <div className="film-vf" dir="ltr">
      <span className="film-vf-c" data-c="a" />
      <span className="film-vf-c" data-c="b" />
      <span className="film-vf-c" data-c="c" />
      <span className="film-vf-c" data-c="d" />
      <span className="film-vf-rec" lang="en">
        REC
      </span>
      <span className="film-vf-tc" lang="en" data-film-tc="">
        {formatTimecode(0)}
      </span>
      <span className="film-vf-cross" />
    </div>
  );
}

/** The countdown digits of the campaign (fixed example values; always LTR, tabular). */
const COUNTDOWN = ["03", "14", "22"] as const;

async function CampaignFace({ variant }: { variant: "wall" | "phone" }) {
  const t = await getTranslations("film");
  const units = [t("campaign.days"), t("campaign.hours"), t("campaign.minutes")];
  return (
    <div className="film-campaign" data-variant={variant}>
      <span className="film-example">{t("example")}</span>
      <p className="film-campaign-kicker">{t("campaign.kicker")}</p>
      <p className="film-campaign-title">{t("campaign.title")}</p>
      <div className="film-campaign-count">
        {COUNTDOWN.map((d, i) => (
          <span key={i} className="film-campaign-unit">
            <b dir="ltr">{d}</b>
            <small>{units[i]}</small>
          </span>
        ))}
      </div>
      {variant === "phone" && <span className="film-campaign-rsvp">{t("campaign.rsvp")}</span>}
    </div>
  );
}

/** Marketing: the hall's blank wall becomes the screen (placed on the plate's wall). */
export function CampaignWall() {
  return (
    <div className="film-wall" data-film-screen="">
      <CampaignFace variant="wall" />
    </div>
  );
}

/** Marketing: the same campaign on a phone in the foreground. */
export function CampaignPhone() {
  return (
    <div className="film-phone" data-film-device="">
      <div className="film-phone-screen">
        <CampaignFace variant="phone" />
      </div>
    </div>
  );
}

/** Print & Gifts: a printed name card at the seat. */
export async function PrintedCard() {
  const t = await getTranslations("film");
  return (
    <div className="film-card" data-film-card="">
      <span className="film-card-rule" />
      <p className="film-card-title">{t("card.title")}</p>
      <p className="film-card-table">{t("card.table")}</p>
      <span className="film-card-rule" />
    </div>
  );
}

/** A decorative QR-like mark: a fixed 21×21 pattern with the three finder squares. */
const QR = (() => {
  const n = 21;
  const cells: [number, number][] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y)) continue;
      if ((x * 7 + y * 13 + x * y) % 5 < 2) cells.push([x, y]);
    }
  return cells;
})();

function QrMark() {
  const sq = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" transform="translate(0.5 0.5) scale(0.86)" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg className="film-qr" viewBox="0 0 21 21" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      {sq(0, 0)}
      {sq(14, 0)}
      {sq(0, 14)}
      {QR.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" />
      ))}
    </svg>
  );
}

/** Software & Digital: a tablet with the QR check-in screen; the count rises with the scroll. */
export async function CheckinTablet() {
  const t = await getTranslations("film");
  return (
    <div className="film-tablet" data-film-device="">
      <div className="film-tablet-screen">
        <div className="film-ci-head">
          <p>{t("checkin.title")}</p>
          <span className="film-example">{t("example")}</span>
        </div>
        <div className="film-ci-body">
          <div className="film-ci-scan">
            <QrMark />
            <small>{t("checkin.scan")}</small>
          </div>
          <div className="film-ci-guest">
            <p className="film-ci-name">{t("checkin.guest")}</p>
            <p className="film-ci-table">{t("checkin.table")}</p>
            <p className="film-ci-done">
              <span aria-hidden="true">✓</span> {t("checkin.done")}
            </p>
          </div>
        </div>
        <div className="film-ci-live">
          <span className="film-ci-dot" />
          <span>{t("checkin.live")}</span>
          <b dir="ltr">
            <span data-film-count="">{checkinCount(1)}</span> / {CHECKIN.of}
          </b>
          <span className="film-ci-bar">
            <span data-film-bar="" style={{ inlineSize: `${(checkinCount(1) / CHECKIN.of) * 100}%` }} />
          </span>
        </div>
      </div>
    </div>
  );
}
