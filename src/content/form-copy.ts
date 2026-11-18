/**
 * The forms' words (D92: the contract returns codes, the UI owns the sentences). EN first, the
 * Arabic written natively. Shared by the consultation, website-review and interest forms, so the
 * Contact page (Task 4.2) reuses them. Errors say what to do, never only what went wrong.
 * `{email}` is filled from src/config/contact.ts, never typed here.
 */
import type { FieldErrorCode, GUEST_BANDS } from "@/lib/forms/schemas";
import type { Localized } from "./types";

type L = Localized<string>;
const l = (en: string, ar: string): L => ({ en, ar });

/** One message per error code; a field may override `required` with a more specific line. */
export const errorMessages: Record<FieldErrorCode, L> = {
  required: l("Fill in this field.", "املؤوا هذا الحقل."),
  email: l("Enter an email like name@company.com.", "اكتبوا البريد الإلكتروني بهذا الشكل: name@company.com"),
  url: l("Enter a website address like yourcompany.ae.", "اكتبوا عنوان الموقع بهذا الشكل: yourcompany.ae"),
  phone: l("Use digits only, e.g. +971 50 123 4567.", "اكتبوا الرقم بالأرقام فقط، مثل ‎+971 50 123 4567."),
  contact: l("Enter an email like name@company.com, or a number with the country code, e.g. +971.", "اكتبوا بريدًا إلكترونيًا مثل name@company.com، أو رقمًا مع رمز الدولة مثل ‎+971."),
  tooLong: l("Keep it under {max} characters.", "الحد الأقصى لعدد الأحرف: {max}"),
  invalid: l("Something in this field doesn't fit. Check it and try again.", "في هذا الحقل ما لا يناسب. راجعوه وحاولوا مرة أخرى."),
};

/** Field-specific "required" lines (by field name), clearer than the generic one. */
export const requiredMessages: Record<string, L> = {
  name: l("Enter your name.", "اكتبوا اسمكم."),
  email: l("Enter your email address.", "اكتبوا بريدكم الإلكتروني."),
  build: l("Choose what you want to build.", "اختاروا ما تريدون بناءه."),
  timeline: l("Choose when you want to start.", "اختاروا متى تريدون أن تبدؤوا."),
  websiteUrl: l("Enter your website address.", "اكتبوا عنوان موقعكم."),
  contact: l("Enter an email address or a WhatsApp number.", "اكتبوا بريدًا إلكترونيًا أو رقم واتساب."),
  goal: l("Choose the main goal.", "اختاروا هدفكم الأساسي."),
  // Required only on the brief (/contact); optional everywhere else.
  message: l("Tell us a little about the project.", "اكتبوا لنا بضعة أسطر عن مشروعكم."),
};

