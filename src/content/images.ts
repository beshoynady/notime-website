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
    width: 859,
    height: 1290,
    blurDataURL:
      "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAQCdASoHAAoAA4BaJZACdADzY2sgAP4JyEXoc37eMG3RwywrbwDF3LvHIJkBLzdOcZyV3itfbZEL33Sy2+xS34Q4AA==",
    paint: "event",
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
    width: 1600,
    height: 1066,
    blurDataURL:
      "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoKAAcAA4BaJaACdAD8KBZPIgAA/peX4eqyIk2lR2nNopviJJZTLarHuLt2BpjJJaheQGXG2xLcPNnRwAA=",
    paint: "event",
    alt: {
      en: "A glass-roofed hall set with long candlelit tables under red lanterns.",
      ar: "قاعة بسقف زجاجي مهيّأة بطاولات طويلة على ضوء الشموع، تحت فوانيس حمراء.",
    },
  },
  {
    id: "cat-creative-production-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-creative-production-4x5.webp",
    width: 1136,
    height: 1408,
    blurDataURL:
      "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoKAAwAAsBMJZgCdAELYMYiJXUAAP75WlGS+E4G7Y1kmU8fFjO07j+EQtYATJxfz3Yd50DUSjvIQE9CpaRUa5IlxSOydlLAIieIfgAA",
    paint: "studio",
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
    width: 1187,
    height: 668,
    blurDataURL:
      "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoKAAYAA4BaJZgCdADdYsVAzwAA/U79h4LcuO8dBP+JfqNv6nmzCLf8I4SWbas99YFDbGtRK63LH627bcwAAA==",
    paint: "studio",
    alt: {
      en: "Food styling for a shoot: plated desserts on wooden boards beside palm leaves.",
      ar: "تنسيق طعام لجلسة تصوير: حلويات مصفوفة على ألواح خشبية بجانب سعف النخيل.",
    },
  },
  {
    id: "cat-marketing-brand-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-marketing-brand-4x5.webp",
    width: 1136,
    height: 1408,
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAACwAQCdASoKAAwAAsBMJYwCdADyVeqAAP70u4PC/wauR/GNL9FPp3/QmAXjyDIhfFPR3aTzd8yD95KYf2LJNR9Pw2RBdwt1HIFvAQ/IZ6gZxIIaMemDAqwAAAA=",
    paint: "brand",
    alt: {
      en: "Brand material laid out on a desk: paper samples, swatches and a closed notebook.",
      ar: "مواد هوية على مكتب: عيّنات ورق ودرجات ألوان ودفتر مغلق.",
    },
  },
  // TODO: swap to real photo after approval: the UAE Pro League gift photos (uae-pro-league-5; p24-1 gift box once a clean original arrives, OQ #21). OQ #17.
  {
    id: "cat-production-print-gifts-4x5",
    kind: "ai",
    aspect: "4:5",
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-production-print-gifts-4x5.webp",
    width: 1136,
    height: 1408,
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoKAAwAAsBMJQBOgCKTrDgWf8AA/vMw9ZB6XHMrCgFFMBQByF0ffZg458YTBqemAEQSzOsr0mFWfoZCK0iV2QDdUq9a2EGCbSygAA==",
    paint: "print",
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
    width: 1280,
    height: 719,
    blurDataURL:
      "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoKAAYAA4BaJYwCdADcqAaAAP6D2Fn//xF0g7K5LaGdCwB1YAA=",
    paint: "print",
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
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/cat-software-digital-4x5.webp",
    width: 1136,
    height: 1408,
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoKAAwAAsBMJYgCdAD5jkT85aPgAP75+7prx597OcL6B8ghwF/U6sYtthv6w7n25ijTTTYLYymqWnQVCa64j5wAodwUSDIV5AAAAA==",
    paint: "code",
    alt: {
      en: "A clean workspace at night, a laptop screen glowing softly out of focus.",
      ar: "مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز.",
    },
  },

  // Hero fallback (only used if the code-driven scene is replaced by media later)
  {
    id: "hero-fallback-16x9",
    kind: "ai",
    aspect: "16:9",
    src: null,
    paint: "event",
    alt: {
      en: "Stage lights cutting through warm haze over an empty venue.",
      ar: "أضواء مسرح تشقّ ضبابًا دافئًا فوق قاعة خالية.",
    },
  },
  {
    id: "hero-fallback-9x16",
    kind: "ai",
    aspect: "9:16",
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/hero-fallback-9x16.webp",
    width: 944,
    height: 1680,
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAwCdASoKABIAPtFWpEuoJKOhsAgBABoJYwCdAB53ibzBJg9i9NkAAP7zUHu0aDt0DL0+E4z8cMIeRpWgsmU3ulaYVhybLc/RLx3HEzfo15zuPS/XyO2vwAA=",
    paint: "event",
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
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/process-plan-4x5.webp",
    width: 1136,
    height: 1408,
    blurDataURL:
      "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADQAQCdASoKAAwAAsBMJQBOgBuLLYMjoAD87Mtsn57TAF/Z1ja45EqS713+LWfcFvmFFA+yqYYts3Z7mL+jILN0jiT6aMWWtRUxmR5IiUgVtir96yd+sAAA",
    paint: "table",
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
    width: 953,
    height: 715,
    blurDataURL:
      "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoKAAgAA4BaJYwCdADb7CxxUADyoXsqGlV6gAmRmduiiJQJa84TgyQsQ5pmQrRlmBnG+yOFeRAun0+AAAA=",
    paint: "studio",
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
    width: 718,
    height: 759,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoJAAoAA4BaJZACdH8AE5xZ+z0AAP6bVN7hkQ7IcdYvM51d2n3fhLZSSx/a2Oyvuk9+hAh8HKqtfwknJeYV6jwAAAA=",
    paint: "print",
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
    width: 891,
    height: 668,
    blurDataURL:
      "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoKAAcAA4BaJZQCdAELT7t+8AAA/vMQoINyNf5ShMq7Dwpa8Ps9oWeDZq/6gmmgAAA=",
    paint: "event",
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
    // AI image (D50, D51): native-size Canva master in "NO TIME – Website AI", passed the full-size inspection.
    src: "/images/ai/product-qr-check-in-16x9.webp",
    width: 1680,
    height: 944,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoKAAYAAsBMJQBOgBufBbloAP72sJvduM4pFdRRpHEt37tgHQ2GkSYG8SP4j74P1ueWcvP/vqROXuWi2IUtKsmJIAA=",
    paint: "code",
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
    alt: {
      en: "A restaurant pass at service time, warm lights and plates in soft focus.",
      ar: "منضدة تقديم في مطعم وقت الخدمة، أضواء دافئة وأطباق في تركيز ناعم.",
    },
  },
  // Work cards: no slot. Anonymised cases show a drawing of the work (CaseVisual, D106), never a
  // stand-in photo.
  // Real screenshot of this site (Software & Digital proof strip): NO TIME's own work, no client.
  {
    id: "notime-website-home-en",
    kind: "real",
    aspect: "16:9",
    src: "/images/work/notime-website/notime-website-home-en.webp",
    width: 1440,
    height: 810,
    blurDataURL: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoKAAYAA4BaJYwCdAELU0VvAAD+8aZ6X9WmV3eDsM6908SgyH7HlIAA",
    paint: "code",
    alt: {
      en: "The NO TIME homepage in English, on a laptop screen.",
      ar: "الصفحة الرئيسية لموقع NO TIME بالإنجليزية على شاشة حاسوب محمول.",
    },
  },
  // Real screenshot of this site (Software & Digital proof strip): NO TIME's own work, no client.
  {
    id: "notime-website-home-ar",
    kind: "real",
    aspect: "16:9",
    src: "/images/work/notime-website/notime-website-home-ar.webp",
    width: 1440,
    height: 810,
    blurDataURL: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoKAAYAA4BaJYwCdAEfaUH2AAD+8aXewNinnYoDu7fKii+3lL3wXhUAAAA=",
    paint: "code",
    alt: {
      en: "The NO TIME homepage in Arabic, laid out right to left.",
      ar: "الصفحة الرئيسية لموقع NO TIME بالعربية، بتخطيط من اليمين إلى اليسار.",
    },
  },
  // Real screenshot of this site (Software & Digital proof strip): NO TIME's own work, no client.
  {
    id: "notime-website-category-en",
    kind: "real",
    aspect: "9:16",
    src: "/images/work/notime-website/notime-website-category-en.webp",
    width: 780,
    height: 1386,
    blurDataURL: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABQAwCdASoKABIAPu1iqU2ppaOiMAgBMB2JZwCdACB7JAvJyAD+5diCZrm6Rts18sSWWgpNSc0j5rbNTH8AAA==",
    paint: "code",
    alt: {
      en: "A NO TIME service page in English, on a phone.",
      ar: "صفحة خدمات من موقع NO TIME بالإنجليزية على شاشة هاتف.",
    },
  },
  // Real screenshot of this site (Software & Digital proof strip): NO TIME's own work, no client.
  {
    id: "notime-website-category-ar",
    kind: "real",
    aspect: "9:16",
    src: "/images/work/notime-website/notime-website-category-ar.webp",
    width: 780,
    height: 1386,
    blurDataURL: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAABwAwCdASoKABIAPu1iqU2ppaOiMAgBMB2JZwCdACHElCvRigAA/uPY3lTMhNwXR4k1iHlK1AbEtZ25GekaT+PAAAA=",
    paint: "code",
    alt: {
      en: "A NO TIME service page in Arabic, on a phone.",
      ar: "صفحة خدمات من موقع NO TIME بالعربية على شاشة هاتف.",
    },
  },
];
