import type { ImageSlot } from "./types";

/**
 * Image slots. Every slot has a matching entry in docs/content/image-prompts.md.
 * To drop in a generated or real image: save it under public/images/ai/<id>.webp
 * (or /images/work/ for real photos), then set `src` (and `blurDataURL`).
 *
 * TODO: replace placeholder — every `src: null` slot renders the designed placeholder.
 */
export const imageSlots: ImageSlot[] = [
  // Category images (4:5 for menu and cards, 16:9 for headers)
  {
    id: "cat-events-hospitality-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "event",
    illustrative: false,
    alt: {
      en: "A warmly lit ballroom set for an evening event, with soft haze and candlelight.",
      ar: "قاعة احتفالات بإضاءة دافئة مهيّأة لأمسية، يلفّها ضباب خفيف وضوء الشموع.",
    },
  },
  {
    id: "cat-events-hospitality-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "event",
    illustrative: false,
    alt: {
      en: "A wide view of an event stage under warm light, guests' tables in soft focus.",
      ar: "مشهد واسع لمسرح فعالية تحت إضاءة دافئة، وطاولات الضيوف في تركيز ناعم.",
    },
  },
  {
    id: "cat-creative-production-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "studio",
    illustrative: false,
    alt: {
      en: "A film studio set with a camera on a dolly and a single warm key light.",
      ar: "موقع تصوير في استوديو، كاميرا على عربة وضوء رئيسي دافئ واحد.",
    },
  },
  {
    id: "cat-creative-production-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "studio",
    illustrative: false,
    alt: {
      en: "A wide studio frame with lighting stands and a seamless backdrop in warm tones.",
      ar: "لقطة واسعة لاستوديو بحوامل إضاءة وخلفية متصلة بدرجات دافئة.",
    },
  },
  {
    id: "cat-marketing-brand-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "brand",
    illustrative: false,
    alt: {
      en: "Brand material laid out on a desk: paper samples, swatches and a closed notebook.",
      ar: "مواد هوية على مكتب: عيّنات ورق ودرجات ألوان ودفتر مغلق.",
    },
  },
  {
    id: "cat-marketing-brand-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "brand",
    illustrative: false,
    alt: {
      en: "A calm studio desk with brand boards pinned to a wall in late-afternoon light.",
      ar: "مكتب هادئ ولوحات هوية مثبّتة على الجدار في ضوء آخر النهار.",
    },
  },
  {
    id: "cat-production-print-gifts-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "print",
    illustrative: false,
    alt: {
      en: "Sheets coming off a large-format printer in a dim print workshop.",
      ar: "أوراق تخرج من طابعة كبيرة الحجم في ورشة طباعة خافتة الإضاءة.",
    },
  },
  {
    id: "cat-production-print-gifts-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "print",
    illustrative: false,
    alt: {
      en: "A print workshop with stacked boxes and wrapped gifts under warm overhead lamps.",
      ar: "ورشة طباعة فيها صناديق مرصوصة وهدايا مغلّفة تحت مصابيح دافئة.",
    },
  },
  {
    id: "cat-software-digital-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "code",
    illustrative: false,
    alt: {
      en: "A clean workspace at night, a laptop screen glowing softly out of focus.",
      ar: "مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز.",
    },
  },
  {
    id: "cat-software-digital-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "code",
    illustrative: false,
    alt: {
      en: "A wide, minimal software workspace with two screens in warm ambient light.",
      ar: "مساحة عمل برمجية واسعة وبسيطة بشاشتين تحت إضاءة محيطة دافئة.",
    },
  },

  // Hero fallback (only used if the code-driven scene is replaced by media later)
  {
    id: "hero-fallback-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "event",
    illustrative: false,
    alt: {
      en: "Stage lights cutting through warm haze over an empty venue.",
      ar: "أضواء مسرح تشقّ ضبابًا دافئًا فوق قاعة خالية.",
    },
  },
  {
    id: "hero-fallback-9x16",
    kind: "ai",
    aspect: "9:16",
    src: null,
    paint: "event",
    illustrative: false,
    alt: {
      en: "A tall frame of stage light rays falling through haze.",
      ar: "إطار طولي لأشعة ضوء مسرح تنساب عبر الضباب.",
    },
  },

  // How we work
  {
    id: "process-plan-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "table",
    illustrative: false,
    alt: {
      en: "A planning table with floor plans, a pencil and a cup of Arabic coffee.",
      ar: "طاولة تخطيط عليها مخططات القاعة وقلم وفنجان قهوة عربية.",
    },
  },
  {
    id: "process-build-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "studio",
    illustrative: false,
    alt: {
      en: "A stage being built in an exhibition hall, frames and lights half rigged.",
      ar: "مسرح قيد التركيب في قاعة معارض، والهياكل والإضاءة نصف مجهّزة.",
    },
  },
  {
    id: "process-produce-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "print",
    illustrative: false,
    alt: {
      en: "Hands checking a printed proof under a warm lamp.",
      ar: "يدان تراجعان نسخة مطبوعة تحت مصباح دافئ.",
    },
  },
  {
    id: "process-launch-4x5",
    kind: "ai",
    aspect: "4:5",
    src: null,
    paint: "event",
    illustrative: false,
    alt: {
      en: "A desert evening setup with lanterns lit, moments before guests arrive.",
      ar: "تجهيز مسائي في الصحراء والفوانيس مضاءة، قبل وصول الضيوف بلحظات.",
    },
  },

  // Product concept backgrounds
  {
    id: "product-qr-check-in-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "code",
    illustrative: false,
    alt: {
      en: "An event entrance at dusk with a softly lit check-in point, out of focus.",
      ar: "مدخل فعالية عند الغروب ونقطة تسجيل مضاءة بنعومة خارج التركيز.",
    },
  },
  {
    id: "product-restaurant-system-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "table",
    illustrative: false,
    alt: {
      en: "A restaurant pass at service time, warm lights and plates in soft focus.",
      ar: "منضدة تقديم في مطعم وقت الخدمة، أضواء دافئة وأطباق في تركيز ناعم.",
    },
  },
];
