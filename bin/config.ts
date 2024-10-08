type IconPackage = {
  id: string;
  variant?: string;
  iconsDir: string;
  getVariantFromIconName?: (iconName: string) => string;
  normaliseAttributes?: (svg: string) => string;
};

export const iconPackages: IconPackage[] = [
  {
    id: "lucide",
    variant: "regular",
    iconsDir: "../node_modules/lucide-static/icons",
  },
  ...["regular", "solid"].map((variant) => ({
    id: `iconoir`,
    variant,
    iconsDir: `../node_modules/iconoir/icons/${variant}`,
  })),
  ...["bold", "duotone", "fill", "light", "regular", "thin"].map((variant) => ({
    id: `phosphor`,
    variant,
    iconsDir: `../node_modules/@phosphor-icons/core/assets/${variant}`,
  })),
  ...["filled", "outlined", "round", "sharp", "two-tone"].map((variant) => ({
    id: `material-design`,
    variant,
    iconsDir: `../node_modules/@material-design-icons/svg/${variant}`,
  })),
  {
    id: "bootstrap",
    getVariantFromIconName: (iconName: string) => {
      if (iconName.endsWith("fill")) return "fill";
      return "regular";
    },
    iconsDir: "../node_modules/bootstrap-icons/icons",
  },
  ...[
    ["outline", "24/outline"],
    ["solid", "24/solid"],
    ["mini", "20/solid"],
    ["micro", "16/solid"],
  ].map(([variant, path]) => ({
    id: `heroicons`,
    variant,
    iconsDir: `../node_modules/heroicons/${path}`,
  })),
  {
    id: "remixicon",
    getVariantFromIconName: (iconName: string) => {
      if (iconName.endsWith("fill")) return "fill";
      return "regular";
    },
    iconsDir: "../node_modules/remixicon/icons",
  },
  {
    id: "feather",
    variant: "regular",
    iconsDir: "../node_modules/feather-icons/dist/icons",
  },
  ...["free", "flag"].map((variant) => ({
    id: `core-ui`,
    variant,
    iconsDir: `../node_modules/@coreui/icons/svg/${variant}`,
    normaliseAttributes: (svg: string) =>
      svg.replace(/fill="var\(--ci-primary-color, currentColor\)"/g, ""),
  })),
  ...["outline", "filled"].map((variant) => ({
    id: `tabler`,
    variant,
    iconsDir: `../node_modules/@tabler/icons/icons/${variant}`,
  })),
];
