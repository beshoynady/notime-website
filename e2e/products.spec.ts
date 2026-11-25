import { expect, test } from "@playwright/test";
import { asOwnClient } from "./helpers";

test.beforeEach(({ page }, info) => asOwnClient(page, info));

/** F4: each product page shows Coming soon, labelled previews, and a working "Register interest" (stub delivery). */
for (const locale of ["en", "ar"] as const) {
  test(`Invitely: status, preview label and the interest form's success state (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/products/invitely`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".pp-hero .badge-soon")).toBeVisible();
    await expect(page.locator(".pp-visual .sw-tag-fill")).toHaveText(locale === "en" ? "Preview" : "معاينة");
    expect(await page.locator(".pp-feature").count()).toBeGreaterThanOrEqual(4);

    const form = page.locator("#register form");
    await form.locator('input[name="name"]').fill("Test Person");
    await form.locator('input[name="email"]').fill("test@example.com");
    // The Turnstile test widget mounts near the viewport; submit once its token is in (D102).
    await page.waitForFunction(() => !!(document.querySelector('#register [name="cf-turnstile-response"]') as HTMLInputElement | null)?.value, null, { timeout: 15_000 });
    await form.locator('button[type="submit"]').click();
    await expect(page.locator("#register")).toContainText("Test Person");
    await expect(page.locator(".pp-other-link")).toHaveAttribute("href", `/${locale}/products/smart-menu`);
  });
}
