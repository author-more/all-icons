import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import IconButton from "./IconButton";
import Icon from "./Icon";
import SearchInput from "./SearchInput";
import GridList from "./GridList";
import ControlsBar from "./ControlsBar";

import lucideIcons from "../data/icons/lucide.json";

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

  const iconList = Object.entries(lucideIcons)
    .filter(([name]) => {
      return name.toLowerCase().includes(searchPhrase.toLowerCase());
    })
    .map(
      ([
        name,
        {
          svg: { attributes, elements },
        },
      ]) => {
        const svg = `<svg ${attributes}>${elements}</svg>`;
        const icon = <Icon attributes={attributes} elements={elements} />;

        return (
          <IconButton
            label={`Insert icon: ${name}`}
            onClick={() => handleIconButtonClick(name, svg)}
          >
            {icon}
          </IconButton>
        );
      },
    );

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
