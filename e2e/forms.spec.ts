import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { asOwnClient } from "./helpers";

test.beforeEach(({ page }, info) => asOwnClient(page, info));

/**
 * The brief on /contact (D102, Task 4.2). The server runs with Turnstile's always-pass test keys
 * MAIL_SINK=file and a test MAIL_FROM (playwright.config.ts, ci.yml), so a submission is real,
 * both emails are written, and nothing is sent.
 * Desktop project only: the form is the same at every width, and the sink is shared.
 */
const SINK = path.join(process.cwd(), "test-results", "mail");
const mails = () => (existsSync(SINK) ? readdirSync(SINK) : []);

test.describe.configure({ mode: "serial" });
test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "one run is enough"));
test.beforeAll(() => rmSync(SINK, { recursive: true, force: true }));

async function scrollToForm(page: Page) {
  await page.locator("#brief-message").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600); // the ground hands over to the form's section
}

async function fillValid(page: Page) {
  await page.fill("#brief-message", "A product launch for 300 guests in March.");
  await page.fill("#brief-name", "Test Visitor");
  await page.fill("#brief-email", "visitor@example.com");
}

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: a brief sends the team email and the auto-reply in the page's language`, async ({ page }) => {
    const before = mails().length;
    await page.goto(`/${locale}/contact?service=apps`);
    await scrollToForm(page);
    await expect(page.locator("#brief-service")).toHaveValue("apps");
    await fillValid(page);
    await page.waitForFunction(() => !!(document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
    await page.click(".ct-form .form-submit");
    await expect(page.locator(".form-success, [data-form-success]").first()).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => mails().length).toBe(before + 2); // the team email and the auto-reply
    const last = (end: string) => JSON.parse(readFileSync(path.join(SINK, mails().filter((f) => f.endsWith(end)).sort().at(-1)!), "utf8"));
    const team = last("team.json");
    expect(team.subject).toBe("Brief: Mobile apps");
    expect(team.replyTo).toBe("visitor@example.com");
    const reply = last("reply.json");
    expect(reply.locale).toBe(locale);
    expect(reply.html).toContain(`dir="${locale === "ar" ? "rtl" : "ltr"}"`);
  });
}

test("an empty submit lists the errors and focuses the summary; nothing is sent", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact");
  await scrollToForm(page);
  await page.click(".ct-form .form-submit");
  await expect(page.locator(".form-summary")).toBeFocused();
  await expect(page.locator("#brief-message")).toHaveAttribute("aria-invalid", "true");
  expect(mails().length).toBe(before);
});

