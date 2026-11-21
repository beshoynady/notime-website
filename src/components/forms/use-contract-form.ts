"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type { z } from "zod";
import { readLeadSource } from "@/components/providers/lead-source-capture";
import { fieldMax } from "@/lib/forms/field-max";
import { IDLE, type FieldErrorCode, type FormState } from "@/lib/forms/schemas";
import { LEAD_FIELD } from "@/lib/lead-source";

type Values = Record<string, unknown>;
export type SummaryItem = { name: string; code: FieldErrorCode; max?: number };

const asCode = (m: unknown): FieldErrorCode => (typeof m === "string" ? (m as FieldErrorCode) : "invalid");

/**
 * The glue between react-hook-form (client validation with the contract's own Zod schema, D92)
 * and the Server Action (`useActionState`). Without JS the `<form action>` posts natively; with
 * JS the submit is validated first, then the FormData goes to the same action.
 *
 * A failed submit (client or server) fills the error summary in DOM order and moves focus to it
 * (WCAG 3.3.1; the summary links each field). Fields validate on blur, then on change.
 */
export function useContractForm({
  schema,
  action,
  defaults,
}: {
  schema: z.ZodType;
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  defaults: Values;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  const form = useForm<Values>({
    resolver: zodResolver(schema as never) as unknown as Resolver<Values>,
    mode: "onTouched",
    // The error summary takes focus (its links reach each field); RHF would move it to the first field after.
    shouldFocusError: false,
    defaultValues: defaults,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<{ items: SummaryItem[]; at: number }>({ items: [], at: 0 });
  const [sentName, setSentName] = useState("");

  /** `defaults` lists the fields in the order they appear in the form, so the summary reads top to bottom. */
  const names = Object.keys(defaults);
  const items = (codes: Record<string, FieldErrorCode | undefined>) =>
    Object.entries(codes)
      .filter((e): e is [string, FieldErrorCode] => !!e[1])
      .sort(([a], [b]) => (names.indexOf(a) + 1 || 999) - (names.indexOf(b) + 1 || 999))
      .map(([name, code]) => ({ name, code, max: fieldMax(schema, name) }));
  const toSummary = (codes: Record<string, FieldErrorCode | undefined>) => setSummary((s) => ({ items: items(codes), at: s.at + 1 }));

  // The server's answer reaches the summary during render (React's "adjust state on change" pattern)…
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    if (state.status === "invalid" && state.errors) setSummary({ items: items(state.errors), at: summary.at + 1 });
  }
  // …and its field codes reach react-hook-form after it (an external store).
  useEffect(() => {
    if (state.status !== "invalid" || !state.errors) return;
    for (const [name, code] of Object.entries(state.errors)) if (code) form.setError(name, { type: "server", message: code });
  }, [state, form]);

  const onInvalid = (errors: FieldErrors<Values>) => {
    toSummary(Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, asCode(v?.message)])));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    void form.handleSubmit(() => {
      setSummary((s) => ({ items: [], at: s.at }));
      setSentName(String(form.getValues("name") ?? "").trim());
      // Where the visit came from (D110, sessionStorage only); absent without JS or storage.
      const data = new FormData(el);
      const lead = readLeadSource();
      if (lead) data.set(LEAD_FIELD, lead);
      startTransition(() => formAction(data));
    }, onInvalid)(e);
  };

  // Live: the summary follows the fields as they're fixed (it never re-takes focus).
  const errors = form.formState.errors;
  const live = summary.items.filter((it) => errors[it.name]);

  // Focus the summary once per failed submit, as soon as it shows (a server answer's codes reach
  // the fields one render later); never again on blur or as fields are fixed.
  const focused = useRef(0);
  const ready = live.length ? summary.at : 0;
  useEffect(() => {
    if (!ready || focused.current === ready) return;
    focused.current = ready;
    summaryRef.current?.focus();
  }, [ready]);

  return { form, state, pending, formAction, formRef, summaryRef, summary: live, onSubmit, sentName, codeOf: (n: string) => (errors[n] ? asCode(errors[n]?.message) : undefined), maxOf: (n: string) => fieldMax(schema, n) };
}
