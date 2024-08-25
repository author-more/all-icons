import { test, expect } from "@playwright/test";
import { setUpEventLogging } from "./utils/events";

test.describe("app", () => {
  let eventLog: Awaited<ReturnType<typeof setUpEventLogging>>;

  test.beforeEach(async ({ page }) => {
    eventLog = await setUpEventLogging(page);

    await page.goto("/");
  });

  test("opens", async ({ page }) => {
    await expect(page).toHaveTitle(/All Icons/);
  });

  test("requests settings data", async ({ page }) => {
    await expect(page).toHaveTitle(/All Icons/);

    const event = eventLog.find(({ type }) => type === "get-plugin-data");
    expect(event).toEqual({
      type: "get-plugin-data",
      content: {
        scope: "iconSetsSettings",
      },
    });
  });

  test("lists multiple icon libraries", async ({ page }) => {
    for (const libraryName of ["Lucide", "Iconoir"]) {
      const title = page.getByRole("heading", { name: libraryName });
      await expect(title).toBeVisible();
    }

    const iconSetToggleButton = page.getByRole("button", {
      name: /Show Lucide icon set/,
    });
    await iconSetToggleButton.click();

    const iconButtons = page.getByRole("button", { name: /(Insert icon:).*/ });
    expect(await iconButtons.count()).toBeGreaterThan(1);
  });
});
