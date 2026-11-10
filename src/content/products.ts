import type { Locale, Product } from "./types";

/**
 * Products (D78 names, approved 2026-11-09). `name` is the short name used inside the pages;
 * `descriptor` says what it does. Titles, metadata, schema and menus use the lockup
 * (`productLockup`). A quick web search found no clash; a trademark search (UAE Ministry of
 * Economy, WIPO Global Brand Database) is still owed before launch (CONTENT_CHECKLIST).
 */
export const products: Product[] = [
  {
    slug: "qr-check-in",
    status: "comingSoon",
    name: { en: "Minute Zero", ar: "الدقيقة صفر" },
    descriptor: { en: "QR event check-in", ar: "تسجيل دخول الفعاليات بالـ QR" },
    summary: {
      en: "Guests check in at the door with a QR code; the team sees arrivals as they happen.",
      ar: "يسجّل الضيوف دخولهم عند الباب برمز QR، ويرى الفريق الحضور لحظة بلحظة.",
    },
    image: "product-qr-check-in-16x9",
  },
  {
    slug: "restaurant-system",
    status: "comingSoon",
    name: { en: "Peak Hour", ar: "ساعة الذروة" },
    descriptor: { en: "Restaurant management", ar: "نظام إدارة المطاعم" },
    summary: {
      en: "Orders, tables and the kitchen in one system, built for busy service.",
      ar: "الطلبات والطاولات والمطبخ في نظام واحد، مصمّم لأوقات الذروة.",
    },
    image: "product-restaurant-system-16x9",
  },
];

/** "Minute Zero · QR event check-in": the name with what it does, for titles, metadata and menus. */
export const productLockup = (p: Pick<Product, "name" | "descriptor">, locale: Locale) => `${p.name[locale]} · ${p.descriptor[locale]}`;
