import type { Localized } from "../types";

/**
 * Public relations' signature module (category-pages.md §6 III, entry 17): the anatomy of a press
 * release, set as an editorial page. The release is a sample about a fictional, unnamed coffee
 * brand: no real company, person, outlet or result (OQ #19: no outlet is named until the client
 * confirms which published). The module always shows the "Example" label (`example: true`).
 * The media contact uses example.com, a domain reserved for examples (RFC 2606).
 * Each annotated part has a note on what it does; the dateline's date is the visitor's today,
 * formatted for the locale.
 */

export type PartId = "headline" | "dateline" | "lead" | "quote" | "boilerplate" | "contact";

export const PRESS_RELEASE = {
  example: true,
  title: { en: "Anatomy of a press release", ar: "مكوّنات البيان الصحفي" },
  hint: { en: "Choose a numbered part to see what it does.", ar: "اختر جزءًا مرقّمًا لتعرف دوره." },
  /** Names the list of notes for assistive tech. */
  notesLabel: { en: "What each part does", ar: "دور كل جزء" },
  release: {
    kicker: { en: "For immediate release", ar: "للنشر الفوري" },
    headline: {
      en: "A local coffee brand opens its first flagship, with the roastery in full view",
      ar: "علامة قهوة محلية تفتتح متجرها الرئيسي الأول، والمحمصة أمام الزوار",
    },
    standfirst: {
      en: "The new space brings roasting, tasting and a menu in Arabic and English into one room.",
      ar: "تجمع المساحة الجديدة التحميص والتذوّق وقائمة بالعربية والإنجليزية في مكان واحد.",
    },
    /** `{date}` is today, formatted for the locale. */
    dateline: { en: "Dubai, {date}", ar: "دبي، {date}" },
    lead: {
      en: "A local coffee brand today opened its first flagship store, where visitors watch the beans being roasted before they order. The store serves a menu written in Arabic and English and hosts tasting sessions every week.",
      ar: "افتتحت علامة قهوة محلية اليوم متجرها الرئيسي الأول، حيث يشاهد الزوار تحميص البن قبل أن يطلبوا قهوتهم. ويقدّم المتجر قائمة مكتوبة بالعربية والإنجليزية، ويستضيف جلسات تذوّق كل أسبوع.",
    },
    body: {
      en: "The space is built around the roaster, which sits behind glass at the centre of the room. Seating runs along both sides, and a counter at the back sells beans to take home.",
      ar: "صُمّمت المساحة حول آلة التحميص التي تتوسّط المكان خلف واجهة زجاجية، وتمتد المقاعد على جانبيها، ويبيع ركن في آخر المتجر البن لمن يريد أن يأخذه معه.",
    },
    quote: {
      en: "“We wanted people to see where their coffee comes from, and to stay a while,” said the brand’s founder.",
      ar: "قال مؤسس العلامة: «أردنا أن يرى الناس من أين تأتي قهوتهم، وأن يجلسوا عندنا قليلًا».",
    },
    end: { en: "###", ar: "— انتهى —" },
    aboutTitle: { en: "About the brand", ar: "عن العلامة" },
    about: {
      en: "The brand is a fictional coffee roaster, created for this example. It roasts in small batches and serves its coffee in one city.",
      ar: "العلامة محمصة قهوة افتراضية أُنشئت لهذا المثال، تحمّص البن بكميات صغيرة وتقدّم قهوتها في مدينة واحدة.",
    },
    contactTitle: { en: "Media contact", ar: "للتواصل الإعلامي" },
    contactName: { en: "Press office", ar: "المكتب الإعلامي" },
    contactEmail: "press@example.com",
  },
  parts: [
    {
      id: "headline",
      name: { en: "Headline", ar: "العنوان" },
      note: {
        en: "The news in one line, for an editor who decides in seconds. A short line under it adds the detail.",
        ar: "الخبر في سطر واحد، لمحرّر يقرّر في ثوانٍ. ويضيف سطر قصير تحته التفاصيل.",
      },
    },
    {
      id: "dateline",
      name: { en: "Dateline", ar: "المكان والتاريخ" },
      note: { en: "Where the news comes from, and the day it is released.", ar: "من أين يأتي الخبر، وفي أي يوم صدر." },
    },
    {
      id: "lead",
      name: { en: "Lead and body", ar: "المقدّمة والمتن" },
      note: {
        en: "The first paragraph answers who, what, when, where and why. The rest adds detail, most important first.",
        ar: "تجيب الفقرة الأولى عن: من، وماذا، ومتى، وأين، ولماذا. وتضيف بقية الفقرات التفاصيل، الأهم فالأهم.",
      },
    },
    {
      id: "quote",
      name: { en: "Quote", ar: "الاقتباس" },
      note: {
        en: "A named spokesperson says what the facts can’t: the reason behind the news.",
        ar: "متحدّث معروف يقول ما لا تقوله الوقائع: السبب وراء الخبر.",
      },
    },
    {
      id: "boilerplate",
      name: { en: "Boilerplate", ar: "النبذة التعريفية" },
      note: {
        en: "A standard paragraph about the company that closes every release, word for word.",
        ar: "فقرة ثابتة عن الشركة تُختم بها كل البيانات، بالنص نفسه.",
      },
    },
    {
      id: "contact",
      name: { en: "Media contact", ar: "جهة التواصل الإعلامي" },
      note: {
        en: "Who journalists reach for interviews, images and follow-up questions.",
        ar: "من يتواصل معه الصحفيون لطلب مقابلة أو صور أو أسئلة إضافية.",
      },
    },
  ] satisfies { id: PartId; name: Localized<string>; note: Localized<string> }[],
};
