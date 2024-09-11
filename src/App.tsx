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
  DATA_KEY_ICON_SETS_SETTINGS,
} from "./icons";
import Select from "./Select";
import LinkTag from "./LinkTag";
import { toSortedBy } from "./sort";
import { Bug, ChevronDown, ChevronRight, Lightbulb } from "lucide-react";
import { sendMessage } from "./window";

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");

  const [iconSets, setIconSets] = useState<
    Awaited<ReturnType<typeof getIconSetsByVariant>[0]>
  >([]);
  const [iconSetsSettings, setIconSetsSettings] = useState(
    defaultIconSetSettings,
  );

  const [hoveredIcon, setHoveredIcon] = useState<{
    name: string;
    library: {
      name: string;
      variant: string;
    };
  } | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PluginMessageEvent>) => {
      if (event.data.type === "theme") {
        setTheme(event.data.content);
      }

      if (event.data.type === "plugin-data") {
        const { scope, data } = event.data.content;

        if (scope === "iconSetsSettings") {
          setIconSetsSettings(data as typeof iconSetsSettings);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    sendMessage("get-plugin-data", {
      scope: DATA_KEY_ICON_SETS_SETTINGS,
    });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const [result, controller] = getIconSetsByVariant(
      iconLibraries,
      iconSetsSettings,
    );
    result
      .then((iconSets) => {
        const iconSetsSorted = toSortedBy<(typeof iconSets)[number]>(
          iconSets,
          "name",
        );
        setIconSets(iconSetsSorted);
      })
      .catch((error) => {
        console.error("Failed to load icons:", error);
      });

    return () => {
      controller.abort(
        "Icon sets' settings changed. Initiated loading with the new settings, aborted previous request.",
      );
    };
  }, [iconSetsSettings]);

  function generateIconList(
    icons: (typeof iconSets)[number]["icons"],
    {
      iconSettings: { svg: { attributes: customSvgAttributes = "" } = {} } = {},
      metadata,
    }: Pick<(typeof iconSets)[number], "iconSettings"> & {
      metadata: { library: { name: string; variant: string } };
    },
  ) {
    const { library } = metadata;

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
          const icon = (
            <Icon
              attributes={`${attributes} ${customSvgAttributes}`}
              elements={elements}
            />
          );

          return (
            <IconButton
              key={`icon-${name}`}
              label={`Insert icon: ${name}`}
              onClick={() => handleIconButtonClick(name, svg)}
              onMouseEnter={() => setHoveredIcon({ name, library })}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {icon}
            </IconButton>
          );
        },
      );
  }

  function handleIconButtonClick(name: string, svg: string) {
    sendMessage("insert-icon", { name, svg, size: DEFAULT_ICON_SIZE });
  }

  function toggleShowIcons(id: string) {
    updateSettings(id, { showIcons: !iconSetsSettings[id].showIcons });
  }

  const iconGrids = iconSets.map(
    ({ id, name, website, license, variantOptions, icons, iconSettings }) => {
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
              <div>
                <h1 className="title-s">{name}</h1>
                <ControlsBar>
                  <LinkTag href={website}>Website</LinkTag>
                  <LinkTag href={license.url}>
                    License: {license.name}
                    <sup>*</sup>
                  </LinkTag>
                </ControlsBar>
              </div>
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
              items={generateIconList(icons, {
                iconSettings,
                metadata: {
                  library: {
                    name,
                    variant: iconSetsSettings[id].selectedVariant,
                  },
                },
              })}
              emptyMessage={`No icons found for "${searchPhrase}" in ${name} library.`}
            />
          )}
        </>
      );
    },
  );

  const metaBreadcrumbs = [
    hoveredIcon?.library.name,
    hoveredIcon?.library.variant,
    hoveredIcon?.name,
  ]
    .filter(Boolean)
    .join(" > ");

  function updateSettings(
    id: string,
    settings: Partial<
      (typeof defaultIconSetSettings)[keyof typeof defaultIconSetSettings]
    >,
  ) {
    const settingsUpdated = {
      ...iconSetsSettings,
      [id]: {
        ...iconSetsSettings[id],
        ...settings,
      },
    };

    setIconSetsSettings(settingsUpdated);
    sendMessage("set-plugin-data", {
      scope: DATA_KEY_ICON_SETS_SETTINGS,
      data: settingsUpdated,
    });
  }

  return (
    <div className="app" data-theme={theme}>
      <ControlsBar stickTo={"top"} growFirstItem={true}>
        <SearchInput
          label="Search icon"
          placeholder="e.g. arrow"
          onChange={setSearchPhrase}
        />
      </ControlsBar>
      <ControlsBar stickTo={"bottom"} growFirstItem={true}>
        <p className="body-s">{metaBreadcrumbs || ""}</p>
        <div className="icon-menu">
          <a
            href="https://github.com/author-more/all-icons/issues"
            title="Report an issue"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Bug aria-hidden="true" size={16} />{" "}
            <span className="visually-hidden">Report an issue</span>
          </a>
          <a
            href="https://github.com/author-more/all-icons/discussions"
            title="Suggest a feature"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Lightbulb aria-hidden="true" size={16} />{" "}
            <span className="visually-hidden">Suggest a feature</span>
          </a>
        </div>
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
