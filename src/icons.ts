export type IconSet = {
  id: string;
  name: string;
  website: string;
  license: {
    name: string;
    url: string;
  };
  icons: IconSetVariants[];
};

type IconSetVariants = {
  variant: string;
  getIcons: () => Promise<Icons>;
};

export type Icons = Record<string, Icon>;

type Icon = {
  svg: {
    attributes: string;
    elements: string;
  };
};

type IconSetSettings = { selectedVariant: string };

export const icons: IconSet[] = [
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
  icons.reduce(
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
