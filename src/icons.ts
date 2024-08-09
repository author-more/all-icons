import iconsLucide from "../data/icons/lucide.json";
import iconsIconoirRegular from "../data/icons/iconoir-regular.json";
import iconsIconoirSolid from "../data/icons/iconoir-solid.json";
import iconsPhosphorBold from "../data/icons/phosphor-bold.json";
import iconsPhosphorDuotone from "../data/icons/phosphor-duotone.json";
import iconsPhosphorFill from "../data/icons/phosphor-fill.json";
import iconsPhosphorLight from "../data/icons/phosphor-light.json";
import iconsPhosphorRegular from "../data/icons/phosphor-regular.json";
import iconsPhosphorThin from "../data/icons/phosphor-thin.json";

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
  icons: Icons;
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
    icons: [
      {
        variant: "regular",
        icons: iconsLucide,
      },
    ],
  },
  {
    id: "iconoir",
    name: "Iconoir",
    website: "https://iconoir.com",
    license: {
      name: "MIT",
      url: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
    },
    icons: [
      {
        variant: "regular",
        icons: iconsIconoirRegular,
      },
      {
        variant: "solid",
        icons: iconsIconoirSolid,
      },
    ],
  },
  {
    id: "phosphor",
    name: "Phosphor",
    website: "https://phosphoricons.com",
    license: {
      name: "MIT",
      url: "https://raw.githubusercontent.com/phosphor-icons/homepage/master/LICENSE",
    },
    icons: [
      {
        variant: "bold",
        icons: iconsPhosphorBold,
      },
      {
        variant: "duotone",
        icons: iconsPhosphorDuotone,
      },
      {
        variant: "fill",
        icons: iconsPhosphorFill,
      },
      {
        variant: "light",
        icons: iconsPhosphorLight,
      },
      {
        variant: "regular",
        icons: iconsPhosphorRegular,
      },
      {
        variant: "thin",
        icons: iconsPhosphorThin,
      },
    ],
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
