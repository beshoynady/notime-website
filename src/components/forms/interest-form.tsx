"use client";

import { useState } from "react";
import { submitInterest } from "@/app/actions/forms";
import { fill, formCopy } from "@/content/form-copy";
import type { Locale } from "@/content/types";
import { interestSchema, type PRODUCTS } from "@/lib/forms/schemas";
import { ErrorSummary, FormNotice, PrivacyNotice, SharedFields, SubmitButton, SuccessPanel, TextField, TurnstileSlot } from "./form-parts";
import { useContractForm } from "./use-contract-form";

type ProductId = (typeof PRODUCTS)[number];

/**
 * Register interest in one product (D92 `interestSchema`). The product rides along as a hidden
 * field. The storyboard's event/restaurant type select isn't in the contract: visitors say it in
 * the optional note (logged in docs/review/batch2-software.md).
 */
export function InterestForm(props: { locale: Locale; source: string; product: ProductId; productName: string }) {
  const [round, setRound] = useState(0);
  return <Inner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function Inner({ locale, source, product, productName, onAgain }: { locale: Locale; source: string; product: ProductId; productName: string; onAgain: () => void }) {
  const i = formCopy.interest;
  const f = formCopy.fields;
  const prefix = `interest-${product}`;
  const { form, state, pending, formAction, formRef, summaryRef, summary, onSubmit, sentName, codeOf } = useContractForm({
    schema: interestSchema,
    action: submitInterest,
    defaults: { product, name: "", email: "", company: "", message: "" },
  });

  if (state.status === "success") {
    return (
      <SuccessPanel
        title={fill(i.successTitle[locale], { name: sentName, product: productName })}
        body={i.successBody[locale]}
        again={formCopy.states.another[locale]}
        onAgain={onAgain}
      />
    );
  }

  const reg = form.register;
  const labels = { name: f.name[locale], email: f.email[locale], company: f.company[locale], message: i.message[locale] };
  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="form form-compact">
      <ErrorSummary items={summary} prefix={prefix} labels={labels} locale={locale} summaryRef={summaryRef} />
      <SharedFields locale={locale} source={source} />
      <input type="hidden" value={product} {...reg("product")} />
      <div className="form-row">
        <TextField prefix={prefix} name="name" label={f.name[locale]} autoComplete="name" locale={locale} register={reg} code={codeOf("name")} />
        <TextField prefix={prefix} name="email" label={f.email[locale]} type="email" inputMode="email" autoComplete="email" dir="ltr" locale={locale} register={reg} code={codeOf("email")} />
      </div>
      <TextField prefix={prefix} name="company" label={f.company[locale]} autoComplete="organization" optional locale={locale} register={reg} code={codeOf("company")} />
      <TextField prefix={prefix} name="message" label={i.message[locale]} multiline optional locale={locale} register={reg} code={codeOf("message")} />
      <TurnstileSlot />
      <FormNotice state={state} locale={locale} />
      <div className="form-actions">
        <SubmitButton label={i.submit[locale]} pending={pending} locale={locale} />
      </div>
      <PrivacyNotice locale={locale} />
    </form>
  );
}
