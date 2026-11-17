import { services } from "@/content/services";

/** The number of services in the catalogue, all categories (the About "Services" figure). */
export function serviceCount(): number {
  return services.length;
}
