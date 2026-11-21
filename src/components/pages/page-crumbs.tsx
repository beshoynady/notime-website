import { getLocale, getTranslations } from "next-intl/server";
import { BREADCRUMB_LABELS, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import "./pages.css";

/**
 * Home › … › <current> for the pages outside /services (Work, About, products). The category
 * pages keep their own `Breadcrumbs` (Home › Services › <category>); both share the labels with
 * the BreadcrumbList JSON-LD (`trailJsonLd`).
 */
export async function PageCrumbs({ trail = [], current }: { trail?: { href: string; label: string }[]; current: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("category");
  return (
    <nav aria-label={t("breadcrumb")} className="pg-crumbs">
      <ol>
        <li>
          <Link href="/">{BREADCRUMB_LABELS.home[locale]}</Link>
        </li>
        {trail.map((c) => (
          <li key={c.href}>
            <Link href={c.href}>{c.label}</Link>
          </li>
        ))}
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
