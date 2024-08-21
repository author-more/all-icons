import { useEffect, useState } from "react";
import "./App.css";
import { PluginMessageEvent } from "./plugin";
import IconButton from "./IconButton";
import Icon from "./Icon";
import SearchInput from "./SearchInput";
import GridList from "./GridList";
import ControlsBar from "./ControlsBar";
import {
  iconLibraries,
  defaultIconSetSettings,
  getIconSetsByVariant,
  DEFAULT_ICON_SIZE,
} from "./icons";
import Select from "./Select";
import LinkTag from "./LinkTag";
import { toSortedBy } from "./sort";
import { ChevronDown, ChevronRight } from "lucide-react";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");

  const [iconSets, setIconSets] = useState<
    Awaited<ReturnType<typeof getIconSetsByVariant>>
  >([]);
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

  useEffect(() => {
    getIconSetsByVariant(iconLibraries, iconSetsSettings)
      .then((iconSets) => {
        const iconSetsSorted = toSortedBy<(typeof iconSets)[number]>(
          iconSets,
          "name",
        );
        setIconSets(iconSetsSorted);
      })
      .catch((error) => {
        console.error("Failed to load icons", error);
      });
  }, [iconSetsSettings]);

  function generateIconList(icons: (typeof iconSets)[number]["icons"]) {
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
              key={`icon-${name}`}
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
        content: { name, svg, size: DEFAULT_ICON_SIZE },
      },
      "*",
    );
  }

  function toggleShowIcons(id: string) {
    updateSettings(id, { showIcons: !iconSetsSettings[id].showIcons });
  }

  const iconGrids = iconSets.map(
    ({ id, name, website, license, variantOptions, icons }) => {
      const hasMultipleVariants = variantOptions.length > 1;
      const { showIcons: shouldShowIcons } = iconSetsSettings[id];

      return (
        <>
          <ControlsBar growFirstItem={true}>
            <ControlsBar>
              <IconButton
                label={`${shouldShowIcons ? "Hide" : "Show"} ${name} icon set`}
                onClick={() => toggleShowIcons(id)}
                size="compact"
              >
                {shouldShowIcons ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </IconButton>
              <h1 className="title-m">{name}</h1>
              <LinkTag href={website}>Website</LinkTag>
              <LinkTag href={license.url}>
                License: {license.name}
                <sup>*</sup>
              </LinkTag>
            </ControlsBar>
            {shouldShowIcons && hasMultipleVariants && (
              <Select
                label="Variant"
                options={variantOptions}
                value={iconSetsSettings[id].selectedVariant}
                onChange={(event) =>
                  updateSettings(id, {
                    selectedVariant: event.target.value,
                  })
                }
              />
            )}
          </ControlsBar>
          {shouldShowIcons && (
            <GridList
              items={generateIconList(icons)}
              emptyMessage={`No icons found for "${searchPhrase}" in ${name} library.`}
            />
          )}
        </>
      );
    },
  );

  function updateSettings(
    id: string,
    settings: Partial<
      (typeof defaultIconSetSettings)[keyof typeof defaultIconSetSettings]
    >,
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
      <ControlsBar stickToTop={true} growFirstItem={true}>
        <SearchInput
          label="Search icon"
          placeholder="e.g. arrow"
          onChange={setSearchPhrase}
        />
      </ControlsBar>
      {iconGrids}
      <p className="caption">
        <sup>*</sup>Information about license is provided for informational
        purposes only, in the best effort manner. Always check the official
        source before using the icons.
      </p>
    </div>
  );
}

export default App;
