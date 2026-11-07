import type { ImageSlot } from "./types";

/**
 * Image slots. Every slot has a matching entry in docs/content/image-prompts.md (tested).
 * `kind: "real"` slots use curated NO TIME photos from public/images/work/ (D49); AI images go
 * to public/images/ai/<id>.{avif,webp}. To drop one in, set `src` (and `blurDataURL`).
 *
 * TODO: replace placeholder — every `src: null` slot renders the designed placeholder.
 */
export const imageSlots: ImageSlot[] = [
  // Category images (4:5 for menu and cards, 16:9 for headers)
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "cat-events-hospitality-4x5",
    kind: "real",
    aspect: "4:5",
    src: "/images/work/private-celebrations/private-celebrations-2.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAQCdASoHAAoAA4BaJZACdADzY2sgAP4JyEXoc37eMG3RwywrbwDF3LvHIJkBLzdOcZyV3itfbZEL33Sy2+xS34Q4AA==",
    paint: "event",
    illustrative: false,
    alt: {
      en: "White roses and blue hydrangeas on a dressed table, lit by candles.",
      ar: "ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "cat-events-hospitality-16x9",
    kind: "real",
    aspect: "16:9",
    src: "/images/work/private-celebrations/private-celebrations-1.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoKAAcAA4BaJaACdAD8KBZPIgAA/peX4eqyIk2lR2nNopviJJZTLarHuLt2BpjJJaheQGXG2xLcPNnRwAA=",
    paint: "event",
    illustrative: false,
    alt: {
      en: "A glass-roofed hall set with long candlelit tables under red lanterns.",
      ar: "قاعة بسقف زجاجي مهيّأة بطاولات طويلة على ضوء الشموع، تحت فوانيس حمراء.",
    },
  },
  {
    id: "cat-creative-production-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-creative-production-4x5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoKAA0AAsBMJZgCdAEfUoCMZ9agAP75WlGSx8pXwpJFTUhwOfe0xdl7XvZmcJEyHmz7RS46UGZ0b2S+02vJo8ZTly84j4kVXyxJ0vGwAAA=",
    paint: "studio",
    illustrative: false,
    alt: {
      en: "A film studio set with a camera on a dolly and a single warm key light.",
      ar: "موقع تصوير في استوديو، كاميرا على عربة وضوء رئيسي دافئ واحد.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "cat-creative-production-16x9",
    kind: "real",
    aspect: "16:9",
    src: "/images/work/catering/catering-4.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoKAAYAA4BaJZgCdADdYsVAzwAA/U79h4LcuO8dBP+JfqNv6nmzCLf8I4SWbas99YFDbGtRK63LH627bcwAAA==",
    paint: "studio",
    illustrative: false,
    alt: {
      en: "Food styling for a shoot: plated desserts on wooden boards beside palm leaves.",
      ar: "تنسيق طعام لجلسة تصوير: حلويات مصفوفة على ألواح خشبية بجانب سعف النخيل.",
    },
  },
  {
    id: "cat-marketing-brand-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-marketing-brand-4x5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoKAA0AAsBMJYwCdAD0orfwqK5cAP70vHLZK2ojb7QJVnDYAJ8LrzJwDLhdiCNlvrsALoOMYChAvNWtW5luCCbkC2trfKCmGBhoq4KA/3v2YwKsAAA=",
    paint: "brand",
    illustrative: false,
    alt: {
      en: "Brand material laid out on a desk: paper samples, swatches and a closed notebook.",
      ar: "مواد هوية على مكتب: عيّنات ورق ودرجات ألوان ودفتر مغلق.",
    },
  },
  // TODO: swap to real photo after approval (OQ #17; image-prompts.md names the photo).
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
  // TODO: swap to real photo after approval: the UAE Pro League gift photos (uae-pro-league-5; p24-1 gift box once a clean original arrives, OQ #21). OQ #17.
  {
    id: "cat-production-print-gifts-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-production-print-gifts-4x5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoKAA0AAsBMJQBOgCPtyNmFvMAA/vGCH4UiC+f16EW8jmBgsCIYnTHND5iAdZZORz7YsIlCqU/DfStk5Uzq7nPL7wPBeVKwLlOO5mkAAAA=",
    paint: "print",
    illustrative: false,
    alt: {
      en: "Hands tying a champagne ribbon on a dark corporate gift box.",
      ar: "يدان تعقدان شريطًا بلون الشمبانيا على علبة هدايا داكنة.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "cat-production-print-gifts-16x9",
    kind: "real",
    aspect: "16:9",
    src: "/images/work/gifts/gifts-1.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoKAAYAA4BaJYwCdADcqAaAAP6D2Fn//xF0g7K5LaGdCwB1YAA=",
    paint: "print",
    illustrative: false,
    alt: {
      en: "A gold bookmark cut in the shape of the Dubai skyline.",
      ar: "فاصل كتاب ذهبي مقصوص على شكل أفق دبي.",
    },
  },
  // TODO: swap to real photo after approval (OQ #17; image-prompts.md names the photo).
  {
    id: "cat-software-digital-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-software-digital-4x5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoKAA0AAsBMJYgCdAEO/6tCnpgAAP75+13DR7s9MNZPQRdbbEvJFqGZXdSPqryTrpa8qyQpvMcGKxX7N9Vn3IOkwm6wf3FyrIAAAA==",
    paint: "code",
    illustrative: false,
    alt: {
      en: "A clean workspace at night, a laptop screen glowing softly out of focus.",
      ar: "مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز.",
    },
  },
  // TODO: swap to real photo after approval (OQ #17; image-prompts.md names the photo).
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
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/hero-fallback-9x16.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAwCdASoKABIAPtFYpkwoJSOiMAgBABoJYwCdAB53joOK55QGaQAA/vNQe7RoO3QMvT4TidBdrfw6vRfSh7zynIN3uuEC1GjY6UTnN1P+XTWEhpzheqcAAAA=",
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
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/process-plan-4x5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoKAA0AAsBMJQBOgMWltcNdhEaQYAD8+vF2iWv0R3xon7MiAjmPa2SXnY3bPlc5rurPI2XGUC21Hbj4W0qLyf+tcL3WfgOB0RIxk3c5vB1nWUAkgAA=",
    paint: "table",
    illustrative: false,
    alt: {
      en: "A planning table with floor plans, a pencil and a cup of Arabic coffee.",
      ar: "طاولة تخطيط عليها مخططات القاعة وقلم وفنجان قهوة عربية.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "process-build-4x5",
    kind: "real",
    aspect: "4:5",
    src: "/images/work/private-celebrations/private-celebrations-8.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoKAAgAA4BaJYwCdADb7CxxUADyoXsqGlV6gAmRmduiiJQJa84TgyQsQ5pmQrRlmBnG+yOFeRAun0+AAAA=",
    paint: "studio",
    illustrative: false,
    alt: {
      en: "A ballroom during setup, with truss and scaffolding going up.",
      ar: "قاعة احتفالات أثناء التجهيز، والهياكل المعدنية والسقالات قيد التركيب.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "process-produce-4x5",
    kind: "real",
    aspect: "4:5",
    src: "/images/work/catering/catering-5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoJAAoAA4BaJZACdH8AE5xZ+z0AAP6bVN7hkQ7IcdYvM51d2n3fhLZSSx/a2Oyvuk9+hAh8HKqtfwknJeYV6jwAAAA=",
    paint: "print",
    illustrative: false,
    alt: {
      en: "A server carrying a tiered silver stand of desserts.",
      ar: "نادل يحمل حاملًا فضيًا من عدة طبقات عليه حلويات.",
    },
  },
  // Real NO TIME photo from the 2026 profile (D49): no client name, no identifiable person.
  {
    id: "process-launch-4x5",
    kind: "real",
    aspect: "4:5",
    src: "/images/work/heritage/heritage-5.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoKAAcAA4BaJZQCdAELT7t+8AAA/vMQoINyNf5ShMq7Dwpa8Ps9oWeDZq/6gmmgAAA=",
    paint: "event",
    illustrative: false,
    alt: {
      en: "A desert tent at night, its carpets laid out for guests.",
      ar: "خيمة صحراوية ليلًا، وسجّادها مفروش لاستقبال الضيوف.",
    },
  },

  // Product concept backgrounds
  {
    id: "product-qr-check-in-16x9",
    kind: "ai",
    aspect: "16:9",
    // AI image (D50): Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/product-qr-check-in-16x9.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoKAAYAAsBMJQBOgCBtwvfAAP72sJvduM4pFdRRpHEt325gEPMbRXRX/B6PFrplC/feCbZTxO5V73LRbEKWlWTEkAAAAA==",
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
