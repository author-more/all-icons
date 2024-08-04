import { test, expect } from "@playwright/test";

test.describe("app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens", async ({ page }) => {
    await expect(page).toHaveTitle(/All Icons/);
  });

  test("lists icons from multiple libraries", async ({ page }) => {
    for (const libraryName of ["Lucide", "Iconoir"]) {
      const title = page.getByRole("heading", { name: libraryName });
      await expect(title).toBeVisible();
    }

    const iconButtons = page.getByRole("button", { name: /(Insert icon:).*/ });
    expect(await iconButtons.count()).toBeGreaterThan(1);
  });
});
