import { test, expect } from "@playwright/test";
import { setUpEventLogging } from "./utils/events";

test.describe("settings", () => {
  test("save on icon grid's visibility change", async ({ page }) => {
    const eventLog = await setUpEventLogging(page);

    await page.goto("/");

    const iconSetToggleButton = page.getByRole("button", {
      name: /Show Lucide icon set/,
    });
    await iconSetToggleButton.click();

    const event = eventLog.filter(({ type }) => type === "set-plugin-data");
    expect(event[0]).toMatchObject({
      type: "set-plugin-data",
      content: {
        scope: "iconSetsSettings",
        data: {
          lucide: {
            selectedVariant: "regular",
            showIcons: true,
          },
        },
      },
    });
  });

  test("save on icon set's style change", async ({ page }) => {
    const eventLog = await setUpEventLogging(page);

    await page.goto("/");

    const iconSetToggleButton = page.getByRole("button", {
      name: /Show Iconoir icon set/,
    });
    await iconSetToggleButton.click();

    const changeStyleSelect = page.getByLabel("Variant");
    await changeStyleSelect.selectOption({ label: "solid" });

    const event = eventLog.filter(({ type }) => type === "set-plugin-data");
    expect(event[1]).toMatchObject({
      type: "set-plugin-data",
      content: {
        scope: "iconSetsSettings",
        data: {
          iconoir: {
            selectedVariant: "solid",
            showIcons: true,
          },
        },
      },
    });
  });
});
