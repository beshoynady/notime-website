import { getTranslations } from "next-intl/server";

// Interim homepage: the shell lands in Tasks 5–8 and the hero in Task 9.
export default async function HomePage() {
  const t = await getTranslations("hero");
  return (
    <main id="main" data-tone="dark" className="grid min-h-dvh place-items-center bg-espresso">
      <h1 className="text-display frame text-center">
        {t("titleLine1")} <b className="text-champagne">{t("titleLine2")}</b>
      </h1>
    </main>
  );
}
