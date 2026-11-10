import { z } from "zod";

/**
 * The forms' contract (D92, frozen for the parallel batch; the lead owns it). Shared by the
 * client (react-hook-form + zodResolver) and the Server Actions in src/app/actions/forms.ts.
 *
 * Errors are codes, never sentences: the UI maps each `FieldErrorCode` to its EN/AR message.
 * Field names are the form-field `name`s exactly. Every form also posts the shared fields
 * (`locale`, `source`, the honeypot and the Turnstile token), which the actions read first.
 */

export const FIELD_ERRORS = ["required", "email", "url", "phone", "contact", "tooLong", "invalid"] as const;
export type FieldErrorCode = (typeof FIELD_ERRORS)[number];

/** Honeypot field: visually hidden, `tabIndex={-1}`, `autoComplete="off"`; must stay empty. */
export const HONEYPOT = "company_website";
/** The Turnstile widget's hidden input name. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

const req = (max: number) =>
  z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .max(max, { error: "tooLong" });
const opt = (max: number) => z.string().trim().max(max, { error: "tooLong" }).optional().default("");

const PHONE = /^\+?[0-9 ()-]{7,20}$/;
const email = z.string({ error: "required" }).trim().min(1, { error: "required" }).pipe(z.email({ error: "email" }));
const phoneOpt = z
  .string()
  .trim()
  .refine((v) => v === "" || PHONE.test(v), { error: "phone" })
  .optional()
  .default("");
/** A site address; "example.com" is accepted and normalised to https://example.com. */
const siteUrl = (required: boolean) =>
  z
    .string()
    .trim()
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .refine((v) => (required ? v !== "" : true), { error: "required" })
    .refine((v) => v === "" || (z.url().safeParse(v).success && /\.[a-z]{2,}/i.test(v)), { error: "url" })
    .optional()
    .default("");

/** Shared by every form. `source` is the page (e.g. "software-digital", "contact", "minute-zero"). */
export const sharedFields = z.object({
  locale: z.enum(["en", "ar"]),
  source: z.string().trim().max(60).default(""),
});

// ---------------------------------------------------------------- consultation (intro call)

/** What the visitor wants to build: the six software services, event tech, or other. */
export const BUILD_OPTIONS = ["websites", "apps", "systems", "e-commerce", "ux", "ai-consulting", "event-tech", "other"] as const;
export const TIMELINES = ["flexible", "within-3-months", "urgent"] as const;
/** The engagement levels on the Software page; a tier CTA presets this (no prices, D91). */
export const TIERS = ["launch", "grow", "platform"] as const;
/** Software budget bands (src/content/forms.ts `budgetBands.software`), optional. */
export const SOFTWARE_BUDGETS = ["sw-under-25k", "sw-25k-75k", "sw-75k-150k", "sw-150k-300k", "sw-over-300k", "prefer-not"] as const;

export const consultationSchema = z.object({
  build: z.enum(BUILD_OPTIONS, { error: "required" }),
  timeline: z.enum(TIMELINES, { error: "required" }),
  budget: z.enum(SOFTWARE_BUDGETS).or(z.literal("")).optional().default(""),
  websiteUrl: siteUrl(false),
  tier: z.enum(TIERS).or(z.literal("")).optional().default(""),
  name: req(100),
  email,
  phone: phoneOpt,
  company: opt(120),
  message: opt(2000),
});
export type ConsultationInput = z.input<typeof consultationSchema>;
export type Consultation = z.output<typeof consultationSchema>;

// ---------------------------------------------------------------- free website review (D91)

export const REVIEW_GOALS = ["more-enquiries", "arabic-version", "speed", "easier-updates", "other"] as const;

/** "Email or WhatsApp": one field; an email address or a phone number. */
const contact = z
  .string({ error: "required" })
  .trim()
  .min(1, { error: "required" })
  .refine((v) => z.email().safeParse(v).success || PHONE.test(v), { error: "contact" });

export const websiteReviewSchema = z.object({
  websiteUrl: siteUrl(true),
  name: req(100),
  contact,
  goal: z.enum(REVIEW_GOALS, { error: "required" }),
  message: opt(2000),
});
export type WebsiteReviewInput = z.input<typeof websiteReviewSchema>;
export type WebsiteReview = z.output<typeof websiteReviewSchema>;

// ---------------------------------------------------------------- register interest (products)

export const PRODUCTS = ["minute-zero", "peak-hour"] as const;

export const interestSchema = z.object({
  product: z.enum(PRODUCTS, { error: "invalid" }),
  name: req(100),
  email,
  company: opt(120),
  message: opt(1000),
});
export type InterestInput = z.input<typeof interestSchema>;
export type Interest = z.output<typeof interestSchema>;

// ---------------------------------------------------------------- the action result

/**
 * What every form action returns (React `useActionState`). `fields` echoes the submitted values
 * on an error so the form can keep them without JS.
 * - `success`: show the success state (the reply promise in the page's copy).
 * - `invalid`: `errors` holds a code per field; focus the error summary.
 * - `rateLimited`: `retryAfter` seconds.
 * - `blocked`: Turnstile or the honeypot failed; ask to retry, or to write to the email address.
 * - `failed`: the server couldn't send; offer the email address (and WhatsApp when configured).
 */
export type FormStatus = "idle" | "success" | "invalid" | "rateLimited" | "blocked" | "failed";
export type FormState = {
  status: FormStatus;
  errors?: Partial<Record<string, FieldErrorCode>>;
  fields?: Record<string, string>;
  retryAfter?: number;
};
export const IDLE: FormState = { status: "idle" };

/** Field codes from a failed parse (first issue per field). */
export function fieldErrors(error: z.ZodError): Partial<Record<string, FieldErrorCode>> {
  const out: Partial<Record<string, FieldErrorCode>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (!key || out[key]) continue;
    out[key] = (FIELD_ERRORS as readonly string[]).includes(issue.message) ? (issue.message as FieldErrorCode) : "invalid";
  }
  return out;
}
