import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

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
