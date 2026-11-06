"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * EN / ع toggle. Keeps the current page when switching. Each option is a plain link
 * that loads a fresh document (DECISIONS D31): a language switch changes <html lang/dir>
 * and fonts, and a client navigation would keep the other-language tree hidden in the DOM
 * (React Activity under cacheComponents). Named in its own language; 44px hit area.
 */
export function LangToggle({ className }: { className?: string }) {
  const t = useTranslations("langToggle");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t("label")} className={cn("inline-flex rounded-[var(--radius)] border border-current opacity-90", className)}>
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={getPathname({ href: pathname, locale: l })}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={t(l === "en" ? "enName" : "arName")}
            className={cn(
              "relative grid min-w-11 place-items-center px-3 py-[7px] text-[0.72rem] leading-none tracking-[0.14em] no-underline",
              "before:absolute before:inset-x-0 before:-inset-y-[7px] before:content-['']",
              "transition-colors duration-300 ease-expo-out",
              l === "ar" && "font-ar text-[0.85rem] tracking-normal",
              active ? "bg-champagne text-espresso" : "hover:bg-current/10",
            )}
          >
            {t(l)}
          </a>
        );
      })}
    </div>
  );
}
