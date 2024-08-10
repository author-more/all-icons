import { PenpotTheme } from "@penpot/plugin-types";

export type PluginMessageEvent = ThemePluginEvent;

type ThemePluginEvent = {
  type: "theme";
  content: PenpotTheme;
};

type PluginUIEvent = InsertIconPluginEvent;

type InsertIconPluginEvent = {
  type: "insert-icon";
  content: {
    name: string;
    svg: string;
    size: number;
  };
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

penpot.ui.onMessage<PluginUIEvent>(({ type, content }) => {
  if (type === "insert-icon") {
    insertIcon(content);
  }
});

function insertIcon({
  name,
  svg,
  size,
}: {
  name: string;
  svg: string;
  size: number;
}) {
  const icon = penpot.createShapeFromSvg(svg);
  if (icon) {
    icon.name = name;
    icon.x = penpot.viewport.center.x;
    icon.y = penpot.viewport.center.y;
    icon.resize(size, size);
  }
}
