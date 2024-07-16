import { PenpotTheme } from "@penpot/plugin-types";

export type PluginMessageEvent = ThemePluginEvent;

type ThemePluginEvent = {
  type: "theme";
  content: PenpotTheme;
};

penpot.ui.open("All Icons", `?theme=${penpot.getTheme()}`, {
  width: 500,
  height: 600,
});

penpot.on("themechange", (theme) => {
  sendMessage({ type: "theme", content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}
