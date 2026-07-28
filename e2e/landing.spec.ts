import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders the LaVida brand and sign-in button", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text=LaVida").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("theme toggle and language toggle are accessible", async ({ page }) => {
    await page.goto("/");

    const themeBtn = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeBtn).toBeVisible();

    const langBtn = page.getByRole("button", { name: /toggle language/i });
    await expect(langBtn).toBeVisible();
  });

  test("language toggle switches between EN/ES/FR", async ({ page }) => {
    await page.goto("/");

    const langBtn = page.getByRole("button", { name: /toggle language/i });
    await langBtn.click();
    await expect(page.locator("text=Alternar idioma")).toBeVisible();

    await langBtn.click();
    await expect(page.locator("text=Changer de langue")).toBeVisible();

    await langBtn.click();
    await expect(page.locator("text=Toggle language")).toBeVisible();
  });

  test("symptom form renders with gender, age, and symptoms inputs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByLabel(/gender/i)).toBeVisible();
    await expect(page.getByPlaceholder(/age/i)).toBeVisible();
    await expect(page.getByPlaceholder(/symptom/i)).toBeVisible();
  });

  test("symptom form validates empty submission", async ({ page }) => {
    await page.goto("/");

    const submitBtn = page.getByRole("button", { name: /analyze/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await expect(page.getByText(/enter.*symptom/i)).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("clicking the LaVida logo triggers restart", async ({ page }) => {
    await page.goto("/");

    const logo = page.getByRole("button", { name: /LaVida/i });
    await expect(logo).toBeVisible();
    await logo.click();

    await expect(page.getByRole("button", { name: /analyze/i })).toBeVisible();
  });
});

test.describe("Dashboard (unauthenticated redirect)", () => {
  test("redirects to home when not logged in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/", { timeout: 10_000 });
    await expect(page).toHaveURL("/");
  });
});

test.describe("Medications (unauthenticated redirect)", () => {
  test("redirects to home when not logged in", async ({ page }) => {
    await page.goto("/medications");
    await page.waitForURL("/", { timeout: 10_000 });
    await expect(page).toHaveURL("/");
  });
});
