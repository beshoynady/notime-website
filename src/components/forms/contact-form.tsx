"use client";

import { useEffect, useMemo, useState } from "react";
import { submitContact } from "@/app/actions/forms";
import { budgetBands } from "@/content/forms";
import { fill, formCopy } from "@/content/form-copy";
import type { CategorySlug, Locale } from "@/content/types";
import { parseCategoryParam } from "@/lib/forms/category-param";
import { currentAnchor } from "@/lib/legacy-anchors";
import { eventFieldsVisible, monthOptions } from "@/lib/forms/event-visibility";
import { contactSchema, GUEST_BANDS, TIMELINES } from "@/lib/forms/schemas";
import { ChoiceChips, ErrorSummary, FormNotice, PrivacyNotice, SelectField, SharedFields, SubmitButton, SuccessPanel, TextField, TurnstileSlot } from "./form-parts";
import { useContractForm } from "./use-contract-form";

const PREFIX = "brief";

/**
 * A service the brief offers: its anchor, its title, its category, whether it's software (for the
 * bands) and whether it's an Events one (for the event date and guests). Computed on the server,
 * so this client file stays off the `@/content` barrel.
 */
export type BriefService = { value: string; label: string; software: boolean; events: boolean; category: CategorySlug };
/** A category as the service select's group: its slug and its title in the page's language. */
export type BriefCategory = { slug: CategorySlug; title: string };

/**
 * The brief on /contact (D102, `contactSchema`): the project first (service, timing, place,
 * budget, a few lines), then the person. `?service=<anchor>` presets the service once, only when
 * it names one of the offered services (Review Focus 4: anything else selects nothing and is
 * never echoed). `?category=<slug>` (N10) moves that group first and, with no service chosen, opens
 * the event fields for Events & Hospitality; it is never written to a field. The budget bands follow the service: software bands for a software service.
 */
