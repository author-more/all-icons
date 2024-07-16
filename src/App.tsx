import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import { icons } from "lucide-react";
import IconButton from "./IconButton";
import { renderToHtml } from "./dom";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PluginMessageEvent>) => {
      if (event.data.type === "theme") {
        setTheme(event.data.content);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const iconList = Object.entries(icons).map(([name, Icon]) => {
    return (
      <IconButton
        label={`Insert icon: ${name}`}
        onClick={() => handleIconButtonClick(name, renderToHtml(Icon))}
      >
        <Icon />
      </IconButton>
    );
  });

  function handleIconButtonClick(name: string, svg: string) {
    window.parent.postMessage(
      {
        type: "insert-icon",
        content: { name, svg },
      },
      "*",
    );
  }

  return (
    <div data-theme={theme}>
      <div className="icon-list">{iconList}</div>
    </div>
  );
}

export default App;
