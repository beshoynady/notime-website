/**
 * Content access layer — the CMS swap point. Components import only from here.
 * A future Sanity migration replaces these bodies; signatures stay the same.
 */
import { categories } from "./categories";
import { imageSlots } from "./images";
import { products } from "./products";
import { services } from "./services";
import type { Category, CategorySlug, ImageSlot, Product, Service } from "./types";

export type * from "./types";
export * from "./links";

export function getCategories(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getServices(category?: CategorySlug): Service[] {
  const order = new Map(categories.map((c) => [c.slug, c.order]));
  return services
    .filter((s) => !category || s.category === category)
    .sort((a, b) => order.get(a.category)! - order.get(b.category)! || a.order - b.order);
}

export function getServiceCount(): number {
  return services.length;
}

export function getProducts(): Product[] {
  return products;
}

export function getImageSlots(): ImageSlot[] {
  return imageSlots;
}

export function getImageSlot(id: string): ImageSlot {
  const slot = imageSlots.find((s) => s.id === id);
  if (!slot) throw new Error(`Unknown image slot: ${id}`);
  return slot;
}

export function getServiceByAnchor(anchor: string): Service | undefined {
  return services.find((s) => s.anchor === anchor);
}
