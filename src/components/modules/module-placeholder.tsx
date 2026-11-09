import { useTranslations } from "next-intl";

/**
 * The static fallback while a signature module is still in design (Tasks 3.3–3.8 and later):
 * a reserved box, so the section keeps its final rhythm. It renders on the server and without JS.
 * Review mode only: production shows no "in design" box (fill or hide, D78), so a section whose
 * module isn't built yet simply ends after its points.
 */
export function ModulePlaceholder() {
  if (process.env.NEXT_PUBLIC_REVIEW_MODE !== "1") return null;
  return <ModulePlaceholderBox />;
}

function ModulePlaceholderBox() {
  const t = useTranslations("category");
  return (
    <div className="module-placeholder">
      <p className="text-eyebrow">{t("modulePending")}</p>
    </div>
  );
}
