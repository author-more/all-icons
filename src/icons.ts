import iconsLucide from "../data/icons/lucide.json";
import iconsIconoirRegular from "../data/icons/iconoir-regular.json";
import iconsIconoirSolid from "../data/icons/iconoir-solid.json";

export type IconSet = {
  id: string;
  name: string;
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
