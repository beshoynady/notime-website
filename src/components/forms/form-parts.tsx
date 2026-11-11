"use client";

import { AlertCircle, Check } from "lucide-react";
import { useEffect, useRef, type HTMLInputTypeAttribute, type ReactNode, type RefObject } from "react";
import type { UseFormRegister } from "react-hook-form";
import { contact } from "@/config/contact";
import { errorMessages, fill, formCopy, requiredMessages } from "@/content/form-copy";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { HONEYPOT, TURNSTILE_FIELD, type FieldErrorCode, type FormState } from "@/lib/forms/schemas";
import { cn } from "@/lib/utils";
import type { SummaryItem } from "./use-contract-form";
import "./forms.css";

type Register = UseFormRegister<Record<string, unknown>>;

/** The sentence for a field's error code, in the page's language. */
export function errorText(name: string, code: FieldErrorCode, locale: Locale): string {
  return (code === "required" && requiredMessages[name]?.[locale]) || (errorMessages[code] ?? errorMessages.invalid)[locale];
}

const optionalTag = (locale: Locale) => <span className="form-optional"> ({formCopy.optional[locale]})</span>;

/** Ids for a field's control, hint and error, so the summary and aria-describedby agree. */
export const fieldId = (prefix: string, name: string) => `${prefix}-${name}`;

