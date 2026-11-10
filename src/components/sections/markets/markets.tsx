import { getTranslations } from "next-intl/server";
import { SectionRef } from "@/components/review/section-ref";
import { markets } from "@/content/markets";
import { marketTime } from "@/lib/market-time";
import { HOME_REF } from "@/lib/review";
import { MarketsBoard } from "./markets-board";
import "./markets.css";

/** Each market's UTC offset on the build date (cached, so Cache Components can prerender it). */
async function buildOffsets(): Promise<Record<string, string>> {
  "use cache";
  const now = new Date();
  return Object.fromEntries(markets.map((m) => [m.key, marketTime(now, m.timeZone).offset]));
}

/**
 * Home · Six markets (H-08, light). The section's signature: each market's local time, like a
 * board of clocks in an operations room, because the house is named for time and works across
 * three time zones from one base. Only facts: the markets (profile) and their zones (IANA).
 *
 * The offsets are server-rendered (they're right for the build date; the board corrects them on
 * load, e.g. Cairo's summer time). The times appear once the board mounts, in a box sized for
 * them, so nothing moves. Without JS the board shows the markets and offsets only.
 */
export async function Markets() {
  const [t, offsets] = await Promise.all([getTranslations("markets"), buildOffsets()]);
  const rows = markets.map((m) => ({
    key: m.key,
    timeZone: m.timeZone,
    base: m.base,
    name: t(`countries.${m.key}`),
    offset: offsets[m.key],
  }));
  return (
    <section id="markets" data-tone="light" aria-labelledby="markets-title" className="section-pad">
      <SectionRef id={HOME_REF.markets} />
      <div className="frame markets-grid">
        <header className="markets-head">
          <p className="sec-eyebrow text-eyebrow text-cocoa">{t("eyebrow")}</p>
          <h2 id="markets-title" className="text-h1">
            {t("headingLead")} <b>{t("headingKey")}</b>
          </h2>
        </header>
        <MarketsBoard rows={rows} labels={{ base: t("base"), localTime: t("localTime") }} />
      </div>
    </section>
  );
}
