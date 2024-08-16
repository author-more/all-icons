export const iconPackages = [
  {
    id: "lucide-regular",
    iconsDir: "../node_modules/lucide-static/icons",
  },
  ...["regular", "solid"].map((variant) => ({
    id: `iconoir-${variant}`,
    iconsDir: `../node_modules/iconoir/icons/${variant}`,
  })),
  ...["bold", "duotone", "fill", "light", "regular", "thin"].map((variant) => ({
    id: `phosphor-${variant}`,
    iconsDir: `../node_modules/@phosphor-icons/core/assets/${variant}`,
  })),
  ...["filled", "outlined", "round", "sharp", "two-tone"].map((variant) => ({
    id: `material-design-${variant}`,
    iconsDir: `../node_modules/@material-design-icons/svg/${variant}`,
  })),
];
