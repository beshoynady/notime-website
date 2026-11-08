import { useTranslations } from "next-intl";

/**
 * The static fallback while a signature module is still in design (Tasks 3.3–3.8 and later):
 * a reserved box, so the section keeps its final rhythm. It renders on the server and without JS.
 */
export function ModulePlaceholder() {
  const t = useTranslations("category");
  return (
    <div className="module-placeholder">
      {/* TODO: replace placeholder — each module brings its own static fallback (spec §6). */}
      <p className="text-eyebrow">{t("modulePending")}</p>
    </div>
  );
}
