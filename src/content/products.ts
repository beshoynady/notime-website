import type { Product } from "./types";

// TODO: replace placeholder — product names are TBD (OPEN_QUESTIONS #5).
// These working names describe what each product does; they are not final names.
export const products: Product[] = [
  {
    slug: "qr-check-in",
    status: "comingSoon",
    name: { en: "QR event check-in", ar: "تسجيل دخول الفعاليات بالـ QR" },
    summary: {
      en: "Guests check in at the door with a QR code; the team sees arrivals as they happen.",
      ar: "يسجّل الضيوف دخولهم عند الباب برمز QR، ويرى الفريق الحضور لحظة بلحظة.",
    },
    image: "product-qr-check-in-16x9",
  },
  {
    slug: "restaurant-system",
    status: "comingSoon",
    name: { en: "Restaurant management", ar: "نظام إدارة المطاعم" },
    summary: {
      en: "Orders, tables and the kitchen in one system, built for busy service.",
      ar: "الطلبات والطاولات والمطبخ في نظام واحد، مصمّم لأوقات الذروة.",
    },
    image: "product-restaurant-system-16x9",
  },
];
