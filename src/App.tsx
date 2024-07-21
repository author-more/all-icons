import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import { icons, Palette } from "lucide-react";
import IconButton from "./IconButton";
import { renderToHtml } from "./dom";
import SearchInput from "./SearchInput";
import GridList from "./GridList";
import ControlsBar from "./ControlsBar";
import { PenpotLibraryColor } from "@penpot/plugin-types";
import ColorSwatch from "./ColorSwatch";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [libraryColors, setLibraryColors] = useState<PenpotLibraryColor[]>([]);
  const [selectedIconColorId, setSelectedIconColorId] = useState<
    PenpotLibraryColor["id"] | null
  >(null);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);

  useEffect(() => {
    const handleMessage = ({
      data: { type, content },
    }: MessageEvent<PluginMessageEvent>) => {
      if (type === "theme") {
        setTheme(content);
      }

      if (type === "library-colors") {
        setLibraryColors(content);
      }
    };

    window.addEventListener("message", handleMessage);

    requestLibraryColors();
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
        content: {
          name,
          svg,
          colorId: selectedIconColorId,
        },
      },
      "*",
    );
  }

  function toggleColorSelector() {
    if (!isColorSelectorOpen) {
      requestLibraryColors();
    }

    setIsColorSelectorOpen(!isColorSelectorOpen);
  }

  function requestLibraryColors() {
    window.parent.postMessage({ type: "get-library-colors" }, "*");
  }

  const selectedIconColor =
    selectedIconColorId &&
    libraryColors.find(({ id }) => id === selectedIconColorId);

  return (
    <div className="app" data-theme={theme}>
      <ControlsBar>
        <SearchInput
          label="Search icon"
          placeholder="e.g. arrow"
          onChange={setSearchPhrase}
        />
        <IconButton
          label={
            isColorSelectorOpen ? "Close color selector" : "Open color selector"
          }
          onClick={toggleColorSelector}
        >
          <div className="icon-holder">
            <Palette size={20} />
            {selectedIconColor && (
              <div className="color-swatch-preview">
                <ColorSwatch color={selectedIconColor} size={12} />
              </div>
            )}
          </div>
        </IconButton>
      </ControlsBar>
      {isColorSelectorOpen && (
        <GridList
          items={libraryColors.map((color) => (
            <IconButton
              label={`Set default color to: ${color.name}`}
              onClick={() => setSelectedIconColorId(color.id)}
            >
              <ColorSwatch color={color} />
            </IconButton>
          ))}
        />
      )}
      <GridList
        items={iconList}
        emptyMessage={`No icons found for "${searchPhrase}"`}
      />
    </div>
  );
}

export default App;