export function ContactForm(props: { locale: Locale; services: BriefService[]; categories: BriefCategory[] }) {
  const [round, setRound] = useState(0);
  return <Inner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function Inner({ locale, services, categories, onAgain }: { locale: Locale; services: BriefService[]; categories: BriefCategory[]; onAgain: () => void }) {
  const c = formCopy.contact;
  const f = formCopy.fields;
  const t = formCopy.consultation;
  const { form, state, pending, formAction, formRef, summaryRef, summary, onSubmit, sentName, codeOf, maxOf } = useContractForm({
    schema: contactSchema,
    action: submitContact,
    defaults: { service: "", timeline: "", eventMonth: "", guests: "", budget: "", city: "", message: "", name: "", email: "", phone: "", company: "" },
  });
  const [prefilled, setPrefilled] = useState<string | null>(null);
  const [category, setCategory] = useState<CategorySlug | "">("");
  // The current date is read after hydration (a prerendered page must not bake in "now").
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const hint = parseCategoryParam(new URLSearchParams(window.location.search).get("category"));
    // The URL is only readable after hydration, so the hint is read here, once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    if (hint) setCategory(hint);
    const v = new URLSearchParams(window.location.search).get("service");
    const hit = v ? services.find((s) => s.value === currentAnchor(v)) : undefined;
    if (!hit) return;
    form.setValue("service", hit.value, { shouldDirty: true });
    // The URL is only readable after hydration (the page is prerendered), so this one-time sync runs here.
    setPrefilled(hit.label);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const serviceValue = String(form.watch("service") ?? "");
  const chosen = services.find((s) => s.value === serviceValue);
  const showEvent = eventFieldsVisible({ service: serviceValue, serviceIsEvents: !!chosen?.events, category });
  // Hidden fields are cleared, so a stale value is never posted or validated: the event fields
  // when they hide, the general timing ("When is it?") when the event fields take its place.
  useEffect(() => {
    if (showEvent) {
      form.setValue("timeline", "");
      return;
    }
    form.setValue("eventMonth", "");
    form.setValue("guests", "");
  }, [showEvent, form]);
  const months = useMemo(() => (now ? monthOptions(now, locale) : []), [now, locale]);
  // The category titles are the select's groups, in order; a valid hint moves its group first.
  const groups = (category ? [...categories].sort((a, b) => Number(b.slug === category) - Number(a.slug === category)) : categories)
    .map((g) => ({ label: g.title, options: services.filter((s) => s.category === g.slug).map(({ value, label }) => ({ value, label })) }))
    .filter((g) => g.options.length > 0);
  const bands = chosen?.software ? budgetBands.software : budgetBands.events;
  // A band from the other list no longer fits: clear it when the service changes family.
  useEffect(() => {
    const b = form.getValues("budget");
    if (b && !bands.some((x) => x.value === b)) form.setValue("budget", "");
  }, [bands, form]);

  if (state.status === "success") {
    return <SuccessPanel title={fill(c.successTitle[locale], { name: sentName })} body={c.successBody[locale]} again={formCopy.states.another[locale]} onAgain={onAgain} />;
  }

  const reg = form.register;
  const labels: Record<string, string> = {
    service: c.service[locale],
    timeline: c.timeline[locale],
    eventMonth: c.eventMonth[locale],
    guests: c.guests[locale],
    city: c.city[locale],
    budget: t.budget[locale],
    message: c.message[locale],
    name: f.name[locale],
    email: f.email[locale],
    phone: f.phone[locale],
    company: f.company[locale],
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="form" aria-describedby={`${PREFIX}-micro`}>
      <ErrorSummary items={summary} prefix={PREFIX} labels={labels} locale={locale} summaryRef={summaryRef} />
      <SharedFields locale={locale} source="contact" />

      <fieldset className="form-group">
        <legend className="form-group-title">{c.project[locale]}</legend>
        <SelectField
          prefix={PREFIX}
          name="service"
          label={c.service[locale]}
          placeholder={c.serviceNone[locale]}
          groups={groups}
          locale={locale}
          register={reg}
          code={codeOf("service")}
        />
        {prefilled && (
          <p className="form-prefilled" role="status">
            {fill(c.prefilled[locale], { choice: prefilled })}
          </p>
        )}
        {showEvent ? (
          <div className="form-row">
            <SelectField
              prefix={PREFIX}
              name="eventMonth"
              label={c.eventMonth[locale]}
              placeholder={c.eventMonthNone[locale]}
              options={months}
              locale={locale}
              register={reg}
              code={codeOf("eventMonth")}
            />
            <SelectField
              prefix={PREFIX}
              name="guests"
              label={c.guests[locale]}
              placeholder={c.guestsNone[locale]}
              options={GUEST_BANDS.map((v) => ({ value: v, label: c.guestOptions[v][locale] }))}
              locale={locale}
              register={reg}
              code={codeOf("guests")}
            />
          </div>
        ) : (
          <ChoiceChips
            prefix={PREFIX}
            name="timeline"
            legend={c.timeline[locale]}
            options={TIMELINES.map((v) => ({ value: v, label: t.timelineOptions[v][locale] }))}
            locale={locale}
            register={reg}
            code={codeOf("timeline")}
            optional
          />
        )}
        <div className="form-row">
          <TextField prefix={PREFIX} name="city" label={c.city[locale]} hint={c.cityHint[locale]} autoComplete="address-level2" optional locale={locale} register={reg} code={codeOf("city")} max={maxOf("city")} />
          <SelectField
            prefix={PREFIX}
            name="budget"
            label={t.budget[locale]}
            placeholder={t.budgetNone[locale]}
            options={bands.map((b) => ({ value: b.value, label: b.label[locale] }))}
            hint={t.budgetHint[locale]}
            locale={locale}
            register={reg}
            code={codeOf("budget")}
          />
        </div>
        <TextField prefix={PREFIX} name="message" label={c.message[locale]} hint={c.messageHint[locale]} multiline locale={locale} register={reg} code={codeOf("message")} max={maxOf("message")} />
      </fieldset>

      <fieldset className="form-group">
        <legend className="form-group-title">{c.you[locale]}</legend>
        <div className="form-row">
          <TextField prefix={PREFIX} name="name" label={f.name[locale]} autoComplete="name" locale={locale} register={reg} code={codeOf("name")} max={maxOf("name")} />
          <TextField prefix={PREFIX} name="email" label={f.email[locale]} type="email" inputMode="email" autoComplete="email" dir="ltr" locale={locale} register={reg} code={codeOf("email")} />
        </div>
        <div className="form-row">
          <TextField prefix={PREFIX} name="phone" label={f.phone[locale]} hint={f.phoneHint[locale]} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" optional locale={locale} register={reg} code={codeOf("phone")} />
          <TextField prefix={PREFIX} name="company" label={f.company[locale]} autoComplete="organization" optional locale={locale} register={reg} code={codeOf("company")} max={maxOf("company")} />
        </div>
      </fieldset>

      <TurnstileSlot state={state} locale={locale} />
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
