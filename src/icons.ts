import { isFulfilled } from "./promise";

export const DEFAULT_ICON_SIZE = 24;
export const DATA_KEY_ICON_SETS_SETTINGS = "iconSetsSettings";

type IconLibrary = {
  id: string;
  name: string;
  website: string;
  license: {
    name: string;
    url: string;
  };
  icons: IconSetVariant[];
  iconSettings?: {
    svg?: {
      attributes?: string;
    };
  };
  defaultSettings?: Partial<IconSetSettings>;
};

type IconSet = Omit<IconLibrary, "icons"> & {
  variantOptions: ReturnType<typeof getVariantOptions>;
  icons: Icons;
};

type IconSetVariant = {
  variant: string;
  getIcons: () => Promise<Icons>;
};

type Icons = Record<string, Icon>;

type Icon = {
  svg: {
    attributes: string;
    elements: string;
  };
};

type IconSetSettings = { selectedVariant: string; showIcons: boolean };

export const iconLibraries: IconLibrary[] = [
  {
    id: "lucide",
    name: "Lucide",
    website: "https://lucide.dev",
    license: {
      name: "ISC",
      url: "https://lucide.dev/license",
    },
    icons: generateVariants("lucide", ["regular"]),
  },
  {
    id: "iconoir",
    name: "Iconoir",
    website: "https://iconoir.com",
    license: {
      name: "MIT",
      url: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
    },
    icons: generateVariants("iconoir", ["regular", "solid"]),
  },
  {
    id: "phosphor",
    name: "Phosphor",
    website: "https://phosphoricons.com",
    license: {
      name: "MIT",
      url: "https://raw.githubusercontent.com/phosphor-icons/homepage/master/LICENSE",
    },
    icons: generateVariants("phosphor", [
      "bold",
      "duotone",
      "fill",
      "light",
      "regular",
      "thin",
    ]),
  },
  {
    id: "material-design",
    name: "Material Design",
    website: "https://fonts.google.com/icons",
    license: {
      name: "Apache-2.0",
      url: "https://github.com/google/material-design-icons/blob/master/LICENSE",
    },
    icons: generateVariants("material-design", [
      "filled",
      "outlined",
      "round",
      "sharp",
      "two-tone",
    ]),
    iconSettings: {
      svg: {
        attributes: 'fill="currentColor"',
      },
    },
    defaultSettings: { selectedVariant: "outlined" },
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    website: "https://icons.getbootstrap.com/",
    license: {
      name: "MIT",
      url: "https://github.com/twbs/icons/blob/main/LICENSE",
    },
    icons: generateVariants("bootstrap", ["regular", "fill"]),
  },
  {
    id: "heroicons",
    name: "Heroicons",
    website: "https://heroicons.com",
    license: {
      name: "MIT",
      url: "https://github.com/tailwindlabs/heroicons/blob/master/LICENSE",
    },
    icons: generateVariants("heroicons", ["outline", "solid", "mini", "micro"]),
  },
  {
    id: "remixicon",
    name: "Remix Icon",
    website: "https://remixicon.com/",
    license: {
      name: "Apache-2.0",
      url: "https://github.com/Remix-Design/remixicon/blob/master/License",
    },
    icons: generateVariants("remixicon", ["regular", "fill"]),
  },
  {
    id: "feather",
    name: "Feather",
    website: "https://feathericons.com/",
    license: {
      name: "MIT",
      url: "https://github.com/feathericons/feather/blob/main/LICENSE",
    },
    icons: generateVariants("feather", ["regular"]),
  },
];

export const defaultIconSetSettings: Record<string, IconSetSettings> =
  iconLibraries.reduce(
    (settings, { id, defaultSettings }) => ({
      ...settings,
      [id]: {
        selectedVariant: "regular",
        showIcons: false,
        ...defaultSettings,
      },
    }),
    {},
  );

function generateVariants(iconSetId: string, variants: string[]) {
  return variants.map((variant) => ({
    variant,
    getIcons: () => loadIcons(`${iconSetId}-${variant}`),
  }));
}

async function loadIcons(fileName: string) {
  const iconsModule = (await import(`../data/icons/${fileName}.json`)) as {
    default: Icons;
  };
  return iconsModule.default;
}

export function getIconSetsByVariant(
  iconSets: IconLibrary[],
  iconSetsSettings: Record<string, IconSetSettings>,
): [Promise<IconSet[]>, AbortController] {
  const abortController = new AbortController();
  const { signal } = abortController;

  const getIconSets = async function () {
    const results = await Promise.allSettled(
      iconSets.map(async (iconSet) => {
        const { icons, id } = iconSet;
        const selectedVariant = iconSetsSettings[id].selectedVariant;
        const getIconsForVariant = icons.find(
          ({ variant }) => variant === selectedVariant,
        )?.getIcons;

        return {
          ...iconSet,
          variantOptions: getVariantOptions(icons),
          icons: getIconsForVariant ? await getIconsForVariant() : {},
        };
      }),
    );

    signal.throwIfAborted();
    return results.filter(isFulfilled).map(({ value }) => value);
  };

  return [getIconSets(), abortController];
}

export function getVariantOptions(icons: IconSetVariant[]) {
  return icons.map(({ variant }) => ({
    label: variant,
    value: variant,
  }));
}
