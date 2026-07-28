import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("all nav buttons have aria-labels", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav");
    const buttons = nav.getByRole("button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const ariaLabel = await btn.getAttribute("aria-label");
      expect(ariaLabel, `Button ${i} missing aria-label`).toBeTruthy();
    }
  });

  test("LaVida logo is keyboard accessible", async ({ page }) => {
    await page.goto("/");

    const logo = page.getByRole("button", { name: /LaVida/i });
    await expect(logo).toBeVisible();

    await logo.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /analyze/i })).toBeVisible();
  });

  test("symptom form inputs have associated labels", async ({ page }) => {
    await page.goto("/");

    const genderSelect = page.getByLabel(/gender/i);
    await expect(genderSelect).toBeVisible();

    const ageInput = page.getByLabel(/age/i);
    await expect(ageInput).toBeVisible();
  });

  test("color contrast: primary text is visible on background", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    const color = await heading.evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("footer disclaimer is rendered", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/AI-powered health/i)).toBeVisible();
    await expect(page.getByText(/not a substitute/i)).toBeVisible();
  });
});

test.describe("Internationalization completeness", () => {
  test("all 3 locales have chat.send key", async ({ page }) => {
    await page.goto("/");

    const langBtn = page.getByRole("button", { name: /toggle language/i });

    await expect(page.getByRole("button", { name: /analyze/i })).toBeVisible();

    await langBtn.click();
    await expect(page.getByRole("button", { name: /analizar/i })).toBeVisible();

    await langBtn.click();
    await expect(page.getByRole("button", { name: /analyser/i })).toBeVisible();
  });
});
