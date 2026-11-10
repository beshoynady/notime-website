"use server";

import { headers } from "next/headers";
import { handleSubmission } from "@/lib/forms/handle";
import { consultationSchema, interestSchema, websiteReviewSchema, type FormState } from "@/lib/forms/schemas";

/**
 * The form actions (D92, frozen interfaces; the lead owns this file). Use with React's
 * `useActionState(action, IDLE)` and a plain `<form action={formAction}>`.
 *
 * Until step 5 (Task 4.2's delivery), a valid submission returns `success` and sends nothing:
 * the review build shows the designed states with no email.
 */
async function ip() {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** The free 30-min intro call (Software page, `#consult`; the Contact page later). */
export async function submitConsultation(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(consultationSchema, formData, { ip: await ip() });
}

/** The free website review (D91). Email subject prefix `[Website review]` at delivery. */
export async function submitWebsiteReview(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(websiteReviewSchema, formData, { ip: await ip() });
}

/** Register interest in a product (Minute Zero, Peak Hour). */
export async function submitInterest(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleSubmission(interestSchema, formData, { ip: await ip() });
}
