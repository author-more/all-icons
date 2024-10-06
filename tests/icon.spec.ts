import { test, expect } from "@playwright/test";
import { setUpEventLogging } from "./utils/events";

const testIcons = [
  {
    name: "a-arrow-down",
    svg: '<svg class="lucide lucide-a-arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 13h6" /> <path d="m2 16 4.5-9 4.5 9" /> <path d="M18 7v9" /> <path d="m14 12 4 4 4-4" /></svg>',
    size: {
      width: 24,
      height: 24,
    },
  },
  {
    name: "pickaxe",
    svg: '<svg class="lucide lucide-pickaxe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" /> <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393" /> <path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z" /> <path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319" /></svg>',
    size: {
      width: 24,
      height: 24,
    },
  },
];

test.describe("icon", () => {
  test("inserts an icon into a project", async ({ page }) => {
    const eventLog = await setUpEventLogging(page);

    await page.goto("/");

    const iconSetToggleButton = page.getByRole("button", {
      name: /Show Lucide icon set/,
    });
    await iconSetToggleButton.click();

    const iconButton = page.getByRole("button", {
      name: `Insert icon: ${testIcons[0].name}`,
    });
    await iconButton.click();

    const event = eventLog.find(({ type }) => type === "insert-icon");
    expect(event).toEqual({
      type: "insert-icon",
      content: testIcons[0],
    });
  });

  test("on hover displays the icon name and library details in the status bar", async ({
    page,
  }) => {
    await page.goto("/");

    const iconSetToggleButton = page.getByRole("button", {
      name: /Show Lucide icon set/,
    });
    await iconSetToggleButton.click();

    for (const { name } of testIcons) {
      const iconButton = page.getByRole("button", {
        name: `Insert icon: ${name}`,
      });
      await iconButton.hover();

      const statusByText = page.getByText(`Lucide > regular > ${name}`);
      await expect(statusByText).toBeInViewport();
    }
  });
});