test("the honeypot filled: looks accepted, sends nothing", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact");
  await scrollToForm(page);
  await fillValid(page);
  await page.evaluate(() => ((document.querySelector('[name="company_website"]') as HTMLInputElement).value = "spam.example"));
  await page.waitForFunction(() => !!(document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
  await page.click(".ct-form .form-submit");
  await page.waitForTimeout(2000);
  expect(mails().length).toBe(before);
});

for (const value of ["gifts-nope", "<script>alert(1)</script>"]) {
  test(`?service=${value} selects nothing and is never echoed`, async ({ page }) => {
    await page.goto(`/en/contact?service=${encodeURIComponent(value)}`);
    await scrollToForm(page);
    await expect(page.locator("#brief-service")).toHaveValue("");
    await expect(page.locator(".form-prefilled")).toHaveCount(0);
    expect(await page.content()).not.toContain("<script>alert(1)</script>");
  });
}

test("a focused brief field shows a 2 px line", async ({ page }) => {
  await page.goto("/en/contact");
  await scrollToForm(page);
  const field = page.locator("#brief-name");
  const box = async () => field.evaluate((el) => ({ w: getComputedStyle(el).borderBlockEndWidth, h: el.getBoundingClientRect().height }));
  const resting = await box();
  await field.focus();
  const focused = await box();
  expect(focused.w).toBe("2px");
  expect(focused.h).toBe(resting.h); // no layout shift
});

const eventLabel = (page: Page) => page.getByLabel("Event date (approximate)");
const guestsLabel = (page: Page) => page.getByLabel("Number of guests");

test("no service: the general timing shows", async ({ page }) => {
  await page.goto("/en/contact");
  await scrollToForm(page);
  await expect(page.getByText("When do you need it?")).toBeVisible();
  await expect(eventLabel(page)).toHaveCount(0);
  await expect(guestsLabel(page)).toHaveCount(0);
});

test("an events service shows the event fields; a marketing one hides and clears them", async ({ page }) => {
  await page.goto("/en/contact");
  await scrollToForm(page);
  await page.selectOption("#brief-service", "conferences");
  await expect(eventLabel(page)).toBeVisible();
  await expect(guestsLabel(page)).toBeVisible();
  await expect(page.getByText("When do you need it?")).toHaveCount(0);
  await guestsLabel(page).selectOption("50-150");
  await page.selectOption("#brief-service", "branding");
  await expect(eventLabel(page)).toHaveCount(0);
  await expect(page.getByText("When do you need it?")).toBeVisible();
  await page.selectOption("#brief-service", "conferences");
  await expect(guestsLabel(page)).toHaveValue("");
});

test("?category=events-hospitality opens the events group", async ({ page }) => {
  await page.goto("/en/contact?category=events-hospitality");
  await scrollToForm(page);
  await expect(eventLabel(page)).toBeVisible();
  await expect(page.locator("#brief-service optgroup").first()).toHaveAttribute("label", "Events & Hospitality");
});

test("?category=marketing-brand in Arabic moves that group first, with no event fields", async ({ page }) => {
  await page.goto("/ar/contact?category=marketing-brand");
  await scrollToForm(page);
  await expect(page.locator("#brief-service optgroup").first()).toHaveAttribute("label", "التسويق والعلامة التجارية");
  await expect(page.getByLabel("تاريخ المناسبة (تقريبًا)")).toHaveCount(0);
});

test("?service= wins over ?category=", async ({ page }) => {
  await page.goto("/en/contact?category=events-hospitality&service=branding");
  await scrollToForm(page);
  await expect(page.locator("#brief-service")).toHaveValue("branding");
  await expect(eventLabel(page)).toHaveCount(0);
});

test("an old ?service=print-store link still presets Print ordering (D123)", async ({ page }) => {
  await page.goto("/en/contact?service=print-store");
  await scrollToForm(page);
  await expect(page.locator("#brief-service")).toHaveValue("print-ordering");
  await expect(page.locator("#brief-service option:checked")).toHaveText("Print ordering");
});

test("?category=<junk> is ignored and never echoed", async ({ page }) => {
  await page.goto("/en/contact?category=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
  await scrollToForm(page);
  await expect(page.locator("#brief-service optgroup").first()).toHaveAttribute("label", "Events & Hospitality");
  await expect(eventLabel(page)).toHaveCount(0);
  expect(await page.content()).not.toContain("<script>alert(1)</script>");
});

test("the brief sends the event rows", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact?service=conferences");
  await scrollToForm(page);
  await eventLabel(page).selectOption({ index: 3 });
  await guestsLabel(page).selectOption("150-500");
  await fillValid(page);
  await page.waitForFunction(() => !!(document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
  await page.click(".ct-form .form-submit");
  await expect(page.locator(".form-success, [data-form-success]").first()).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => mails().length).toBe(before + 2);
  const team = JSON.parse(readFileSync(path.join(SINK, mails().filter((f) => f.endsWith("team.json")).sort().at(-1)!), "utf8"));
  expect(team.text).toContain("Event date: ");
  expect(team.text).toContain("Guests: 150–500");
});

test("a timing picked before an events service is cleared and not sent", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact");
  await scrollToForm(page);
  await page.locator(".form-chip", { hasText: "Within 3 months" }).click();
  await expect(page.getByLabel("Within 3 months")).toBeChecked();
  await page.selectOption("#brief-service", "conferences");
  await expect(page.getByText("When do you need it?")).toHaveCount(0);
  // Cleared, not kept: back on a non-events service the chip comes back unpicked.
  await page.selectOption("#brief-service", "branding");
  await expect(page.getByLabel("Within 3 months")).not.toBeChecked();
  await page.locator(".form-chip", { hasText: "Within 3 months" }).click();
  await page.selectOption("#brief-service", "conferences");
  await fillValid(page);
  await page.waitForFunction(() => !!(document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
  await page.click(".ct-form .form-submit");
  await expect(page.locator(".form-success, [data-form-success]").first()).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => mails().length).toBe(before + 2);
  const team = JSON.parse(readFileSync(path.join(SINK, mails().filter((f) => f.endsWith("team.json")).sort().at(-1)!), "utf8"));
  expect(team.text).toContain("Service: ");
  expect(team.text).not.toContain("Timing");
});

// D124: the phone field. The example shows from the start; a leading 0 asks for the country code.
test("the phone field shows its example, and a leading 0 asks for the country code", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact");
  await scrollToForm(page);
  await expect(page.locator("#brief-phone-hint")).toHaveText("For example, +971 50 123 4567");
  await fillValid(page);
  await page.fill("#brief-phone", "050 123 4567");
  await page.click(".ct-form .form-submit");
  await expect(page.locator("#brief-phone")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#brief-phone-error")).toHaveText("Include the country code, e.g. +971.");
  expect(mails().length).toBe(before);
});

test("a valid number is sent to the team in E.164", async ({ page }) => {
  const before = mails().length;
  await page.goto("/en/contact");
  await scrollToForm(page);
  await fillValid(page);
  await page.fill("#brief-phone", "00971 (50) 123-4567");
  await page.waitForFunction(() => !!(document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
  await page.click(".ct-form .form-submit");
  await expect(page.locator(".form-success, [data-form-success]").first()).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => mails().length).toBe(before + 2);
  const team = JSON.parse(readFileSync(path.join(SINK, mails().filter((f) => f.endsWith("team.json")).sort().at(-1)!), "utf8"));
  expect(team.text).toContain("Phone: +971501234567");
});
