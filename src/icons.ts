import iconsLucide from "../data/icons/lucide.json";
import iconsIconoirRegular from "../data/icons/iconoir-regular.json";
import iconsIconoirSolid from "../data/icons/iconoir-solid.json";

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
];

export const defaultIconSetSettings: Record<string, IconSetSettings> =
  icons.reduce(
    (settings, { id }) => ({
      ...settings,
      [id]: { selectedVariant: "regular" },
    }),
    {},
  );
