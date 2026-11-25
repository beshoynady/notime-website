import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { render } from "@react-email/components";
import { createElement } from "react";
import { Resend } from "resend";
import { getServiceByAnchor } from "@/content";
import { AutoReply } from "@/emails/auto-reply";
import { autoReplyCopy, fillMail, localeOf } from "@/emails/copy";
import { TeamEmail } from "@/emails/team-email";
import { leadRows, type LeadSource } from "@/lib/lead-source";
import { GUEST_LABELS, type Contact, type Consultation, type FormState, type Interest, type WebsiteReview } from "./schemas";

/**
 * Delivery (Task 4.2, D102): one email to the team (`CONTACT_TO_EMAIL`, reply-to the visitor) and,
 * once the domain is verified (`MAIL_FROM` set), an auto-reply in the visitor's language. Until
 * then Resend's shared sender carries the team email only. `MAIL_SINK=file` (tests only; never
 * set on the host) writes JSON to test-results/mail/ instead of sending. Nothing here logs a key,
 * an address or a message.
 */
export type MailKind = "consultation" | "websiteReview" | "interest" | "contact";

export interface Mail {
  kind: MailKind;
  subject: string;
  rows: [string, string][];
  /** The visitor's email, when they gave one: reply-to, and the auto-reply's address. */
  visitorEmail?: string;
  locale: "en" | "ar";
  vars: Record<string, string>;
}

const PRODUCT_NAMES = { "invitely": "Invitely", "smart-menu": "Smart Menu" } as const;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const row = (label: string, value: string | undefined): [string, string][] => (value ? [[label, value]] : []);
/** "2027-03" → "March 2027" (the team reads English). */
const eventDate = (m: string) => (m ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${m}-01T00:00:00Z`)) : undefined);
type Shared = { locale: string; source: string; lead?: LeadSource | null };

export function composeMail(kind: "consultation", d: Consultation, s: Shared): Mail;
export function composeMail(kind: "websiteReview", d: WebsiteReview, s: Shared): Mail;
export function composeMail(kind: "interest", d: Interest, s: Shared): Mail;
export function composeMail(kind: "contact", d: Contact, s: Shared): Mail;
export function composeMail(kind: MailKind, d: Consultation | WebsiteReview | Interest | Contact, s: Shared): Mail {
  const locale = localeOf(s.locale);
  // The form's page and language, then where the visit came from (D110).
  const meta: [string, string][] = [...row("Page", s.source), ["Language", locale === "ar" ? "Arabic" : "English"], ...leadRows(s.lead ?? null)];
  switch (kind) {
    case "consultation": {
      const c = d as Consultation;
      return {
        kind, locale, visitorEmail: c.email, vars: { name: c.name },
        subject: `Intro call request: ${c.build}`,
        rows: [["Name", c.name], ["Email", c.email], ...row("Phone", c.phone), ...row("Company", c.company), ["Build", c.build], ["Timeline", c.timeline], ...row("Budget", c.budget), ...row("Tier", c.tier), ...row("Website", c.websiteUrl), ...row("Message", c.message), ...meta],
      };
    }
    case "websiteReview": {
      const w = d as WebsiteReview;
      return {
        kind, locale, visitorEmail: isEmail(w.contact) ? w.contact : undefined, vars: { name: w.name },
        subject: `[Website review] ${w.websiteUrl}`,
        rows: [["Website", w.websiteUrl], ["Name", w.name], ["Email or WhatsApp", w.contact], ["Main goal", w.goal], ...row("Message", w.message), ...meta],
      };
    }
    case "interest": {
      const i = d as Interest;
      const product = PRODUCT_NAMES[i.product];
      return {
        kind, locale, visitorEmail: i.email, vars: { name: i.name, product },
        subject: `Register interest: ${product}`,
        rows: [["Product", product], ["Name", i.name], ["Email", i.email], ...row("Runs", i.type), ...row("Company", i.company), ...row("Message", i.message), ...meta],
      };
    }
    case "contact": {
      const c = d as Contact;
      const service = c.service ? getServiceByAnchor(c.service)?.title.en : undefined;
      return {
        kind, locale, visitorEmail: c.email, vars: { name: c.name },
        subject: `Brief: ${service ?? "General"}`,
        rows: [["Name", c.name], ["Email", c.email], ...row("Phone", c.phone), ...row("Company", c.company), ...row("Service", service), ...row("Event date", eventDate(c.eventMonth)), ...row("Guests", c.guests ? GUEST_LABELS[c.guests] : undefined), ...row("City or country", c.city), ...row("Timing", c.timeline), ...row("Budget", c.budget), ["Message", c.message], ...meta],
      };
    }
  }
}

type SendPayload = { from: string; to: string[]; replyTo?: string; subject: string; html: string; text: string };
type Sender = (p: SendPayload) => Promise<{ ok: boolean }>;

const resendSender =
  (key: string): Sender =>
  async (p) => {
    const { error } = await new Resend(key).emails.send(p);
    return { ok: !error };
  };

export async function deliverMail(
  mail: Mail,
  { env = process.env, send, sinkDir = path.join(process.cwd(), "test-results", "mail") }: { env?: NodeJS.ProcessEnv; send?: Sender; sinkDir?: string } = {},
): Promise<FormState["status"]> {
  const team = createElement(TeamEmail, { title: mail.subject, rows: mail.rows });
  const teamText = mail.rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const c = autoReplyCopy;
  const reply = mail.visitorEmail
    ? { subject: fillMail(c.subject[mail.kind][mail.locale], mail.vars), element: createElement(AutoReply, { kind: mail.kind, locale: mail.locale, vars: mail.vars }) }
    : undefined;

  if (env.MAIL_SINK === "file") {
    mkdirSync(sinkDir, { recursive: true });
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    writeFileSync(path.join(sinkDir, `${stamp}-team.json`), JSON.stringify({ kind: mail.kind, subject: mail.subject, replyTo: mail.visitorEmail, text: teamText }));
    // Mirrors a real send: the auto-reply only once a verified sender is set.
    if (reply && env.MAIL_FROM) writeFileSync(path.join(sinkDir, `${stamp}-reply.json`), JSON.stringify({ kind: mail.kind, locale: mail.locale, subject: reply.subject, html: await render(reply.element) }));
    return "success";
  }

  const key = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error("forms: delivery is not configured");
    return "failed";
  }
  const sender = send ?? resendSender(key);
  const from = env.MAIL_FROM ? `NO TIME <${env.MAIL_FROM}>` : "NO TIME Website <onboarding@resend.dev>";
  try {
    const sent = await sender({ from, to: [to], replyTo: mail.visitorEmail, subject: mail.subject, html: await render(team), text: teamText });
    if (!sent.ok) {
      console.error(`forms: the team email failed (${mail.kind})`);
      return "failed";
    }
    // The auto-reply needs a verified sender; its failure never fails the submission.
    if (reply && env.MAIL_FROM) {
      await sender({ from, to: [mail.visitorEmail!], subject: reply.subject, html: await render(reply.element), text: await render(reply.element, { plainText: true }) }).catch(() => ({ ok: false }));
    }
    return "success";
  } catch {
    console.error(`forms: delivery threw (${mail.kind})`);
    return "failed";
  }
}
