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
  required: l("Fill in this field.", "املأ هذا الحقل."),
  email: l("Enter an email address like name@company.com.", "اكتب بريدًا إلكترونيًا بهذا الشكل: name@company.com"),
  url: l("Enter a website address like yourcompany.ae.", "اكتب عنوان موقع بهذا الشكل: yourcompany.ae"),
  phone: l("Enter the number with digits, spaces or a leading +.", "اكتب الرقم بالأرقام، ويمكنك استخدام المسافات أو علامة + في أوله."),
  contact: l("Enter an email address or a phone number.", "اكتب بريدًا إلكترونيًا أو رقم هاتف."),
  tooLong: l("This is too long. Shorten it a little.", "النص أطول من المسموح، اختصره قليلًا."),
  invalid: l("Check this field and try again.", "راجع هذا الحقل وحاول مجددًا."),
};

/** Field-specific "required" lines (by field name), clearer than the generic one. */
export const requiredMessages: Record<string, L> = {
  name: l("Enter your name.", "اكتب اسمك."),
  email: l("Enter your email address.", "اكتب بريدك الإلكتروني."),
  build: l("Choose what you want to build.", "اختر ما تريد بناءه."),
  timeline: l("Choose when you want to start.", "اختر متى تريد أن تبدأ."),
  websiteUrl: l("Enter your website address.", "اكتب عنوان موقعك."),
  contact: l("Enter an email address or a WhatsApp number.", "اكتب بريدًا إلكترونيًا أو رقم واتساب."),
  goal: l("Choose the main goal.", "اختر هدفك الأساسي."),
  // Required only on the brief (/contact); optional everywhere else.
  message: l("Tell us a little about the project.", "اكتب لنا بضعة أسطر عن مشروعك."),
};

