/**
 * Build a wa.me link from a configured number. Returns null while the number
 * is missing or not a plausible E.164 number (8–15 digits), so the UI can show
 * its "number pending" state instead of a broken link.
 */
export function whatsappHref(number: string, text?: string): string | null {
  const digits = number.replace(/[\s()+.-]/g, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
