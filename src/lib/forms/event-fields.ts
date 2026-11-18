import { getServiceByAnchor } from "@/content";

/** True when the anchor names a service in the Events & Hospitality category. */
export function isEventsService(anchor: string): boolean {
  return getServiceByAnchor(anchor)?.category === "events-hospitality";
}

/** Client: show the event date and guests. The chosen service wins over the `?category=` hint. */
export function showEventFields({ service, category }: { service: string; category: string }): boolean {
  return isEventsService(service) || (service === "" && category === "events-hospitality");
}

/** Server: keep a posted event date and guests (the category hint never reaches the server). */
export function keepEventFields(service: string): boolean {
  return service === "" || isEventsService(service);
}

export { monthOptions } from "./event-visibility";
