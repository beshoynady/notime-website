"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { CALENDAR, type CalendarEntry, type ChannelId, type PillarId } from "@/content/modules/content-calendar";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { filterEntries, monthWeeks, WEEK_START, weekdayOrder, type Weekday } from "./calendar-math";

/** Western digits in Arabic (D50); British English dates. */
const DATE_LOCALE = { en: "en-GB", ar: "ar-AE-u-nu-latn" } as const;
/** 1 January 2023 was a Sunday: weekday `d` is 1 + d January 2023 (UTC). */
const weekdayDate = (d: Weekday) => Date.UTC(2023, 0, 1 + d);

type Filter = { pillar: PillarId | null; channel: ChannelId | null };

/**
 * IV · Content strategy (category-pages.md §6 III, entry 16): a sample month of content for a
 * fictional brand, labelled "Example". The month is the visitor's current one; weekday names and
 * dates follow the locale, and the week starts on Monday in English and on Sunday in Arabic
 * (calendar-math WEEK_START). Six weeks always, so the box never changes height.
 *
 * - Pillars are coded by tone and pattern (never colour alone) and named in the filter, which is
 *   the legend. Filters (pillar, channel) are toggle buttons; a day's post is a button that shows
 *   it in the detail panel. Every change is announced in the module's one live region.
 * - Motion owns the interaction: the filters' active marks (layoutId) and posts leaving and coming
 *   back as the filters change. GSAP owns the entry on scroll: the month grid's rules draw (their
 *   own two layers). Reduced motion: no entry, filters and selection work instantly.
 */
