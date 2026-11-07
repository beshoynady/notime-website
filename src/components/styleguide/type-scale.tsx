import { getTranslations } from "next-intl/server";

/**
 * Specs mirror the type utilities in globals.css (weights, then the fluid size range).
 * Technical values, the same in both languages, so they stay out of the message files.
 */
const ROWS = [
  { role: "display", spec: "200 / 600 · 48–184px" },
  { role: "h1", spec: "300 / 600 · 35–70px" },
  { role: "h2", spec: "400 · 22–32px" },
  { role: "lead", spec: "400 · 17–20px" },
  { role: "body", spec: "400 · 16px / 1.6 · AR 17px" },
  { role: "eyebrow", spec: "500 · 11.5px · +0.32em" },
] as const;

export async function TypeScale() {
  const t = await getTranslations("styleguide.type");
  const sample = {
    // The display sample is capped below the live hero size so it fits the column.
    display: (
      <p className="text-display !text-[clamp(2.6rem,8vw,6.5rem)]">
        {t("samples.displayLead")} <b>{t("samples.displayKey")}</b>
      </p>
    ),
    h1: (
      <p className="text-h1">
        {t("samples.h1Lead")} <b>{t("samples.h1Key")}</b>
      </p>
    ),
    h2: <p className="text-h2">{t("samples.h2")}</p>,
    lead: <p className="text-lead">{t("samples.lead")}</p>,
    body: <p className="text-body">{t("samples.body")}</p>,
    eyebrow: <p className="text-eyebrow text-cocoa">{t("samples.eyebrow")}</p>,
  } as const;

  return (
    <>
      <dl className="sg-type-rows">
        {ROWS.map(({ role, spec }) => (
          <div key={role} className="sg-trow">
            <dt className="sg-spec">
              <strong>{t(`roles.${role}`)}</strong>
              <span dir="ltr" className="tabular">
                {spec}
              </span>
            </dt>
            <dd className="m-0 min-w-0 [overflow-wrap:anywhere] [&>p]:m-0">{sample[role]}</dd>
          </div>
        ))}
      </dl>
      <div className="sg-fontcards">
        <FontCard locale="en" />
        <FontCard locale="ar" />
      </div>
    </>
  );
}

/** Each card is set in its own language and face, whatever the page locale. */
async function FontCard({ locale }: { locale: "en" | "ar" }) {
  const t = await getTranslations({ locale, namespace: "styleguide.type.fontCard" });
  return (
    <div className="sg-fontcard" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} style={{ fontFamily: `var(--font-${locale})` }}>
      <p className="text-eyebrow m-0 text-cocoa">{t("label")}</p>
      <p className="m-0 text-[clamp(3rem,7vw,5.5rem)] font-extralight leading-none">
        {t("sampleLead")} <b className="font-semibold">{t("sampleKey")}</b>
      </p>
      <p className="m-0 text-[0.85rem] text-cocoa">{t("weights")}</p>
    </div>
  );
}
