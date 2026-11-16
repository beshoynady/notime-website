import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { SERVICES_INDEX_HREF } from "@/content";
import { Link } from "@/i18n/navigation";

/**
 * The 404 (D103): what happened in one line, then two ways on: the services, or home.
 *
 * Re-exported as `not-found.tsx` by each (site) segment that calls notFound() (and the group), so
 * it renders inside the site's shell. Not at the [locale] segment: a boundary there belongs to
 * every route under it, and /links would load the whole shell's script again (decision #36).
 */
export async function NotFoundPage() {
  const t = await getTranslations("notFound");
  return (
    <main id="main" data-tone="dark" className="grid min-h-dvh place-items-center bg-espresso">
      <div className="frame grid max-w-[40rem] justify-items-center gap-8 text-center">
        <h1 className="text-h1">{t("title")}</h1>
        <p className="text-ivory/80">{t("body")}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <ButtonLink href={SERVICES_INDEX_HREF} variant="primary" arrow>
            {t("services")}
          </ButtonLink>
          <Link href="/" className="text-eyebrow text-champagne underline underline-offset-8">
            {t("back")}
          </Link>
        </div>
      </div>
    </main>
  );
}
