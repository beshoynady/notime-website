import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main id="main" data-tone="dark" className="grid min-h-dvh place-items-center bg-espresso">
      <div className="frame grid justify-items-center gap-8 text-center">
        <h1 className="text-h1">{t("title")}</h1>
        <Link href="/" className="text-eyebrow text-champagne underline underline-offset-8">
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
