/**
 * Review-mode strings (v1 plan, Task A1). Kept out of src/messages so production never ships
 * them: only review-mode components import this module, behind NEXT_PUBLIC_REVIEW_MODE.
 */
import type { Localized } from "../types";

export const reviewUi = {
  banner: { en: "Review version – not public", ar: "نسخة مراجعة – غير منشورة" },
  badge: { en: "Example – to be replaced", ar: "مثال – يُستبدل" },
  person: { en: "Client name", ar: "اسم العميل" },
  role: { en: "Role, Company", ar: "المنصب، الشركة" },
} satisfies Record<string, Localized<string>>;
