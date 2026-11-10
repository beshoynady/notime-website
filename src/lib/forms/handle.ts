import type { z } from "zod";
import { HONEYPOT, fieldErrors, type FormState } from "./schemas";
import { rateLimit } from "./rate-limit";

/** Plain values of a submission, without the shared and anti-spam fields' noise. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  return out;
}

/**
 * The shared submission steps (D92): honeypot → rate limit → validation → delivery. Until
 * step 5 wires delivery (Turnstile verification, then Resend: the team email and the
 * auto-reply), `deliver` is absent and a valid submission returns `success` without sending.
 */
export async function handleSubmission<S extends z.ZodType>(
  schema: S,
  formData: FormData,
  {
    ip,
    now = Date.now(),
    deliver,
  }: { ip: string; now?: number; deliver?: (data: z.output<S>, values: Record<string, string>) => Promise<FormState["status"]> },
): Promise<FormState> {
  const values = formValues(formData);
  if (values[HONEYPOT]) return { status: "success" }; // a bot: look accepted, send nothing
  const limit = rateLimit(ip, now);
  if (!limit.ok) return { status: "rateLimited", retryAfter: limit.retryAfter, fields: values };
  const parsed = schema.safeParse(values);
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error), fields: values };
  if (!deliver) return { status: "success" }; // TODO: replace placeholder — step 5 wires delivery
  const status = await deliver(parsed.data, values);
  return status === "success" ? { status } : { status, fields: values };
}
