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
import LinkTag from "./LinkTag";
import { toSortedBy } from "./sort";
import { isFulfilled } from "./promise";

type IconList = {
  id: string;
  title: string;
  website: string;
  license: {
    name: string;
    url: string;
  };
  variantOptions: { label: string; value: string }[];
  icons: JSX.Element[];
};

function App() {
  const url = new URL(window.location.href);
  const initialTheme = url.searchParams.get("theme");

  const [theme, setTheme] = useState(initialTheme || null);
  const [searchPhrase, setSearchPhrase] = useState("");

  const [iconLists, setIconLists] = useState<IconList[]>([]);
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
    Promise.allSettled(
      toSortedBy<(typeof icons)[number]>(icons, "name").map(
        async ({ id, name, website, license, icons }) => {
          const selectedVariant = iconSetsSettings[id].selectedVariant;
          const getIconsForVariant = icons.find(
            ({ variant }) => variant === selectedVariant,
          )?.getIcons;
          const variantOptions = icons.map(({ variant }) => ({
            label: variant,
            value: variant,
          }));

          return {
            id,
            title: name,
            website,
            license,
            variantOptions,
            icons: getIconsForVariant
              ? getIconList(await getIconsForVariant())
              : [],
          };
        },
      ),
    )
      .then((results) => {
        const iconLists = results.filter(isFulfilled).map(({ value }) => value);
        setIconLists(iconLists);
      })
      .catch((error) => {
        console.error("Failed to load icons", error);
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
  }, [iconSetsSettings, searchPhrase]);

  function handleIconButtonClick(name: string, svg: string) {
    window.parent.postMessage(
      {
        type: "insert-icon",
        content: { name, svg },
      },
      "*",
    );
  }

  const iconGrids = iconLists.map(
    ({ id, title, website, license, variantOptions, icons }) => {
      const hasMultipleVariants = variantOptions.length > 1;

      return (
        <>
          <ControlsBar growFirstItem={true}>
            <ControlsBar>
              <h1 className="title-m">{title}</h1>
              <LinkTag href={website}>Website</LinkTag>
              <LinkTag href={license.url}>
                License: {license.name}
                <sup>*</sup>
              </LinkTag>
            </ControlsBar>
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
            emptyMessage={`No icons found for "${searchPhrase}" in ${title} library.`}
          />
        </>
      );
    },
  );

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
