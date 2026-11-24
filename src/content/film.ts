import type { CategorySlug } from "./types";

/**
 * The home film (docs/review/film-storyboard/): "the night of the event", one scene per screen. An
 * empty hall comes to life as the visitor scrolls: lights (Events), a camera (Creative), the
 * screens (Marketing), a gift at every seat (Print), the check-in (Software), then the guests and
 * zero. Each category scene links to its page; its name is the menu's (`Category.title`).
 *
 * - `plate`: a registry id (media.ts). A hidden plate leaves the scene on the espresso ground (D78).
 * - `prop`: what is drawn in code over the plate (film-props.tsx): text and screens stay real text.
 * - `mirror`: the locale whose page flips the plate, so its subject sits opposite the copy.
 */
export type FilmProp = "beams" | "viewfinder" | "campaign" | "card" | "checkin" | "dial";
export type FilmKey = "opening" | "events" | "creative" | "marketing" | "print" | "digital" | "finale";

export interface FilmBeat {
  key: FilmKey;
  category?: CategorySlug;
  plate: string;
  prop?: FilmProp;
  mirror?: "ltr" | "rtl";
}

export const FILM: readonly FilmBeat[] = [
  { key: "opening", plate: "film-hall" },
  { key: "events", category: "events-hospitality", plate: "film-beams", prop: "beams" },
  { key: "creative", category: "creative-production", plate: "film-camera", prop: "viewfinder", mirror: "ltr" },
  { key: "marketing", category: "marketing-brand", plate: "film-hall", prop: "campaign" },
  { key: "print", category: "production-print-gifts", plate: "film-gift", prop: "card", mirror: "rtl" },
  { key: "digital", category: "software-digital", plate: "film-arrival", prop: "checkin" },
  { key: "finale", plate: "ev-open-night", prop: "dial" },
];

/** Scenes after the opening: the counter's total. */
export const FILM_SCENES = FILM.length - 1;

/** "03": the scene's number, two digits (slates and the counter). */
export const sceneNumber = (i: number) => String(i).padStart(2, "0");

/** "03 / 06": always read left to right, in both locales (rendered in an LTR island). */
export const sceneCounter = (i: number) => `${sceneNumber(i)} / ${sceneNumber(FILM_SCENES)}`;

/** The check-in screen's guest count at a point of its scene (0–1): an example, labelled so. */
export const CHECKIN = { from: 152, to: 186, of: 240 } as const;
export const checkinCount = (progress: number) => {
  const p = Math.min(1, Math.max(0, progress));
  return Math.round(CHECKIN.from + (CHECKIN.to - CHECKIN.from) * p);
};
