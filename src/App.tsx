import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import IconButton from "./IconButton";
import Icon from "./Icon";
import SearchInput from "./SearchInput";
import GridList from "./GridList";
import ControlsBar from "./ControlsBar";
import { Icons, icons, defaultIconSetSettings } from "./icons";
import Select from "./Select";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");

  const [iconSetsSettings, setIconSetsSettings] = useState(
    defaultIconSetSettings,
  );

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

  const iconLists = icons.map(({ id, name, icons }) => {
    const selectedVariant = iconSetsSettings[id].selectedVariant;
    const iconsByVariant =
      icons.find(({ variant }) => variant === selectedVariant)?.icons || {};
    const variantOptions = icons.map(({ variant }) => ({
      label: variant,
      value: variant,
    }));

    return {
      id,
      title: name,
      variantOptions,
      icons: getIconList(iconsByVariant),
    };
  });

  function getIconList(icons: Icons) {
    return Object.entries(icons)
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
  }

  function handleIconButtonClick(name: string, svg: string) {
    window.parent.postMessage(
      {
        type: "insert-icon",
        content: { name, svg },
      },
      "*",
    );
  }

  const iconGrids = iconLists.map(({ id, title, variantOptions, icons }) => {
    const hasMultipleVariants = variantOptions.length > 1;

    return (
      <>
        <ControlsBar>
          <h2>{title}</h2>
          {hasMultipleVariants && (
            <Select
              label="Variant"
              options={variantOptions}
              onChange={(event) =>
                updateSettings(id, { selectedVariant: event.target.value })
              }
            />
          )}
        </ControlsBar>
        <GridList
          items={icons}
          emptyMessage={`No icons found for "${searchPhrase}"`}
        />
      </>
    );
  });

  function updateSettings(
    id: string,
    settings: (typeof defaultIconSetSettings)[keyof typeof defaultIconSetSettings],
  ) {
    setIconSetsSettings((currentSettings) => ({
      ...currentSettings,
      [id]: {
        ...currentSettings[id],
        ...settings,
      },
    }));
  }

  return (
    <div className="app" data-theme={theme}>
      <ControlsBar isSticky={true}>
        <SearchInput
          label="Search icon"
          placeholder="e.g. arrow"
          onChange={setSearchPhrase}
        />
      </ControlsBar>
      {iconGrids}
    </div>
  );
}

export default App;
