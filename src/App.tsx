import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import { icons } from "lucide-react";
import IconButton from "./IconButton";
import { renderToHtml } from "./dom";
import SearchInput from "./SearchInput";
import GridList from "./GridList";
import ControlsBar from "./ControlsBar";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");

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

  const iconList = Object.entries(icons)
    .filter(([name]) => {
      return name.toLowerCase().includes(searchPhrase.toLowerCase());
    })
    .map(([name, Icon]) => {
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
    <div className="app" data-theme={theme}>
      <ControlsBar>
        <SearchInput
          label="Search icon"
          placeholder="e.g. arrow"
          onChange={setSearchPhrase}
        />
      </ControlsBar>
      <GridList
        items={iconList}
        emptyMessage={`No icons found for "${searchPhrase}"`}
      />
    </div>
  );
}

export default App;
