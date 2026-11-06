/**
 * Page-level "an overlay is open" flag (mega menu, mobile menu). Header tone and floating
 * UI (WhatsApp button) key off `html[data-overlay-open]` instead of each other's internals.
 */
export function setOverlayOpen(open: boolean) {
  document.documentElement.toggleAttribute("data-overlay-open", open);
}
