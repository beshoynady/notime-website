import type { Locale, Localized } from "@/content/types";
import type { MailKind } from "@/lib/forms/mailer";

const l = (en: string, ar: string): Localized<string> => ({ en, ar });

/**
 * The auto-reply, in the visitor's language (D102). Promises are the approved ones only: "We reply
 * within one working day" (D91) and the free review's "within 3 working days… 5 improvements".
 */
export const autoReplyCopy = {
  subject: {
    consultation: l("We've received your intro call request", "وصلنا طلبك لمكالمة التعارف"),
    websiteReview: l("We've received your website for review", "وصلنا موقعك للمراجعة"),
    interest: l("You're on the list for {product}", "سجّلنا اهتمامك بـ{product}"),
    contact: l("We've received your brief", "وصلنا طلبك"),
  } satisfies Record<MailKind, Localized<string>>,
  greeting: l("Hello {name},", "مرحبًا {name}،"),
  body: {
    consultation: l(
      "Thank you for booking a free intro call. We reply within one working day to agree a time that suits you.",
      "شكرًا لحجزك مكالمة تعارف مجانية. نرد عليك خلال يوم عمل واحد لنتفق على موعد يناسبك.",
    ),
    websiteReview: l(
      "Thank you for sending your website. Within 3 working days we'll reply with 5 concrete improvements, free.",
      "شكرًا لإرسال موقعك. خلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا.",
    ),
    interest: l(
      "Thank you for your interest in {product}. We'll write to you as soon as it's ready.",
      "شكرًا لاهتمامك بـ{product}. سنكتب لك فور جاهزيته.",
    ),
    contact: l(
      "Thank you for your brief. We reply within one working day, with the questions we need answered or a time to talk.",
      "شكرًا لإرسال طلبك. نرد عليك خلال يوم عمل واحد، بما نحتاج إلى معرفته أو بموعد للحديث.",
    ),
  } satisfies Record<MailKind, Localized<string>>,
  note: l(
    "This is an automatic confirmation. To add anything, simply reply to this email.",
    "هذه رسالة تأكيد تلقائية. لإضافة أي تفاصيل، يكفي الرد على هذه الرسالة.",
  ),
  signoff: l("NO TIME Creative House, Dubai", "NO TIME Creative House، دبي"),
};

export const fillMail = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);

export const localeOf = (v: string): Locale => (v === "ar" ? "ar" : "en");