export const formCopy = {
  optional: l("optional", "اختياري"),
  sending: l("Sending…", "جارٍ الإرسال…"),
  summaryTitle: l("Check these before sending:", "راجع ما يلي قبل الإرسال:"),
  states: {
    rateLimited: l(
      "Too many attempts from this connection. Try again in {minutes} min, or email us at {email}.",
      "محاولات كثيرة من هذا الاتصال. حاول مجددًا بعد {minutes}، أو راسلنا على {email}.",
    ),
    blocked: l(
      "We couldn't confirm the request came from a person. Try again, or email us at {email}.",
      "لم نتمكّن من التأكد من أن الطلب مُرسَل من شخص. حاول مجددًا، أو راسلنا على {email}.",
    ),
    failed: l(
      "Your request didn't send because of a problem on our side. Try again, or email us at {email}.",
      "لم يُرسَل طلبك بسبب خلل لدينا. حاول مجددًا، أو راسلنا على {email}.",
    ),
    another: l("Send another request", "أرسل طلبًا آخر"),
  },
  privacy: {
    text: l(
      "We use your details only to reply to you.",
      "نستخدم بياناتكم للرد عليكم فقط.",
    ),
    link: l("Privacy Policy", "سياسة الخصوصية"),
  },
  /** The honeypot's label, read only by bots (the field is hidden from people and assistive tech). */
  honeypot: l("Leave this field empty", "اترك هذا الحقل فارغًا"),

  fields: {
    name: l("Your name", "اسمك"),
    email: l("Email", "البريد الإلكتروني"),
    phone: l("Phone or WhatsApp", "الهاتف أو واتساب"),
    company: l("Company", "الشركة"),
    websiteUrl: l("Current website", "موقعك الحالي"),
    websiteUrlHint: l("For example, yourcompany.ae", "مثال: yourcompany.ae"),
  },

  consultation: {
    project: l("Your project", "مشروعك"),
    you: l("About you", "عنك"),
    build: l("What do you want to build?", "ماذا تريد أن تبني؟"),
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
    tierNone: l("Not sure yet", "لم أحدّد بعد"),
    timeline: l("When do you want to start?", "متى تريد أن تبدأ؟"),
    timelineOptions: {
      flexible: l("I'm flexible", "الموعد مرن"),
      "within-3-months": l("Within 3 months", "خلال 3 أشهر"),
      urgent: l("As soon as possible", "في أقرب وقت ممكن"),
    },
    budget: l("Budget range", "الميزانية التقريبية"),
    budgetNone: l("Choose a range", "اختر نطاقًا"),
    budgetHint: l("It helps us suggest the right scope. It's never a price.", "تساعدنا على اقتراح النطاق المناسب، وليست سعرًا."),
    message: l("Tell us a little more", "أخبرنا بالمزيد"),
    messageHint: l("Who it's for, what it must do, any date that matters.", "لمن هو، وما الذي يجب أن يفعله، وأي موعد يهمّك."),
    submit: l("Request a free intro call", "اطلبوا مكالمة تعارف مجانية"),
    micro: l("No obligation. We reply within one working day.", "دون أي التزام. نرد خلال يوم عمل."),
    successTitle: l("Thanks, {name}. Your request is in.", "شكرًا، {name}. وصلنا طلبك."),
    successBody: l("We reply within one working day to set a time for the call.", "نرد خلال يوم عمل لنحدّد موعد المكالمة."),
    prefilled: l("We've filled in: {choice}. Change it if you like.", "اخترنا لك: {choice}. يمكنك تغييره."),
  },

  review: {
    websiteUrl: l("Your website address", "عنوان موقعك"),
    contact: l("Email or WhatsApp number", "البريد الإلكتروني أو رقم واتساب"),
    goal: l("What's the main goal?", "ما هدفك الأساسي؟"),
    goalOptions: {
      "more-enquiries": l("More enquiries", "طلبات أكثر"),
      "arabic-version": l("An Arabic version", "نسخة عربية"),
      speed: l("A faster site", "موقع أسرع"),
      "easier-updates": l("Easier updates", "تحديث أسهل"),
      other: l("Something else", "شيء آخر"),
    },
    message: l("Anything we should know?", "هل هناك ما يجب أن نعرفه؟"),
    submit: l("Send my site for review", "أرسل موقعي للمراجعة"),
    successTitle: l("Thanks, {name}. Your site is with us.", "شكرًا، {name}. وصلنا موقعك."),
    successBody: l(
      "Within 3 working days we'll reply with 5 concrete improvements, free.",
      "خلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا.",
    ),
  },

  interest: {
    message: l("What would you use it for?", "فيمَ ستستخدمه؟"),
    submit: l("Register interest", "سجّل اهتمامك"),
    successTitle: l("Thanks, {name}. You're on the list for {product}.", "شكرًا، {name}. سجّلنا اهتمامك بـ{product}."),
    successBody: l("We'll write to you when it's ready.", "سنكتب لك حين يصبح جاهزًا."),
    type: l("What do you run?", "ما الذي تديره؟"),
    typeOptions: {
      event: l("Events", "فعاليات"),
      restaurant: l("A restaurant or café", "مطعم أو مقهى"),
      other: l("Something else", "شيء آخر"),
    },
  },

  /** The brief on /contact (D102). The project first, then the person. */
  contact: {
    project: l("Your project", "مشروعك"),
    you: l("How we reach you", "كيف نتواصل معك"),
    service: l("What do you need?", "ما الذي تحتاجه؟"),
    serviceNone: l("Not sure yet, or several things", "لم أحدّد بعد، أو أكثر من خدمة"),
    prefilled: l("Selected: {choice}. Change it if you need something else.", "اخترنا لك: {choice}. غيّره إن كنت تحتاج شيئًا آخر."),
    timeline: l("When is it?", "متى موعده؟"),
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
    message: l("Tell us about it", "حدّثنا عنه"),
    messageHint: l(
      "The occasion or goal, the audience, and anything already decided. A few lines are enough.",
      "المناسبة أو الهدف، والجمهور، وما تقرّر حتى الآن. تكفي بضعة أسطر.",
    ),
    submit: l("Send the brief", "أرسل الطلب"),
    micro: l("We reply within one working day.", "نرد خلال يوم عمل."),
    successTitle: l("Thanks, {name}. Your brief is with us.", "شكرًا، {name}. وصلنا طلبك."),
    successBody: l(
      "We reply within one working day, with the questions we need answered or a time to talk.",
      "نرد خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث.",
    ),
  },
};

/** Fills `{key}` placeholders. */
/** Minutes in Arabic with the number's agreement (M3: «9 دقيقة» read wrong): 1, 2, 3–10, 11+. */
export function minutesLabel(n: number, locale: "en" | "ar"): string {
  if (locale === "en") return String(n);
  if (n === 1) return "دقيقة واحدة";
  if (n === 2) return "دقيقتين";
  if (n >= 3 && n <= 10) return `${n} دقائق`;
  return `${n} دقيقة`;
}

export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
