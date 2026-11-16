import { services } from "@/content/services";

/**
 * `?service=<anchor>` → a known service anchor, or "" (plan Review Focus 4): an unknown value, a
 * script string or another page's anchor never selects anything, never errors and is never echoed.
 * `within` limits it to the anchors a form offers.
 */
export function parseServiceParam(value: string | null | undefined, within: readonly string[] = services.map((s) => s.anchor)): string {
  if (!value || value.length > 60 || !/^[a-z0-9-]+$/.test(value)) return "";
  return within.includes(value) ? value : "";
}
