import { Page } from "@playwright/test";

type PluginUIEvent = {
  type: string;
  content: Record<string, unknown>;
};

export async function setUpEventLogging(page: Page) {
  const eventLog: PluginUIEvent[] = [];

  await page.exposeFunction("logEvent", (data: PluginUIEvent) =>
    eventLog.push(data),
  );
  await page.addInitScript(() => {
    // @ts-expect-error - TS doesn't know about logCall method.
    const mockPostMessage = (data: PluginUIEvent) => logEvent(data);
    window.parent.postMessage = mockPostMessage;
  });

  return eventLog;
}
