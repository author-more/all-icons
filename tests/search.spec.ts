import { test, expect } from "@playwright/test";

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has phrase input", async ({ page }) => {
    const input = page.getByLabel("Search icon");
    await expect(input).toBeVisible();
  });

  test("filters icons by phrase", async ({ page }) => {
    const iconButtons = page.getByRole("button", { name: /(Insert icon:).*/ });

    expect(await iconButtons.count()).toBeGreaterThan(1);

    const input = page.getByLabel("Search icon");
    await input.fill("pickaxe");

    expect(await iconButtons.count()).toEqual(1);
    expect(await iconButtons.textContent()).toContain("Insert icon: pickaxe");
  });
});