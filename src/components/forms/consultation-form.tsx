"use client";

import { useEffect, useState } from "react";
import { submitConsultation } from "@/app/actions/forms";
import { budgetBands } from "@/content/forms";
import { fill, formCopy } from "@/content/form-copy";
import type { Locale } from "@/content/types";
import { BUILD_OPTIONS, consultationSchema, TIMELINES, TIERS } from "@/lib/forms/schemas";
import { parsePrefill, type Prefill, type Tier } from "@/lib/prefill";
import { ChoiceChips, ErrorSummary, FormNotice, PrivacyNotice, SelectField, SharedFields, SubmitButton, SuccessPanel, TextField, TurnstileSlot } from "./form-parts";
import { onPrefill, pushPrefill } from "./prefill-store";
import { useContractForm } from "./use-contract-form";

const PREFIX = "consult";

/**
 * The free 30-min intro call (D92 `consultationSchema`): the project first (what, when, budget,
 * current site, a note), then the person. "What do you want to build?" comes first and carries
 * the opening's caret (the storyboard's bookend). A service or tier CTA presets build and tier,
 * from the URL (`?build=apps#consult`) or the prefill store.
 */
export function ConsultationForm(props: { locale: Locale; source: string; tierLabels: Record<Tier, string> }) {
  const [round, setRound] = useState(0);
  return <Inner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function Inner({ locale, source, tierLabels, onAgain }: { locale: Locale; source: string; tierLabels: Record<Tier, string>; onAgain: () => void }) {
  const c = formCopy.consultation;
  const f = formCopy.fields;
  const { form, state, pending, formAction, formRef, summaryRef, summary, onSubmit, sentName, codeOf } = useContractForm({
    schema: consultationSchema,
    action: submitConsultation,
    defaults: { build: null, timeline: null, tier: "", budget: "", websiteUrl: "", message: "", name: "", email: "", phone: "", company: "" },
  });
  const [prefilled, setPrefilled] = useState<string | null>(null);

  const apply = (p: Prefill) => {
    if (!p.build && !p.tier) return;
    if (p.build) form.setValue("build", p.build, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
    form.setValue("tier", p.tier ?? "", { shouldDirty: true });
    const parts = [p.build && c.buildOptions[p.build][locale], p.tier && `${c.tier[locale]}: ${tierLabels[p.tier]}`].filter(Boolean);
    setPrefilled(parts.join(" · "));
  };
  // Every CTA click, and the URL once (a shared or reloaded link), through the prefill store.
  useEffect(() => {
    const off = onPrefill(apply);
    const fromUrl = parsePrefill(window.location.search);
    if (fromUrl.build || fromUrl.tier) pushPrefill(fromUrl);
    return off;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === "success") {
    return <SuccessPanel title={fill(c.successTitle[locale], { name: sentName })} body={c.successBody[locale]} again={formCopy.states.another[locale]} onAgain={onAgain} />;
  }

  const reg = form.register;
  const labels: Record<string, string> = {
    build: c.build[locale],
    timeline: c.timeline[locale],
    budget: c.budget[locale],
    websiteUrl: f.websiteUrl[locale],
    tier: c.tier[locale],
    message: c.message[locale],
    name: f.name[locale],
    email: f.email[locale],
    phone: f.phone[locale],
    company: f.company[locale],
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="form" aria-describedby={`${PREFIX}-micro`}>
      <ErrorSummary items={summary} prefix={PREFIX} labels={labels} locale={locale} summaryRef={summaryRef} />
      <SharedFields locale={locale} source={source} />

      <fieldset className="form-group">
        <legend className="form-group-title">{c.project[locale]}</legend>
        <ChoiceChips
          prefix={PREFIX}
          name="build"
          legend={c.build[locale]}
          options={BUILD_OPTIONS.map((v) => ({ value: v, label: c.buildOptions[v][locale] }))}
          locale={locale}
          register={reg}
          code={codeOf("build")}
          caret
        />
        {prefilled && (
          <p className="form-prefilled" role="status">
            {fill(c.prefilled[locale], { choice: prefilled })}
          </p>
        )}
        <ChoiceChips
          prefix={PREFIX}
          name="timeline"
          legend={c.timeline[locale]}
          options={TIMELINES.map((v) => ({ value: v, label: c.timelineOptions[v][locale] }))}
          locale={locale}
          register={reg}
          code={codeOf("timeline")}
        />
        <div className="form-row">
          <SelectField
            prefix={PREFIX}
            name="tier"
            label={c.tier[locale]}
            placeholder={c.tierNone[locale]}
            options={TIERS.map((v) => ({ value: v, label: tierLabels[v] }))}
            locale={locale}
            register={reg}
            code={codeOf("tier")}
          />
          <SelectField
            prefix={PREFIX}
            name="budget"
            label={c.budget[locale]}
            placeholder={c.budgetNone[locale]}
            options={budgetBands.software.map((b) => ({ value: b.value, label: b.label[locale] }))}
            hint={c.budgetHint[locale]}
            locale={locale}
            register={reg}
            code={codeOf("budget")}
          />
        </div>
        <TextField
          prefix={PREFIX}
          name="websiteUrl"
          label={f.websiteUrl[locale]}
          hint={f.websiteUrlHint[locale]}
          type="url"
          inputMode="url"
          autoComplete="url"
          dir="ltr"
          optional
          locale={locale}
          register={reg}
          code={codeOf("websiteUrl")}
        />
        <TextField prefix={PREFIX} name="message" label={c.message[locale]} hint={c.messageHint[locale]} multiline optional locale={locale} register={reg} code={codeOf("message")} />
      </fieldset>

      <fieldset className="form-group">
        <legend className="form-group-title">{c.you[locale]}</legend>
        <div className="form-row">
          <TextField prefix={PREFIX} name="name" label={f.name[locale]} autoComplete="name" locale={locale} register={reg} code={codeOf("name")} />
          <TextField prefix={PREFIX} name="email" label={f.email[locale]} type="email" inputMode="email" autoComplete="email" dir="ltr" locale={locale} register={reg} code={codeOf("email")} />
        </div>
        <div className="form-row">
          <TextField prefix={PREFIX} name="phone" label={f.phone[locale]} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" optional locale={locale} register={reg} code={codeOf("phone")} />
          <TextField prefix={PREFIX} name="company" label={f.company[locale]} autoComplete="organization" optional locale={locale} register={reg} code={codeOf("company")} />
        </div>
      </fieldset>

      <TurnstileSlot />
      <FormNotice state={state} locale={locale} />
      <div className="form-actions">
        <SubmitButton label={c.submit[locale]} pending={pending} locale={locale} />
        <p id={`${PREFIX}-micro`} className="form-micro">
          {c.micro[locale]}
        </p>
      </div>
      <PrivacyNotice locale={locale} />
    </form>
  );
}