export function TextField({
  prefix,
  name,
  label,
  locale,
  register,
  code,
  optional = false,
  hint,
  type = "text",
  inputMode,
  autoComplete,
  multiline = false,
  dir,
  caret = false,
}: {
  prefix: string;
  name: string;
  label: string;
  locale: Locale;
  register: Register;
  code?: FieldErrorCode;
  optional?: boolean;
  hint?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  multiline?: boolean;
  /** Addresses and numbers read left to right in Arabic too. */
  dir?: "ltr";
  /** The page's bookend: the opening's caret blinks in this field until it's used. */
  caret?: boolean;
}) {
  const id = fieldId(prefix, name);
  const described = [hint && `${id}-hint`, code && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    className: cn("field-control form-control", dir && "form-ltr"),
    "aria-invalid": code ? (true as const) : undefined,
    "aria-describedby": described,
    "aria-required": optional ? undefined : (true as const),
    dir,
    ...register(name),
  };
  return (
    <div className={cn("field form-field", code && "field-error", caret && "form-caret")}>
      <label htmlFor={id}>
        {label}
        {optional && optionalTag(locale)}
      </label>
      {multiline ? <textarea rows={3} {...common} /> : <input type={type} inputMode={inputMode} autoComplete={autoComplete} {...common} />}
      {hint && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {code && <FieldError id={`${id}-error`}>{errorText(name, code, locale)}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="form-error">
      <AlertCircle aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      {children}
    </span>
  );
}

/** A radio group drawn as chips (fewer than ~8 options: one tap, no dropdown). */
export function ChoiceChips({
  prefix,
  name,
  legend,
  options,
  locale,
  register,
  code,
  optional = false,
  caret = false,
}: {
  prefix: string;
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  locale: Locale;
  register: Register;
  code?: FieldErrorCode;
  optional?: boolean;
  caret?: boolean;
}) {
  const id = fieldId(prefix, name);
  return (
    <fieldset
      id={id}
      className={cn("form-field form-chips", code && "field-error", caret && "form-caret")}
      aria-describedby={code ? `${id}-error` : undefined}
      aria-invalid={code ? true : undefined}
      aria-required={optional ? undefined : true}
    >
      <legend className="form-legend">
        {legend}
        {optional && optionalTag(locale)}
      </legend>
      <div className="form-chip-row">
        {options.map((o) => (
          <label key={o.value} className="form-chip">
            <input type="radio" value={o.value} id={`${id}-${o.value}`} {...register(name)} />
            <span className="form-chip-face">
              <Check aria-hidden="true" strokeWidth={1.75} className="form-chip-tick size-3.5" />
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {code && <FieldError id={`${id}-error`}>{errorText(name, code, locale)}</FieldError>}
    </fieldset>
  );
}

export function SelectField({
  prefix,
  name,
  label,
  options,
  placeholder,
  locale,
  register,
  code,
  optional = true,
  hint,
}: {
  prefix: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
  locale: Locale;
  register: Register;
  code?: FieldErrorCode;
  optional?: boolean;
  hint?: string;
}) {
  const id = fieldId(prefix, name);
  const described = [hint && `${id}-hint`, code && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("field form-field", code && "field-error")}>
      <label htmlFor={id}>
        {label}
        {optional && optionalTag(locale)}
      </label>
      <select id={id} className="field-control form-control form-select" aria-invalid={code ? true : undefined} aria-describedby={described} {...register(name)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {code && <FieldError id={`${id}-error`}>{errorText(name, code, locale)}</FieldError>}
    </div>
  );
}

/**
 * The error summary: focused after a failed submit, one link per field (it focuses the control).
 * Inline errors stay under each field.
 */
export function ErrorSummary({
  items,
  prefix,
  labels,
  locale,
  summaryRef,
}: {
  items: SummaryItem[];
  prefix: string;
  labels: Record<string, string>;
  locale: Locale;
  summaryRef: RefObject<HTMLDivElement | null>;
}) {
  const titleId = `${prefix}-errors-title`;
  return (
    <div ref={summaryRef} tabIndex={-1} className="form-summary" aria-labelledby={titleId} hidden={items.length === 0}>
      <p id={titleId} className="form-summary-title">
        <AlertCircle aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
        {formCopy.summaryTitle[locale]}
      </p>
      <ul>
        {items.map((it) => {
          const target = fieldId(prefix, it.name);
          return (
            <li key={it.name}>
              <a
                href={`#${target}`}
                onClick={(e) => {
                  const box = document.getElementById(target);
                  const control = box?.matches("input, select, textarea") ? box : box?.querySelector<HTMLElement>("input:checked, input, select, textarea");
                  if (!control) return;
                  e.preventDefault();
                  control.focus();
                  control.scrollIntoView({ block: "center" });
                }}
              >
                <b>{labels[it.name] ?? it.name}:</b> {errorText(it.name, it.code, locale)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Server states other than success and invalid, each with the email fallback (contact.ts). */
export function FormNotice({ state, locale }: { state: FormState; locale: Locale }) {
  const s = state.status;
  const message =
    s === "rateLimited"
      ? formCopy.states.rateLimited[locale]
      : s === "blocked"
        ? formCopy.states.blocked[locale]
        : s === "failed"
          ? formCopy.states.failed[locale]
          : null;
  // A failed send disables the button while pending, which drops focus to <body>: bring it here (WCAG 2.4.3).
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) ref.current?.focus();
  }, [state, message]);
  return (
    <div ref={ref} tabIndex={-1} className="form-notice" role="alert" hidden={!message}>
      {message && <EmailSentence text={fill(message, { minutes: Math.max(1, Math.ceil((state.retryAfter ?? 60) / 60)) })} />}
    </div>
  );
}

/** Renders `{email}` as a mailto link. */
function EmailSentence({ text }: { text: string }) {
  const [before, after = ""] = text.split("{email}");
  return (
    <p>
      {before}
      <a href={`mailto:${contact.email}`} className="form-mail" dir="ltr">
        {contact.email}
      </a>
      {after}
    </p>
  );
}

export function PrivacyNotice({ locale }: { locale: Locale }) {
  return (
    <p className="form-privacy">
      {formCopy.privacy.text[locale]}{" "}
      <Link href="/privacy" className="form-privacy-link">
        {formCopy.privacy.link[locale]}
      </Link>
    </p>
  );
}

/** The fields every action reads first (D92): locale, source and the honeypot. */
export function SharedFields({ locale, source }: { locale: Locale; source: string }) {
  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: off-screen and hidden from assistive tech; people never reach it (D92). */}
      <div className="form-hp" aria-hidden="true">
        <label>
          {formCopy.honeypot[locale]}
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  );
}

/**
 * TODO: replace placeholder — step 5 (Task 4.2) renders Cloudflare's Turnstile widget here; it
 * posts its token as `TURNSTILE_FIELD`. Nothing renders until then.
 */
export function TurnstileSlot() {
  return <div className="form-turnstile" data-turnstile-slot={TURNSTILE_FIELD} hidden />;
}

export function SubmitButton({ label, pending, locale }: { label: string; pending: boolean; locale: Locale }) {
  return (
    <button type="submit" className="form-submit" aria-disabled={pending || undefined} disabled={pending}>
      <span>{pending ? formCopy.sending[locale] : label}</span>
    </button>
  );
}

/** The success state replaces the form; it takes focus so the confirmation is read. */
export function SuccessPanel({ title, body, again, onAgain }: { title: string; body: string; again: string; onAgain: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} className="form-success" role="status">
      <span className="form-success-mark" aria-hidden="true">
        <Check strokeWidth={1.5} className="size-5" />
      </span>
      <p className="form-success-title">{title}</p>
      <p className="form-success-body">{body}</p>
      <button type="button" className="form-again" onClick={onAgain}>
        {again}
      </button>
    </div>
  );
}
