import { isFulfilled } from "./promise";

export const DEFAULT_ICON_SIZE = 24;

type IconLibrary = {
  id: string;
  name: string;
  website: string;
  license: {
    name: string;
    url: string;
  };
  icons: IconSetVariant[];
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

type IconSetSettings = { selectedVariant: string };

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
];

export const defaultIconSetSettings: Record<string, IconSetSettings> =
  iconLibraries.reduce(
    (settings, { id }) => ({
      ...settings,
      [id]: { selectedVariant: "regular" },
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

export async function getIconSetsByVariant(
  iconSets: IconLibrary[],
  iconSetsSettings: Record<string, IconSetSettings>,
): Promise<IconSet[]> {
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

  return results.filter(isFulfilled).map(({ value }) => value);
}

export function getVariantOptions(icons: IconSetVariant[]) {
  return icons.map(({ variant }) => ({
    label: variant,
    value: variant,
  }));
}
