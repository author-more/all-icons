import { Theme } from "@penpot/plugin-types";

export type PluginMessageEvent = ThemePluginEvent | DataPluginEvent;

type ThemePluginEvent = {
  type: "theme";
  content: Theme;
};

type DataPluginEvent = {
  type: "plugin-data";
  content: PluginData;
};

type PluginUIEvent =
  | InsertIconPluginEvent
  | SetDataPluginEvent
  | GetDataPluginEvent;

type InsertIconPluginEvent = {
  type: "insert-icon";
  content: {
    name: string;
    svg: string;
    size: IconSize;
  };
};

type IconSize = { width: number; height: number };

type SetDataPluginEvent = {
  type: "set-plugin-data";
  content: PluginData;
};

type GetDataPluginEvent = {
  type: "get-plugin-data";
  content: Pick<PluginData, "scope">;
};

type PluginData = {
  scope: string;
  data: unknown;
};

penpot.ui.open("All Icons", `?theme=${penpot.theme}`, {
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

  if (type === "set-plugin-data") {
    setPluginData(content.scope, content.data);
  }

  if (type === "get-plugin-data") {
    getPluginData(content.scope);
  }
});

function insertIcon({
  name,
  svg,
  size: { width, height },
}: {
  name: string;
  svg: string;
  size: IconSize;
}) {
  const icon = penpot.createShapeFromSvg(svg);
  if (icon) {
    icon.name = name;
    icon.x = penpot.viewport.center.x;
    icon.y = penpot.viewport.center.y;
    icon.resize(width, height);
  }
}

function setPluginData(key: string, data: unknown) {
  penpot.currentPage?.setPluginData(key, JSON.stringify(data));
}

function getPluginData(key: string) {
  const data = penpot.currentPage?.getPluginData(key);
  if (!data || data === "null" || data === "") {
    return;
  }

  sendMessage({
    type: "plugin-data",
    content: { scope: key, data: JSON.parse(data) },
  });
}
