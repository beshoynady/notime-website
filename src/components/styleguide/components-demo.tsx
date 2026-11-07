import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonArrow, buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

/** Language-neutral demo values for the email field and its error message. */
const EMAIL_SAMPLE = "name@";
const EMAIL_EXAMPLE = "name@company.ae";

export async function ComponentsDemo() {
  const t = await getTranslations("styleguide.components");
  const tc = await getTranslations("common");
  const th = await getTranslations("header");

  return (
    <div className="sg-comp-grid">
      <div className="sg-panel">
        <h3 className="sg-panel-title">{t("buttons")}</h3>
        <p className="sg-sub">{t("onLight")}</p>
        <div className="sg-row">
          {/* Same-page anchors: the buttons demonstrate states, not destinations. */}
          <a href="#components" className={buttonVariants({ variant: "dark" })}>
            <span>{th("quote")}</span>
            <ButtonArrow />
          </a>
          <a href="#components" className={buttonVariants({ variant: "ghost" })}>
            <span>{t("secondary")}</span>
          </a>
          <Button variant="dark" disabled>
            {t("disabled")}
          </Button>
        </div>
        <div className="sg-darkchip" data-tone="dark" data-grain="off">
          <p className="sg-sub">{t("onDark")}</p>
          <div className="sg-row">
            <a href="#components" className={buttonVariants({ variant: "primary" })}>
              <span>{th("quote")}</span>
              <ButtonArrow />
            </a>
            <a href="#components" className={buttonVariants({ variant: "ghost" })}>
              <span>{t("secondary")}</span>
            </a>
          </div>
          <a href="#components" className="text-link">
            {t("link")}
          </a>
        </div>
      </div>

      <div className="sg-panel">
        <h3 className="sg-panel-title">{t("labels")}</h3>
        <div className="sg-row text-cocoa">
          <Badge tone="soon">{tc("comingSoon")}</Badge>
          <Badge tone="illustrative">{tc("illustrative")}</Badge>
          <Badge tone="preview">{tc("preview")}</Badge>
        </div>
        <p className="m-0 text-[0.85rem] text-cocoa">{t("labelsNote")}</p>

        <h3 className="sg-panel-title sg-space-top">{t("fields")}</h3>
        <Field label={t("eventType")}>
          {(p) => (
            <select {...p} defaultValue="conference">
              <option value="conference">{t("options.conference")}</option>
              <option value="launch">{t("options.launch")}</option>
              <option value="private">{t("options.private")}</option>
            </select>
          )}
        </Field>
        <Field label={t("email")} error hint={t("emailError", { example: EMAIL_EXAMPLE })}>
          {(p) => <input {...p} type="email" dir="ltr" defaultValue={EMAIL_SAMPLE} autoComplete="off" />}
        </Field>
      </div>
    </div>
  );
}
