import { PenpotLibraryColor, PenpotTheme } from "@penpot/plugin-types";

export type PluginMessageEvent = ThemePluginEvent | LibraryColorsPluginEvent;

type ThemePluginEvent = {
  type: "theme";
  content: PenpotTheme;
};

type LibraryColorsPluginEvent = {
  type: "library-colors";
  content: PenpotLibraryColor[];
};

type PluginUIEvent = InsertIconPluginEvent | GetLibraryColorsPluginEvent;

type InsertIconPluginEvent = {
  type: "insert-icon";
  content: {
    name: string;
    svg: string;
    colorId: PenpotLibraryColor["id"] | null;
  };
};

type GetLibraryColorsPluginEvent = {
  type: "get-library-colors";
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

penpot.ui.onMessage<PluginUIEvent>((message) => {
  if (isInsertIconMessage(message)) {
    insertIcon(message.content);
  }

  if (message.type === "get-library-colors") {
    sendMessage({
      type: "library-colors",
      content: penpot.library.local.colors,
    });
  }
});

function insertIcon({ name, svg, colorId }: InsertIconPluginEvent["content"]) {
  const icon = penpot.createShapeFromSvg(svg);
  if (icon) {
    icon.name = name;
    icon.x = penpot.viewport.center.x;
    icon.y = penpot.viewport.center.y;

    const color =
      colorId && penpot.library.local.colors.find(({ id }) => id === colorId);
    if (color) {
      const iconColor = penpot.shapesColors([icon]);
      penpot.replaceColor([icon], iconColor[0], color);
    }
  }
}

function isInsertIconMessage(
  message: PluginUIEvent,
): message is InsertIconPluginEvent {
  return message.type === "insert-icon";
}
