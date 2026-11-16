"use server";

import { headers } from "next/headers";
import { handleSubmission } from "@/lib/forms/handle";
import { composeMail, deliverMail } from "@/lib/forms/mailer";
import { contactSchema, consultationSchema, interestSchema, websiteReviewSchema, type FormState } from "@/lib/forms/schemas";
import { parseServiceParam } from "@/lib/forms/service-param";
import { verifyTurnstile } from "@/lib/forms/turnstile";
import { turnstileSecret } from "@/lib/forms/turnstile-config";

/**
 * The form actions (D92 interfaces; the lead owns this file). Use with React's
 * `useActionState(action, IDLE)` and a plain `<form action={formAction}>`.
 * Each runs honeypot → rate limit → validation → Turnstile → delivery (D102).
 */
async function ip() {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function steps() {
  const at = await ip();
  return { ip: at, verify: (token: string) => verifyTurnstile(token, at, { secret: turnstileSecret() }) };
}

const shared = (formData: FormData) => ({ locale: String(formData.get("locale") ?? "en"), source: String(formData.get("source") ?? "").slice(0, 60) });

/** The free 30-min intro call (Software page, `#consult`). */
export async function submitConsultation(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(consultationSchema, formData, { ...(await steps()), deliver: (d) => deliverMail(composeMail("consultation", d, shared(formData))) });
}

/** The free website review (D91). Subject prefix `[Website review]`. */
export async function submitWebsiteReview(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(websiteReviewSchema, formData, { ...(await steps()), deliver: (d) => deliverMail(composeMail("websiteReview", d, shared(formData))) });
}

/** Register interest in a product (Minute Zero, Peak Hour). */
export async function submitInterest(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(interestSchema, formData, { ...(await steps()), deliver: (d) => deliverMail(composeMail("interest", d, shared(formData))) });
}

/** The brief on /contact (`?service=` preset); an unknown service is dropped, never echoed. */
export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(contactSchema, formData, {
    ...(await steps()),
    deliver: (d) => deliverMail(composeMail("contact", { ...d, service: parseServiceParam(d.service) }, shared(formData))),
  });
}
