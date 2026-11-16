import type { z } from "zod";
import { HONEYPOT, TURNSTILE_FIELD, fieldErrors, type FormState } from "./schemas";
import { rateLimit } from "./rate-limit";

/** Plain values of a submission, without the shared and anti-spam fields' noise. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  return out;
}

/**
 * The shared submission steps (D92, D102): honeypot → rate limit → validation → Turnstile →
 * delivery. Validation runs before Turnstile so an invalid form doesn't spend its single-use
 * token. Without `deliver` (unit tests) a valid submission returns `success` and sends nothing.
 */
export async function handleSubmission<S extends z.ZodType>(
  schema: S,
  formData: FormData,
  {
    ip,
    now = Date.now(),
    verify,
    deliver,
  }: { ip: string; now?: number; verify?: (token: string) => Promise<boolean>; deliver?: (data: z.output<S>, values: Record<string, string>) => Promise<FormState["status"]> },
): Promise<FormState> {
  const values = formValues(formData);
  if (values[HONEYPOT]) return { status: "success" }; // a bot: look accepted, send nothing
  const limit = rateLimit(ip, now);
  if (!limit.ok) return { status: "rateLimited", retryAfter: limit.retryAfter, fields: values };
  const parsed = schema.safeParse(values);
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error), fields: values };
  if (verify && !(await verify(values[TURNSTILE_FIELD] ?? ""))) return { status: "blocked", fields: values };
  if (!deliver) return { status: "success" };
  const status = await deliver(parsed.data, values);
  return status === "success" ? { status } : { status, fields: values };
}