export const formCopy = {
  optional: l("optional", "اختياري"),
  sending: l("Sending…", "جارٍ الإرسال…"),
  summaryTitle: l("Check these before sending:", "راجعوا ما يلي قبل الإرسال:"),
  states: {
    rateLimited: l(
      "Too many attempts from this connection. Try again in {minutes} min, or email us at {email}.",
      "محاولات كثيرة من هذا الاتصال. حاولوا مرة أخرى بعد {minutes}، أو راسلونا على {email}.",
    ),
    blocked: l(
      "The security check didn't load. Try again, or email us at {email}.",
      "لم يكتمل التحقق الأمني. حاولوا مرة أخرى أو راسلونا على {email}.",
    ),
    failed: l(
      "Your request didn't send because of a problem on our side. Try again, or email us at {email}.",
      "لم يُرسَل طلبكم بسبب خلل لدينا. حاولوا مرة أخرى، أو راسلونا على {email}.",
    ),
    another: l("Send another request", "إرسال طلب آخر"),
  },
  privacy: {
    text: l(
      "We use your details only to reply to you.",
      "نستخدم بياناتكم للرد عليكم فقط.",
    ),
    link: l("Privacy Policy", "سياسة الخصوصية"),
  },
  /** The honeypot's label, read only by bots (the field is hidden from people and assistive tech). */
  honeypot: l("Leave this field empty", "اتركوا هذا الحقل فارغًا"),

  fields: {
    name: l("Your name", "الاسم"),
    email: l("Email", "البريد الإلكتروني"),
    phone: l("Phone or WhatsApp", "الهاتف أو واتساب"),
    company: l("Company", "الشركة"),
    websiteUrl: l("Current website", "موقعكم الحالي"),
    websiteUrlHint: l("For example, yourcompany.ae", "مثال: yourcompany.ae"),
  },

  consultation: {
    project: l("Your project", "مشروعكم"),
    you: l("About you", "عنكم"),
    build: l("What do you want to build?", "ماذا تريدون أن تبنوا؟"),
    buildOptions: {
      websites: l("A website", "موقع إلكتروني"),
      apps: l("A mobile app", "تطبيق جوّال"),
      systems: l("A custom system or dashboard", "نظام مخصّص أو لوحة إدارة"),
      "e-commerce": l("An online store", "متجر إلكتروني"),
      ux: l("UI/UX design", "تصميم الواجهات وتجربة المستخدم"),
      "ai-consulting": l("AI consulting", "استشارات الذكاء الاصطناعي"),
      "event-tech": l("Event technology", "تقنيات الفعاليات"),
      other: l("Something else", "شيء آخر"),
    },
    tier: l("Engagement level", "مستوى التعاون"),
    tierNone: l("Not sure yet", "لم نحدّد بعد"),
    timeline: l("When do you want to start?", "متى تريدون أن تبدؤوا؟"),
    timelineOptions: {
      flexible: l("Flexible", "الموعد مرن"),
      "within-3-months": l("Within 3 months", "خلال 3 أشهر"),
      urgent: l("As soon as possible", "في أقرب وقت ممكن"),
    },
    budget: l("Budget range", "الميزانية التقريبية"),
    budgetNone: l("Choose a range", "اختاروا نطاقًا"),
    budgetHint: l("It helps us suggest the right scope. It's never a price.", "تساعدنا على اقتراح النطاق المناسب، وليست سعرًا."),
    message: l("Tell us a little more", "أخبرونا بالمزيد"),
    messageHint: l("Who it's for, what it must do, any date that matters.", "لمن هو، وما الذي يجب أن يفعله، وأي موعد يهمّكم."),
    submit: l("Request a free intro call", "اطلبوا مكالمة تعارف مجانية"),
    micro: l("No obligation. We reply within one working day.", "دون أي التزام. نرد خلال يوم عمل."),
    successTitle: l("Thanks, {name}. We have your request.", "شكرًا، {name}. وصلنا طلبكم."),
    successBody: l("We reply within one working day to set a time for the call.", "نرد خلال يوم عمل لنحدّد موعد المكالمة."),
    prefilled: l("We've filled in: {choice}. Change it if you like.", "اخترنا لكم: {choice}. يمكنكم تغييره."),
  },

  review: {
    websiteUrl: l("Your website address", "عنوان موقعكم"),
    contact: l("Email or WhatsApp number", "البريد الإلكتروني أو رقم واتساب"),
    goal: l("What's the main goal?", "ما هدفكم الأساسي؟"),
    goalOptions: {
      "more-enquiries": l("More enquiries", "طلبات أكثر"),
      "arabic-version": l("An Arabic version", "نسخة عربية"),
      speed: l("A faster site", "موقع أسرع"),
      "easier-updates": l("Easier updates", "تحديث أسهل"),
      other: l("Something else", "شيء آخر"),
    },
    message: l("Anything we should know?", "هل هناك ما يجب أن نعرفه؟"),
    submit: l("Send my site for review", "إرسال الموقع للمراجعة"),
    successTitle: l("Thanks, {name}. Your site is with us.", "شكرًا، {name}. وصلنا موقعكم."),
    successBody: l(
      "Within 3 working days we'll reply with 5 concrete improvements, free.",
      "خلال 3 أيام عمل نرد عليكم بخمسة تحسينات عملية، مجانًا.",
    ),
  },

  interest: {
    message: l("What would you use it for?", "فيمَ ستستخدمونه؟"),
    submit: l("Register interest", "تسجيل الاهتمام"),
    successTitle: l("Thanks, {name}. You're on the list for {product}.", "شكرًا، {name}. سجّلنا اهتمامكم بـ{product}."),
    successBody: l("We'll write to you when it's ready.", "سنكتب لكم حين يصبح جاهزًا."),
    type: l("What do you run?", "ما الذي تديرونه؟"),
    typeOptions: {
      event: l("Events", "فعاليات"),
      restaurant: l("A restaurant or café", "مطعم أو مقهى"),
      other: l("Something else", "شيء آخر"),
    },
  },

  /** The brief on /contact (D102). The project first, then the person. */
  contact: {
    project: l("Your project", "مشروعكم"),
    you: l("How we reach you", "كيف نتواصل معكم"),
    service: l("What do you need?", "ما الذي تحتاجون إليه؟"),
    serviceNone: l("Not sure yet, or several things", "لم نحدّد بعد، أو أكثر من خدمة"),
    prefilled: l("Selected: {choice}. Change it if you need something else.", "اخترنا لكم: {choice}. غيّروه إن كنتم تحتاجون شيئًا آخر."),
    timeline: l("When do you need it?", "متى تحتاجون إليه؟"),
    eventMonth: l("Event date (approximate)", "تاريخ المناسبة (تقريبًا)"),
    eventMonthNone: l("Choose a month", "اختاروا الشهر"),
    guests: l("Number of guests", "عدد الضيوف"),
    guestsNone: l("Choose a range", "اختاروا النطاق"),
    guestOptions: {
      "up-to-50": l("Up to 50", "حتى 50"),
      "50-150": l("50–150", "50–150"),
      "150-500": l("150–500", "150–500"),
      "over-500": l("Over 500", "أكثر من 500"),
      "not-sure": l("Not sure yet", "لم يتحدّد بعد"),
    } satisfies Record<(typeof GUEST_BANDS)[number], L>,
    city: l("City or country", "المدينة أو الدولة"),
    cityHint: l("Where the event or the work takes place.", "حيث تُقام الفعالية أو يُنفَّذ العمل."),
    message: l("Tell us about it", "حدّثونا عنه"),
    messageHint: l(
      "The occasion or goal, the audience, and anything already decided. A few lines are enough.",
      "المناسبة أو الهدف، والجمهور، وما تقرّر حتى الآن. تكفي بضعة أسطر.",
    ),
    submit: l("Send my request", "إرسال الطلب"),
    micro: l("We reply within one working day.", "نرد خلال يوم عمل."),
    successTitle: l("Thanks, {name}. We have your request.", "شكرًا، {name}. وصلنا طلبكم."),
    successBody: l(
      "We reply within one working day, with the questions we need answered or a time to talk.",
      "نرد خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث.",
    ),
  },
};

/** Minutes in Arabic with the number's agreement (M3: «9 دقيقة» read wrong): 1, 2, 3–10, 11+. */
export function minutesLabel(n: number, locale: "en" | "ar"): string {
  if (locale === "en") return String(n);
  if (n === 1) return "دقيقة واحدة";
  if (n === 2) return "دقيقتين";
  if (n >= 3 && n <= 10) return `${n} دقائق`;
  return `${n} دقيقة`;
}

/** Fills `{key}` placeholders. */
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

/**
 * The sentence for a field's error code: the field's own "required" line when it has one, else the
 * code's. `tooLong` names the limit (`max`, read from the schema; Latin numerals in both languages,
 * D50); with no limit known it falls back to the generic line rather than show a raw `{max}`.
 */
export function errorText(name: string, code: FieldErrorCode, locale: "en" | "ar", max?: number): string {
  if (code === "required" && requiredMessages[name]) return requiredMessages[name][locale];
  if (code === "tooLong") return max ? fill(errorMessages.tooLong[locale], { max: max.toLocaleString("en-US") }) : errorMessages.invalid[locale];
  return (errorMessages[code] ?? errorMessages.invalid)[locale];
}
