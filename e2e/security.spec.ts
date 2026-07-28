import { test, expect } from "@playwright/test";

test.describe("Security headers", () => {
  test("response includes Content-Security-Policy", async ({ request }) => {
    const response = await request.get("/");
    const csp = response.headers()["content-security-policy"];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test("response includes X-Content-Type-Options", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("response includes X-Frame-Options", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("response includes Strict-Transport-Security", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["strict-transport-security"]).toContain("max-age=63072000");
  });

  test("response includes Permissions-Policy blocking camera/mic/geo", async ({ request }) => {
    const response = await request.get("/");
    const pp = response.headers()["permissions-policy"];
    expect(pp).toContain("camera=()");
    expect(pp).toContain("microphone=()");
    expect(pp).toContain("geolocation=()");
  });
});

test.describe("Performance", () => {
  test("landing page loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test("no console errors on landing page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
});
