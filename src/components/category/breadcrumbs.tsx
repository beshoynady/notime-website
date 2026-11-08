import { getLocale, getTranslations } from "next-intl/server";
import { BREADCRUMB_LABELS, SERVICES_INDEX_HREF, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";

/** Home › Services › <current>. The labels are shared with the BreadcrumbList JSON-LD. */
export async function Breadcrumbs({ current }: { current: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("category");
  return (
    <nav aria-label={t("breadcrumb")} className="crumbs">
      <ol>
        <li>
          <Link href="/">{BREADCRUMB_LABELS.home[locale]}</Link>
        </li>
        <li>
          <Link href={SERVICES_INDEX_HREF}>{BREADCRUMB_LABELS.services[locale]}</Link>
        </li>
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