export default function ContentCalendar({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>({ pillar: null, channel: null });
  const [selected, setSelected] = useState<string>(CALENDAR.entries[0].id);
  const [status, setStatus] = useState("");

  const month = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, []);
  const fmt = useMemo(() => {
    const l = DATE_LOCALE[locale];
    return {
      month: new Intl.DateTimeFormat(l, { month: "long", year: "numeric" }),
      day: new Intl.DateTimeFormat(l, { weekday: "long", day: "numeric", month: "long" }),
      wdLong: new Intl.DateTimeFormat(l, { weekday: "long", timeZone: "UTC" }),
      wdShort: new Intl.DateTimeFormat(l, { weekday: "short", timeZone: "UTC" }),
      wdNarrow: new Intl.DateTimeFormat(l, { weekday: "narrow", timeZone: "UTC" }),
      plural: new Intl.PluralRules(locale),
    };
  }, [locale]);

  const start = WEEK_START[locale];
  const weeks = monthWeeks(month.year, month.month, start);
  const monthName = fmt.month.format(new Date(month.year, month.month, 1));
  const dayLabel = (day: number) => fmt.day.format(new Date(month.year, month.month, day));

  const visible = filterEntries(CALENDAR.entries, filter);
  const shownIds = new Set(visible.map((e) => e.id));
  const byDay = new Map(CALENDAR.entries.map((e) => [e.day, e]));
  // The selected post, or the first one still shown when a filter hides it.
  const current = visible.find((e) => e.id === selected) ?? visible[0] ?? null;

  const pillarOf = (e: CalendarEntry) => CALENDAR.pillars.find((p) => p.id === e.pillar)!.label[locale];
  const channelOf = (e: CalendarEntry) => CALENDAR.channels.find((c) => c.id === e.channel)!.label[locale];

  const applyFilter = (next: Filter) => {
    setFilter(next);
    const n = filterEntries(CALENDAR.entries, next).length;
    const forms = CALENDAR.status[locale];
    setStatus(n === 0 ? CALENDAR.empty[locale] : (forms[fmt.plural.select(n)] ?? forms.other!).replace("{count}", String(n)));
  };
  const choose = (e: CalendarEntry) => {
    setSelected(e.id);
    setStatus(`${dayLabel(e.day)}: ${e.topic[locale]} · ${pillarOf(e)} · ${channelOf(e)}`);
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 78%", once: true } });
        tl.fromTo(el.querySelector(".cal-rules-h"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out" });
        tl.fromTo(el.querySelector(".cal-rules-v"), { scaleY: 0 }, { scaleY: 1, duration: 1.1, ease: "expo.out" }, 0.12);
        tl.fromTo(el.querySelector(".cal-month"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const t = reduced ? { duration: 0 } : { duration: 0.35, ease: ease.expoOut };
  const chips = <K extends "pillar" | "channel">(key: K, items: { id: NonNullable<Filter[K]>; label: { en: string; ar: string } }[]) => (
    <div className="cal-filter" role="group" aria-labelledby={`cal-${key}`}>
      <span id={`cal-${key}`} className="cal-filter-label">
        {CALENDAR.filters[key][locale]}
      </span>
      {[{ id: null, label: CALENDAR.filters.all }, ...items].map((it) => {
        const on = filter[key] === it.id;
        return (
          <button
            key={it.id ?? "all"}
            type="button"
            className="cal-chip"
            aria-pressed={on}
            onClick={() => !on && applyFilter({ ...filter, [key]: it.id })}
          >
            {on && <motion.span layoutId={`cal-${key}-mark`} className="cal-chip-mark" aria-hidden="true" transition={t} />}
            {key === "pillar" && it.id && <span className="cal-swatch" data-pillar={it.id} aria-hidden="true" />}
            <span className="cal-chip-text">{it.label[locale]}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={root} className="cal">
      <div className="cal-top">
        {CALENDAR.example && <ExampleLabel kind="example" className="cal-label" />}
        <h3 className="cal-title">{CALENDAR.title[locale]}</h3>
        <p className="cal-note">{CALENDAR.note[locale]}</p>
      </div>

      <div className="cal-filters">
        {chips("pillar", CALENDAR.pillars)}
        {chips("channel", CALENDAR.channels)}
      </div>

      <p className="cal-month" aria-hidden="true">
        {monthName}
      </p>
      <div className="cal-grid">
        <div className="cal-rules" aria-hidden="true">
          <span className="cal-rules-h" />
          <span className="cal-rules-v" />
        </div>
        <table className="cal-table">
          <caption className="sr-only">{CALENDAR.caption[locale].replace("{month}", monthName)}</caption>
          <thead>
            <tr>
              {weekdayOrder(start).map((d) => (
                <th key={d} scope="col">
                  <span className="cal-wd-short" aria-hidden="true">
                    {fmt.wdShort.format(weekdayDate(d))}
                  </span>
                  <span className="cal-wd-narrow" aria-hidden="true">
                    {fmt.wdNarrow.format(weekdayDate(d))}
                  </span>
                  <span className="sr-only">{fmt.wdLong.format(weekdayDate(d))}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((day, d) => {
                  const entry = day ? byDay.get(day) : undefined;
                  const shown = entry && shownIds.has(entry.id);
                  return (
                    <td key={d} data-out={day ? undefined : ""}>
                      <div className="cal-cell">
                        {day && (
                          <span className="cal-day" aria-hidden={shown ? true : undefined}>
                            {day}
                          </span>
                        )}
                        <AnimatePresence initial={false}>
                          {entry && shown && (
                            <motion.button
                              key={entry.id}
                              type="button"
                              className="cal-entry"
                              data-pillar={entry.pillar}
                              aria-pressed={current?.id === entry.id}
                              aria-label={`${dayLabel(entry.day)}: ${entry.topic[locale]}`}
                              onClick={() => choose(entry)}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={t}
                            >
                              <span className="cal-swatch" data-pillar={entry.pillar} aria-hidden="true" />
                              <span className="cal-entry-ch">
                                {channelOf(entry)}
                                <span className="cal-entry-lang" aria-hidden="true">
                                  {CALENDAR.langMarks[entry.lang][locale]}
                                </span>
                              </span>
                              <span className="cal-entry-topic">{entry.topic[locale]}</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cal-detail">
        {current ? (
          <>
            <p className="cal-detail-date">{dayLabel(current.day)}</p>
            <p className="cal-detail-topic">{current.topic[locale]}</p>
            <dl className="cal-detail-meta">
              <div>
                <dt>{CALENDAR.detail.pillar[locale]}</dt>
                <dd>
                  <span className="cal-swatch" data-pillar={current.pillar} aria-hidden="true" />
                  {pillarOf(current)}
                </dd>
              </div>
              <div>
                <dt>{CALENDAR.detail.channel[locale]}</dt>
                <dd>{channelOf(current)}</dd>
              </div>
              <div>
                <dt>{CALENDAR.detail.format[locale]}</dt>
                <dd>{CALENDAR.formats[current.format][locale]}</dd>
              </div>
              <div>
                <dt>{CALENDAR.detail.lang[locale]}</dt>
                <dd>{CALENDAR.langs[current.lang][locale]}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="cal-detail-empty">{CALENDAR.empty[locale]}</p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

