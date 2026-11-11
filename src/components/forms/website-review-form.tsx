"use client";

import { useState } from "react";
import { submitWebsiteReview } from "@/app/actions/forms";
import { fill, formCopy } from "@/content/form-copy";
import type { Locale } from "@/content/types";
import { REVIEW_GOALS, websiteReviewSchema } from "@/lib/forms/schemas";
import { ChoiceChips, ErrorSummary, FormNotice, PrivacyNotice, SharedFields, SubmitButton, SuccessPanel, TextField, TurnstileSlot } from "./form-parts";
import { useContractForm } from "./use-contract-form";

const PREFIX = "review";

/** The free website review (D91, `websiteReviewSchema`): the site, a name, a way back, the goal. */
export function WebsiteReviewForm(props: { locale: Locale; source: string }) {
  const [round, setRound] = useState(0);
  return <Inner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function Inner({ locale, source, onAgain }: { locale: Locale; source: string; onAgain: () => void }) {
  const r = formCopy.review;
  const f = formCopy.fields;
  const { form, state, pending, formAction, formRef, summaryRef, summary, onSubmit, sentName, codeOf } = useContractForm({
    schema: websiteReviewSchema,
    action: submitWebsiteReview,
    defaults: { websiteUrl: "", name: "", contact: "", goal: null, message: "" },
  });

  if (state.status === "success") {
    return <SuccessPanel title={fill(r.successTitle[locale], { name: sentName })} body={r.successBody[locale]} again={formCopy.states.another[locale]} onAgain={onAgain} />;
  }

  const reg = form.register;
  const labels = { websiteUrl: r.websiteUrl[locale], name: f.name[locale], contact: r.contact[locale], goal: r.goal[locale], message: r.message[locale] };
  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="form form-compact">
      <ErrorSummary items={summary} prefix={PREFIX} labels={labels} locale={locale} summaryRef={summaryRef} />
      <SharedFields locale={locale} source={source} />
      <TextField
        prefix={PREFIX}
        name="websiteUrl"
        label={r.websiteUrl[locale]}
        hint={f.websiteUrlHint[locale]}
        type="url"
        inputMode="url"
        autoComplete="url"
        dir="ltr"
        locale={locale}
        register={reg}
        code={codeOf("websiteUrl")}
      />
      <div className="form-row">
        <TextField prefix={PREFIX} name="name" label={f.name[locale]} autoComplete="name" locale={locale} register={reg} code={codeOf("name")} />
        <TextField prefix={PREFIX} name="contact" label={r.contact[locale]} autoComplete="email" dir="ltr" locale={locale} register={reg} code={codeOf("contact")} />
      </div>
      <ChoiceChips
        prefix={PREFIX}
        name="goal"
        legend={r.goal[locale]}
        options={REVIEW_GOALS.map((v) => ({ value: v, label: r.goalOptions[v][locale] }))}
        locale={locale}
        register={reg}
        code={codeOf("goal")}
      />
      <TextField prefix={PREFIX} name="message" label={r.message[locale]} multiline optional locale={locale} register={reg} code={codeOf("message")} />
      <TurnstileSlot />
      <FormNotice state={state} locale={locale} />
      <div className="form-actions">
        <SubmitButton label={r.submit[locale]} pending={pending} locale={locale} />
      </div>
      <PrivacyNotice locale={locale} />
    </form>
  );
}
