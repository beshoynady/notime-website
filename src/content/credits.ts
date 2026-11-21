import type { ImageCredit } from "@/lib/credits";
import data from "./credits.json";

/**
 * Licensed stock on the site, one entry per published file, written by
 * scripts/ingest-images.mjs --install (D80). The "Image credits" page lists them; the page and its
 * footer link stay hidden while the list is empty (fill or hide, D78).
 */
export const imageCredits = data as ImageCredit[];
