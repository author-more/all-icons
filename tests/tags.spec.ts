import { test, expect } from "@playwright/test";

test.describe("tags", () => {
  test("website - should be a website link", async ({ page }) => {
    await page.goto("/");

    const titleBar = page
      .getByRole("heading", { name: "Lucide" })
      .locator("..");
    const websiteLink = titleBar.getByRole("link", { name: "Website" });

    expect(await websiteLink.getAttribute("href")).toBe("https://lucide.dev");
  });

  test("license - should be a license link", async ({ page }) => {
    await page.goto("/");

    const titleBar = page
      .getByRole("heading", { name: "Lucide" })
      .locator("..");
    const licenseLink = titleBar.getByRole("link", { name: /License.*/ });

    expect(await licenseLink.getAttribute("href")).toBe(
      "https://lucide.dev/license",
    );
  });
});
