"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

const noop = () => () => {};
const currentYear = () => String(new Date().getFullYear());

/**
 * "© {year} …" line. The prerendered HTML carries the build year; on the client the
 * current year takes over after hydration (no mismatch), so a static deploy never shows
 * last year's date in January (DECISIONS D33).
 */
export function CopyrightYear({ buildYear }: { buildYear: string }) {
  const t = useTranslations("footer");
  const year = useSyncExternalStore(noop, currentYear, () => buildYear);
  return <p>{t("rights", { year })}</p>;
}
