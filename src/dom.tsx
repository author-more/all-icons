import { ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code
export function renderToHtml(Component: ComponentType) {
  const host = document.createElement("div");
  const root = createRoot(host);
  flushSync(() => {
    root.render(<Component />);
  });

  return host.innerHTML;
}
